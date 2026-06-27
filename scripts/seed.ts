/**
 * Sushi Map — Database Seed Script
 *
 * Reads local JSON data files and upserts them into Supabase.
 * Run when ready to launch: npx ts-node -r tsconfig-paths/register scripts/seed.ts
 *
 * Required env vars (in .env, never committed):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  ← service role key bypasses RLS for seeding
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';
import type { Restaurant } from '../types/restaurant';
import type { Region } from '../types/region';

// Load .env manually (ts-node doesn't load it automatically)
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = value;
  }
}

const supabaseUrl = process.env['SUPABASE_URL'];
const serviceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function loadJSON<T>(filePath: string): T {
  const abs = path.resolve(__dirname, '..', filePath);
  return JSON.parse(fs.readFileSync(abs, 'utf-8')) as T;
}

async function seedRegions(regions: Region[]): Promise<void> {
  process.stdout.write(`Seeding ${regions.length} regions... `);

  const parents = regions.filter(r => r.parentId === null);
  const children = regions.filter(r => r.parentId !== null);

  for (const region of [...parents, ...children]) {
    const { error } = await supabase.from('regions').upsert({
      id: region.id,
      name: region.name,
      slug: region.slug,
      type: region.type,
      parent_id: region.parentId,
      bounds: region.bounds,
      created_at: region.createdAt,
    });
    if (error) throw new Error(`Region "${region.name}": ${error.message}`);
  }

  console.log('✓');
}

async function seedRestaurant(r: Restaurant): Promise<void> {
  const { error: rErr } = await supabase.from('restaurants').upsert({
    id: r.id,
    name: r.name,
    slug: r.slug,
    address: r.address,
    city: r.city,
    state: r.state,
    zip: r.zip,
    lat: r.lat,
    lng: r.lng,
    phone: r.phone,
    website: r.website,
    status: r.status,
    region_id: r.regionId,
    neighborhood: r.neighborhood,
    is_ayce: r.isAyce,
    created_at: r.createdAt,
    updated_at: r.updatedAt,
  });
  if (rErr) throw new Error(`Restaurant "${r.name}": ${rErr.message}`);

  if (r.pricing.length > 0) {
    const { error } = await supabase.from('restaurant_pricing').upsert(
      r.pricing.map(p => ({
        id: p.id,
        restaurant_id: p.restaurantId,
        meal_period: p.mealPeriod,
        price_per_person: p.pricePerPerson,
        currency: p.currency,
        notes: p.notes,
        verification_source: p.verificationSource,
        verified_by: p.verifiedBy,
        last_verified_at: p.lastVerifiedAt,
        confidence_score: p.confidenceScore,
        is_current: p.isCurrent,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      })),
    );
    if (error) throw new Error(`Pricing for "${r.name}": ${error.message}`);
  }

  if (r.hours.length > 0) {
    const { error } = await supabase.from('restaurant_hours').upsert(
      r.hours.map(h => ({
        restaurant_id: h.restaurantId,
        day_of_week: h.dayOfWeek,
        open_time: h.openTime,
        close_time: h.closeTime,
        is_closed: h.isClosed,
        verification_source: h.verificationSource,
        last_verified_at: h.lastVerifiedAt,
      })),
      { onConflict: 'restaurant_id,day_of_week' },
    );
    if (error) throw new Error(`Hours for "${r.name}": ${error.message}`);
  }

  if (r.attributes.length > 0) {
    await supabase.from('restaurant_attributes').delete().eq('restaurant_id', r.id);
    const { error } = await supabase.from('restaurant_attributes').insert(
      r.attributes.map(attr => ({ restaurant_id: r.id, attribute: attr })),
    );
    if (error) throw new Error(`Attributes for "${r.name}": ${error.message}`);
  }
}

async function seedRestaurants(restaurants: Restaurant[]): Promise<void> {
  console.log(`Seeding ${restaurants.length} restaurants:`);
  for (const restaurant of restaurants) {
    process.stdout.write(`  ${restaurant.name}... `);
    await seedRestaurant(restaurant);
    console.log('✓');
  }
}

async function main(): Promise<void> {
  console.log('🍣 Sushi Map — Database Seed\n');

  const regions = loadJSON<Region[]>('data/regions.json');
  const restaurants: Restaurant[] = [
    ...loadJSON<Restaurant[]>('data/restaurants.nyc.json'),
    ...loadJSON<Restaurant[]>('data/restaurants.nj.json'),
  ];

  try {
    await seedRegions(regions);
    await seedRestaurants(restaurants);

    console.log(`\n✅ Seed complete`);
    console.log(`   ${regions.length} regions`);
    console.log(`   ${restaurants.length} restaurants`);
  } catch (err) {
    console.error('\n❌ Seed failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
