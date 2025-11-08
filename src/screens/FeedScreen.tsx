import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from "react-native";
import { usePosts } from "../contexts/PostContext";
import { Post } from "../types";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function FeedScreen() {
  const { posts, loading, refreshPosts } = usePosts();

  const renderPost = ({ item }: { item: Post }) => {
    const username = item.profiles?.username || "Unknown User";
    const timeAgo = getTimeAgo(item.created_at);

    return (
      <View style={styles.postContainer}>
        {/* Header */}
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color="#999" />
            </View>
            <Text style={styles.username}>{username}</Text>
          </View>
          <Ionicons name="ellipsis-vertical" size={20} color="#000" />
        </View>

        {/* Image */}
        <Image source={{ uri: item.image_url }} style={styles.postImage} />

        {/* Actions */}
        <View style={styles.actions}>
          <View style={styles.leftActions}>
            <Ionicons
              name="heart-outline"
              size={28}
              color="#000"
              style={styles.actionIcon}
            />
            <Ionicons
              name="chatbubble-outline"
              size={26}
              color="#000"
              style={styles.actionIcon}
            />
            <Ionicons
              name="paper-plane-outline"
              size={26}
              color="#000"
              style={styles.actionIcon}
            />
          </View>
          <Ionicons name="bookmark-outline" size={26} color="#000" />
        </View>

        {/* Caption */}
        {item.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>
              <Text style={styles.captionUsername}>{username}</Text>{" "}
              {item.caption}
            </Text>
          </View>
        )}

        {/* Time */}
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Framez</Text>
        <Ionicons name="paper-plane-outline" size={24} color="#000" />
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshPosts} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>
              Start sharing moments by creating your first post!
            </Text>
          </View>
        }
      />
    </View>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  postContainer: {
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#efefef",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  username: {
    fontWeight: "600",
    fontSize: 14,
  },
  postImage: {
    width: width,
    height: width,
    backgroundColor: "#efefef",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  leftActions: {
    flexDirection: "row",
  },
  actionIcon: {
    marginRight: 15,
  },
  captionContainer: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  caption: {
    fontSize: 14,
    lineHeight: 18,
  },
  captionUsername: {
    fontWeight: "600",
  },
  timeAgo: {
    paddingHorizontal: 10,
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
