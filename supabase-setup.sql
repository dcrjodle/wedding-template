-- RSVP table
create table if not exists rsvp (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  attending text not null,
  song text,
  has_dietary boolean default false,
  dietary text,
  fun_fact text,
  memory text
);

-- Photos table
create table if not exists photos (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  file_name text not null,
  uploader_name text not null,
  show_on_homepage boolean default false
);

-- Storage bucket for wedding photos
insert into storage.buckets (id, name, public)
values ('wedding-photos', 'wedding-photos', true)
on conflict (id) do nothing;

-- Allow public uploads to the wedding-photos bucket
create policy "Allow public uploads"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'wedding-photos');

-- Allow public reads from the wedding-photos bucket
create policy "Allow public reads"
  on storage.objects for select
  to anon
  using (bucket_id = 'wedding-photos');

-- Allow anonymous inserts to rsvp
create policy "Allow anonymous rsvp inserts"
  on rsvp for insert
  to anon
  with check (true);

-- Allow anonymous inserts to photos
create policy "Allow anonymous photo inserts"
  on photos for insert
  to anon
  with check (true);

-- Allow anonymous reads from photos (for homepage gallery)
create policy "Allow anonymous photo reads"
  on photos for select
  to anon
  using (true);

-- Enable RLS
alter table rsvp enable row level security;
alter table photos enable row level security;
