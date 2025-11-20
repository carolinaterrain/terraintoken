-- Create meme_submissions table
create table public.meme_submissions (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  x_handle text,
  caption text,
  x_post_url text,
  email text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  engagement_score int default 0,
  placement int,
  prize text,
  contest_date text
);

-- Enable RLS
alter table public.meme_submissions enable row level security;

-- Anyone can insert submissions
create policy "Anyone can insert submissions"
on public.meme_submissions for insert
to anon, authenticated with check (true);

-- Anyone can view approved submissions
create policy "Anyone can view approved submissions"
on public.meme_submissions for select
to anon, authenticated using (status = 'approved' or status = 'pending');

-- Create storage bucket for meme submissions
insert into storage.buckets (id, name, public)
values ('meme-submissions', 'meme-submissions', true);

-- Storage policies for meme uploads
create policy "Anyone can upload memes"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'meme-submissions');

create policy "Anyone can view memes"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'meme-submissions');

-- Create app_role enum for admin system
create type public.app_role as enum ('admin', 'moderator', 'user');

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Admin policy for meme_submissions
create policy "Admins can do everything on submissions"
on public.meme_submissions
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for live updates
alter publication supabase_realtime add table public.meme_submissions;