import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Post, PostContextType } from "../types";
import { useAuth } from "./AuthContext";
import * as FileSystem from "expo-file-system";

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshPosts();
      refreshUserPosts();
    }
  }, [user]);

  const refreshPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false });

    if (data && !error) {
      setPosts(data);
    }
    setLoading(false);
  };

  const refreshUserPosts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data && !error) {
      setUserPosts(data);
    }
  };

  const createPost = async (imageUri: string, caption?: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: "base64" as any,
      });

      // Convert base64 to array buffer
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Upload to Supabase Storage
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("posts")
        .upload(fileName, byteArray, {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(fileName);

      // Create post record
      const { error: postError } = await supabase.from("posts").insert({
        user_id: user.id,
        image_url: publicUrl,
        caption: caption || null,
      });

      if (postError) throw postError;

      // Refresh posts
      await refreshPosts();
      await refreshUserPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        userPosts,
        loading,
        createPost,
        refreshPosts,
        refreshUserPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
}
