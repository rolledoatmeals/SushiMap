-- ============================================================
-- Sushi Map — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── REGIONS ────────────────────────────────────────────────
create table regions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  type        text not null check (type in ('city', 'neighborhood', 'borough', 'special')),
  parent_id   uuid references regions(id),
  bounds      jsonb,
  created_at  timestamptz not null default now()
);

-- ─── RESTAURANTS ────────────────────────────────────────────
create table restaurants (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  address           text not null,
  city              text not null,
  state             text not null,
  zip               text,
  lat               numeric(10, 7) not null,
  lng               numeric(10, 7) not null,
  phone             text,
  website           text,
  google_place_id   text unique,
  status            text not null default 'active'
                      check (status in ('active', 'closed_temporarily', 'closed_permanently', 'pending', 'unverified')),
  region_id         uuid references regions(id),
  neighborhood      text,
  is_ayce           boolean not null default true,
  created_by        uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz
);

create index restaurants_lat_lng_idx on restaurants(lat, lng);
create index restaurants_region_idx on restaurants(region_id);
create index restaurants_status_idx on restaurants(status);
create index restaurants_name_search_idx on restaurants using gin(to_tsvector('english', name));

-- ─── RESTAURANT PRICING ─────────────────────────────────────
create table restaurant_pricing (
  id                  uuid primary key default gen_random_uuid(),
  restaurant_id       uuid not null references restaurants(id),
  meal_period         text not null check (
                        meal_period in ('lunch', 'dinner', 'weekend_lunch', 'weekend_dinner', 'all_day', 'kids', 'special')
                      ),
  price_per_person    numeric(6, 2) not null,
  currency            text not null default 'USD',
  notes               text,
  verification_source text not null default 'pending'
                        check (verification_source in ('owner', 'admin', 'community', 'pending')),
  verified_by         uuid references auth.users(id),
  last_verified_at    timestamptz,
  confidence_score    int not null default 30 check (confidence_score between 0 and 100),
  is_current          boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index restaurant_pricing_idx on restaurant_pricing(restaurant_id, is_current);

-- ─── RESTAURANT HOURS ───────────────────────────────────────
create table restaurant_hours (
  id                  uuid primary key default gen_random_uuid(),
  restaurant_id       uuid not null references restaurants(id),
  day_of_week         int not null check (day_of_week between 0 and 6),
  open_time           time,
  close_time          time,
  is_closed           boolean not null default false,
  verification_source text not null default 'pending'
                        check (verification_source in ('owner', 'admin', 'community', 'pending')),
  last_verified_at    timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (restaurant_id, day_of_week)
);

-- ─── RESTAURANT ATTRIBUTES ──────────────────────────────────
create table restaurant_attributes (
  restaurant_id   uuid not null references restaurants(id),
  attribute       text not null check (
                    attribute in (
                      'byo_wine', 'byo_beer', 'byo_sake',
                      'parking_free', 'parking_paid',
                      'reservations', 'walk_in_only',
                      'delivery', 'takeout', 'private_dining',
                      'halal', 'wheelchair_accessible', 'outdoor_seating'
                    )
                  ),
  primary key (restaurant_id, attribute)
);

-- ─── RESTAURANT MEDIA ───────────────────────────────────────
create table restaurant_media (
  id                uuid primary key default gen_random_uuid(),
  restaurant_id     uuid not null references restaurants(id),
  storage_path      text not null,
  url               text not null,
  uploaded_by       uuid references auth.users(id),
  is_featured       boolean not null default false,
  is_official       boolean not null default false,
  moderation_status text not null default 'pending'
                      check (moderation_status in ('approved', 'pending', 'rejected')),
  sort_order        int not null default 0,
  created_at        timestamptz not null default now()
);

create index restaurant_media_idx on restaurant_media(restaurant_id, moderation_status);

-- ─── PROFILES ───────────────────────────────────────────────
create table profiles (
  id                        uuid primary key references auth.users(id) on delete cascade,
  display_name              text,
  avatar_url                text,
  is_verified_contributor   boolean not null default false,
  is_admin                  boolean not null default false,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── JOURNAL ENTRIES ────────────────────────────────────────
create table journal_entries (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id),
  restaurant_id   uuid not null references restaurants(id),
  visited_at      date not null,
  price_paid      numeric(6, 2),
  notes           text,
  is_shared       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

create index journal_entries_user_idx on journal_entries(user_id, visited_at desc);
create index journal_entries_restaurant_idx on journal_entries(restaurant_id);

-- ─── JOURNAL MEDIA ──────────────────────────────────────────
create table journal_media (
  id                uuid primary key default gen_random_uuid(),
  journal_entry_id  uuid not null references journal_entries(id) on delete cascade,
  storage_path      text not null,
  url               text not null,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now()
);

-- ─── REVIEWS ────────────────────────────────────────────────
create table reviews (
  id                    uuid primary key default gen_random_uuid(),
  restaurant_id         uuid not null references restaurants(id),
  user_id               uuid not null references auth.users(id),
  journal_entry_id      uuid references journal_entries(id),
  fish_quality          int not null check (fish_quality between 1 and 5),
  value_rating          int check (value_rating between 1 and 5),
  service_rating        int check (service_rating between 1 and 5),
  refill_speed_rating   int check (refill_speed_rating between 1 and 5),
  atmosphere_rating     int check (atmosphere_rating between 1 and 5),
  would_return          text check (would_return in ('yes', 'no', 'maybe')),
  body                  text,
  visited_month         int check (visited_month between 1 and 12),
  visited_year          int check (visited_year >= 2020),
  price_paid            numeric(6, 2),
  helpful_count         int not null default 0,
  moderation_status     text not null default 'pending'
                          check (moderation_status in ('approved', 'pending', 'flagged', 'rejected')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  deleted_at            timestamptz,
  unique (user_id, restaurant_id)
);

create index reviews_restaurant_idx on reviews(restaurant_id, moderation_status);
create index reviews_user_idx on reviews(user_id);

-- ─── REVIEW MEDIA ───────────────────────────────────────────
create table review_media (
  id                uuid primary key default gen_random_uuid(),
  review_id         uuid not null references reviews(id) on delete cascade,
  storage_path      text not null,
  url               text not null,
  moderation_status text not null default 'pending'
                      check (moderation_status in ('approved', 'pending', 'rejected')),
  created_at        timestamptz not null default now()
);

-- ─── REVIEW REPORTS ─────────────────────────────────────────
create table review_reports (
  id          uuid primary key default gen_random_uuid(),
  review_id   uuid not null references reviews(id),
  reporter_id uuid not null references auth.users(id),
  reason      text not null check (
                reason in ('spam', 'inaccurate', 'inappropriate', 'conflict_of_interest', 'other')
              ),
  details     text,
  status      text not null default 'pending'
                check (status in ('pending', 'reviewed', 'dismissed')),
  created_at  timestamptz not null default now(),
  unique (review_id, reporter_id)
);

-- ─── SAVED RESTAURANTS ──────────────────────────────────────
create table saved_restaurants (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id),
  restaurant_id   uuid not null references restaurants(id),
  created_at      timestamptz not null default now(),
  unique (user_id, restaurant_id)
);

-- ─── PASSPORT STAMPS ────────────────────────────────────────
create table passport_stamps (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id),
  restaurant_id     uuid not null references restaurants(id),
  region_id         uuid not null references regions(id),
  journal_entry_id  uuid references journal_entries(id),
  earned_at         timestamptz not null default now(),
  unique (user_id, restaurant_id)
);

create index passport_stamps_user_idx on passport_stamps(user_id, region_id);

-- ─── PASSPORT COLLECTIONS ───────────────────────────────────
create table passport_collections (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text,
  region_id       uuid references regions(id),
  required_count  int not null,
  badge_url       text,
  rarity          text not null check (rarity in ('common', 'uncommon', 'rare', 'legendary')),
  type            text not null check (type in ('regional', 'neighborhood', 'hidden_gem', 'special')),
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

-- ─── RESTAURANT CORRECTIONS ─────────────────────────────────
create table restaurant_corrections (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references restaurants(id),
  submitted_by    uuid references auth.users(id),
  field           text not null,
  current_value   jsonb,
  suggested_value jsonb not null,
  notes           text,
  status          text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected', 'duplicate')),
  reviewed_by     uuid references auth.users(id),
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now()
);

create index restaurant_corrections_idx on restaurant_corrections(restaurant_id, status);

-- ─── RESTAURANT OWNER CLAIMS ────────────────────────────────
create table restaurant_owner_claims (
  id                    uuid primary key default gen_random_uuid(),
  restaurant_id         uuid not null references restaurants(id),
  claimant_id           uuid not null references auth.users(id),
  verification_method   text,
  verification_notes    text,
  status                text not null default 'pending'
                          check (status in ('pending', 'approved', 'rejected')),
  reviewed_by           uuid references auth.users(id),
  created_at            timestamptz not null default now()
);

-- ─── REVIEW SUMMARY VIEW ────────────────────────────────────
create view restaurant_review_summaries as
select
  restaurant_id,
  count(*)                                                                  as review_count,
  round(avg(fish_quality)::numeric, 2)                                     as avg_fish_quality,
  round(avg(value_rating)::numeric, 2)                                     as avg_value,
  round(avg(service_rating)::numeric, 2)                                   as avg_service,
  round(avg(refill_speed_rating)::numeric, 2)                              as avg_refill_speed,
  round(avg(atmosphere_rating)::numeric, 2)                                as avg_atmosphere,
  round(
    100.0 * count(*) filter (where would_return = 'yes') /
    nullif(count(*) filter (where would_return is not null), 0),
    1
  )                                                                         as would_return_percent
from reviews
where moderation_status = 'approved' and deleted_at is null
group by restaurant_id;

-- ─── HELPFUL COUNT RPC ──────────────────────────────────────
create or replace function increment_review_helpful(review_id uuid)
returns void language sql security definer as $$
  update reviews set helpful_count = helpful_count + 1 where id = review_id;
$$;

-- ─── UPDATED_AT TRIGGERS ────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger restaurants_updated_at       before update on restaurants       for each row execute function set_updated_at();
create trigger restaurant_pricing_updated_at before update on restaurant_pricing for each row execute function set_updated_at();
create trigger restaurant_hours_updated_at  before update on restaurant_hours  for each row execute function set_updated_at();
create trigger profiles_updated_at          before update on profiles          for each row execute function set_updated_at();
create trigger journal_entries_updated_at   before update on journal_entries   for each row execute function set_updated_at();
create trigger reviews_updated_at           before update on reviews           for each row execute function set_updated_at();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────
alter table restaurants              enable row level security;
alter table restaurant_pricing       enable row level security;
alter table restaurant_hours         enable row level security;
alter table restaurant_attributes    enable row level security;
alter table restaurant_media         enable row level security;
alter table restaurant_corrections   enable row level security;
alter table restaurant_owner_claims  enable row level security;
alter table profiles                 enable row level security;
alter table journal_entries          enable row level security;
alter table journal_media            enable row level security;
alter table reviews                  enable row level security;
alter table review_media             enable row level security;
alter table review_reports           enable row level security;
alter table saved_restaurants        enable row level security;
alter table passport_stamps          enable row level security;
alter table passport_collections     enable row level security;

-- Restaurants
create policy "Public read non-pending restaurants"
  on restaurants for select using (status != 'pending' and deleted_at is null);
create policy "Admins write restaurants"
  on restaurants for all using (exists (select 1 from profiles where id = auth.uid() and is_admin));

-- Pricing / Hours / Attributes — public read
create policy "Public read pricing"     on restaurant_pricing    for select using (is_current = true);
create policy "Public read hours"       on restaurant_hours      for select using (true);
create policy "Public read attributes"  on restaurant_attributes for select using (true);

-- Media
create policy "Public read approved media"
  on restaurant_media for select using (moderation_status = 'approved');
create policy "Auth users upload media"
  on restaurant_media for insert with check (auth.uid() is not null and uploaded_by = auth.uid());

-- Profiles
create policy "Users read own profile"   on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Journal
create policy "Users manage own journal"
  on journal_entries for all using (auth.uid() = user_id);
create policy "Users manage own journal media"
  on journal_media for all
  using (exists (select 1 from journal_entries where id = journal_media.journal_entry_id and user_id = auth.uid()));

-- Reviews
create policy "Public read approved reviews"
  on reviews for select using (moderation_status = 'approved' and deleted_at is null);
create policy "Auth users create reviews"
  on reviews for insert with check (auth.uid() = user_id);
create policy "Users update own reviews"
  on reviews for update using (auth.uid() = user_id);

create policy "Public read approved review media"
  on review_media for select using (moderation_status = 'approved');
create policy "Auth users upload review media"
  on review_media for insert
  with check (auth.uid() is not null and exists (select 1 from reviews where id = review_media.review_id and user_id = auth.uid()));

create policy "Auth users report reviews"
  on review_reports for insert with check (auth.uid() = reporter_id);

-- Saved
create policy "Users manage own saved"
  on saved_restaurants for all using (auth.uid() = user_id);

-- Passport
create policy "Users read own stamps"
  on passport_stamps for select using (auth.uid() = user_id);
create policy "Users earn stamps"
  on passport_stamps for insert with check (auth.uid() = user_id);
create policy "Public read collections"
  on passport_collections for select using (true);

-- Corrections
create policy "Auth users submit corrections"
  on restaurant_corrections for insert with check (auth.uid() = submitted_by);
create policy "Admins manage corrections"
  on restaurant_corrections for all
  using (exists (select 1 from profiles where id = auth.uid() and is_admin));
