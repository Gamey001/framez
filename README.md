# Framez - Instagram Clone

A mobile social application built with React Native and Supabase.

## Features

- 🔐 User authentication (Sign up, Login, Logout)
- 📸 Create posts with images and captions
- 📱 Instagram-like feed
- 👤 User profiles with post history
- 💾 Persistent sessions
- 📲 Responsive on iOS and Android

## Tech Stack

- React Native (Expo)
- TypeScript
- Supabase (Auth, Database, Storage)
- React Navigation
- Context API

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (optional)

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy:
   - Project URL
   - Anon key
3. Update `.env` file with your credentials

4. Run this SQL in Supabase SQL Editor:

```sql
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  caption text,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.posts enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Posts policies
create policy "Posts are viewable by everyone"
  on posts for select using (true);

create policy "Authenticated users can create posts"
  on posts for insert with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on posts for update using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on posts for delete using (auth.uid() = user_id);

-- Create storage bucket for post images
insert into storage.buckets (id, name, public) values ('posts', 'posts', true);

-- Storage policies
create policy "Anyone can view post images"
  on storage.objects for select using (bucket_id = 'posts');

create policy "Authenticated users can upload images"
  on storage.objects for insert with check (bucket_id = 'posts' and auth.uid() is not null);
```

### 4. Run the App

```bash
# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### 5. Deploy to Appetize.io

1. Build your app: `expo build:web`
2. Go to [appetize.io](https://appetize.io)
3. Upload your build
4. Get shareable link

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # Context providers (Auth, Posts)
├── navigation/       # Navigation setup
├── screens/          # App screens
├── lib/              # Supabase client
├── types/            # TypeScript types
└── utils/            # Helper functions
```

## Usage

1. Sign up with email and username
2. Log in to access the app
3. Create posts from the + button
4. View feed on home screen
5. Check your profile for your posts

## License

MIT
