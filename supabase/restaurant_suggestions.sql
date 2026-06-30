-- Run this once in Supabase Dashboard -> SQL Editor -> New Query.
-- Stores user-submitted "Suggest a Restaurant" requests (app/request.tsx).

create table if not exists restaurant_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  address text not null,
  market text not null check (market in ('NJ', 'NYC')),
  price_range text not null check (price_range in ('$', '$$', '$$$')),
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table restaurant_suggestions enable row level security;

-- Table-level grants (RLS policies below further restrict what each grant can actually do).
grant insert, select on restaurant_suggestions to anon, authenticated;

-- Anyone (including guests / anon) can submit a suggestion.
create policy "Anyone can submit a suggestion"
  on restaurant_suggestions for insert
  with check (true);

-- Users can see their own past suggestions (not required by the app yet, but harmless).
create policy "Users can view their own suggestions"
  on restaurant_suggestions for select
  using (auth.uid() = user_id);
