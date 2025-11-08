import os

def create_file(path, content=""):
    """Create a file with given content"""
    directory = os.path.dirname(path)
    if directory:
        os.makedirs(directory, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Created: {path}")

def create_directory(path):
    """Create a directory"""
    os.makedirs(path, exist_ok=True)
    print(f"✓ Created directory: {path}")

# Create directory structure
directories = [
    "src/components",
    "src/contexts",
    "src/screens",
    "src/navigation",
    "src/lib",
    "src/types",
    "src/utils",
    "assets/images",
]

print("Creating directories...")
for directory in directories:
    create_directory(directory)

print("\nCreating files...")

# Root files
create_file(".gitignore", """# OSX
.DS_Store

# Xcode
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
project.xcworkspace

# Android/IntelliJ
build/
.idea
.gradle
local.properties
*.iml
*.hprof
.cxx/
*.keystore
!debug.keystore

# node.js
node_modules/
npm-debug.log
yarn-error.log

# fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots
fastlane/test_output

# Bundle artifacts
*.jsbundle

# CocoaPods
/ios/Pods/

# Expo
.expo/
.expo-shared/
dist/
web-build/

# Environment
.env
.env.local
""")

create_file(".env", """EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
""")

create_file("app.json", """{
  "expo": {
    "name": "Framez",
    "slug": "framez",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.framez.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.framez.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app needs access to your photos to let you share images."
        }
      ]
    ]
  }
}
""")

create_file("package.json", """{
  "name": "framez",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@supabase/supabase-js": "^2.39.0",
    "expo": "~50.0.0",
    "expo-image-picker": "~14.7.1",
    "expo-status-bar": "~1.11.1",
    "react": "18.2.0",
    "react-native": "0.73.2",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "expo-secure-store": "~12.8.1",
    "@react-native-async-storage/async-storage": "1.21.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "^5.3.0"
  },
  "private": true
}
""")

create_file("tsconfig.json", """{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
""")

create_file("babel.config.js", """module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
""")

create_file("App.tsx", """import { AuthProvider } from './src/contexts/AuthContext';
import { PostProvider } from './src/contexts/PostContext';
import Navigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Navigation />
        <StatusBar style="dark" />
      </PostProvider>
    </AuthProvider>
  );
}
""")

create_file("README.md", """# Framez - Instagram Clone

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
""")

# Placeholder files
create_file("src/components/.gitkeep", "")
create_file("src/contexts/.gitkeep", "")
create_file("src/screens/.gitkeep", "")
create_file("src/navigation/.gitkeep", "")
create_file("src/lib/.gitkeep", "")
create_file("src/types/.gitkeep", "")
create_file("src/utils/.gitkeep", "")

print("\n✅ Framez project structure created successfully!")
print("\nNext steps:")
print("1. Run: npm install")
print("2. Setup Supabase and update .env file")
print("3. Copy the code from artifacts into respective files")
print("4. Run: npm start")