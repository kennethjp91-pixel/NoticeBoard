# Deployment Guide: Human Notice Board

This guide covers everything you need to take this project from your local machine to a live URL, hosted on your own accounts.

## 1. Supabase Setup (Backend & Database)

You need a Supabase project to handle the database and authentication.

1.  **Create a Project**: Go to [supabase.com](https://supabase.com/), sign up, and create a new project.
2.  **Get Credentials**:
    *   Go to **Project Settings** (cog icon) -> **API**.
    *   Copy the **Project URL**.
    *   Copy the **anon public** key.
    *   *You will need these for Step 3.*

3.  **Database Setup (SQL)**:
    *   Go to the **SQL Editor** (terminal icon) in the left sidebar.
    *   Click **New Query**.
    *   Paste and run the following SQL to create the necessary tables and security policies:

```sql
-- Create a table for user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  is_pro boolean default false,
  post_count integer default 0,
  last_post_date timestamp with time zone,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Create a table for notices
create table notices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null,
  title text,
  body text not null,
  location_lat float not null,
  location_lng float not null,
  location_city text,
  location_desc text,
  is_time_sensitive boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table notices enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Policies for Notices
create policy "Notices are viewable by everyone."
  on notices for select
  using ( true );

create policy "Authenticated users can insert notices."
  on notices for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update own notices."
  on notices for update
  using ( auth.uid() = user_id );

-- Set up Realtime
alter publication supabase_realtime add table notices;
```

## 2. Environment Variables

You need to tell the application how to connect to your Supabase project.

1.  Create a file named `.env.local` in the root of your project (if it doesn't exist).
2.  Add the following lines, replacing the placeholders with your actual credentials from Step 1:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. GitHub Setup (Source Control)

To deploy easily, you should push your code to GitHub.

1.  **Create a Repo**: Go to [github.com/new](https://github.com/new) and create a new empty repository (e.g., `human-notice-board`).
2.  **Push Code**: Run these commands in your terminal:

```bash
# Initialize git if you haven't already
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Link to your GitHub repo (replace URL with yours)
git remote add origin https://github.com/YOUR_USERNAME/human-notice-board.git

# Push to main branch
git push -u origin main
```

## 4. Deployment (Vercel)

Vercel is the creators of Next.js and the easiest place to deploy.

1.  **Import Project**: Go to [vercel.com/new](https://vercel.com/new).
2.  **Select Repo**: Connect your GitHub account and select the `human-notice-board` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Environment Variables**: Expand this section and add the same variables from Step 2:
        *   `NEXT_PUBLIC_SUPABASE_URL`
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4.  **Deploy**: Click **Deploy**.

Vercel will build your app and give you a live URL (e.g., `human-notice-board.vercel.app`).

## 5. Final Checks

*   **Auth**: Sign up for an account on your live site to test that Supabase Auth is working.
*   **Database**: Post a notice and check if it appears in your Supabase `notices` table.
*   **Realtime**: Open the board in two different windows/browsers to see if new notices appear instantly (if realtime is enabled).

## 6. Optional: Seed Initial Data

To populate your board with some initial "mock" posts so it's not empty:

1.  Open `seed.sql` in this project.
2.  Copy the content.
3.  Go to your Supabase Dashboard -> **SQL Editor**.
4.  Paste the SQL.
5.  **IMPORTANT**: Replace `'YOUR_USER_ID_HERE'` with your actual User ID (found in Authentication -> Users).
6.  Click **Run**.

This will insert 9 realistic notices into your database.

That's it! You now have a fully functional, self-hosted Human Notice Board.
