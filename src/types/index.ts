export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  caption?: string;
  image_url: string;
  created_at: string;
  profiles?: Profile;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface PostContextType {
  posts: Post[];
  userPosts: Post[];
  loading: boolean;
  createPost: (imageUri: string, caption?: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
  refreshUserPosts: () => Promise<void>;
}
