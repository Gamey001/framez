import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { usePosts } from "../contexts/PostContext";
import { Post } from "../types";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const imageSize = width / 3 - 2;

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { userPosts } = usePosts();

  const handleSignOut = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <Image source={{ uri: item.image_url }} style={styles.gridImage} />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>{user?.username}</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={
          <View>
            {/* Profile Info */}
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person-circle" size={80} color="#ddd" />
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{userPosts.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>

            {/* Email */}
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{user?.email}</Text>
            </View>

            {/* Edit Profile Button */}
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Posts Grid Header */}
            <View style={styles.postsHeader}>
              <Ionicons name="grid" size={24} color="#000" />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="camera" size={60} color="#ddd" />
            <Text style={styles.emptyText}>No Posts Yet</Text>
            <Text style={styles.emptySubtext}>
              Share your first photo to get started
            </Text>
          </View>
        }
      />
    </View>
  );
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
  username: {
    fontSize: 20,
    fontWeight: "600",
  },
  profileInfo: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 30,
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  bioContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  bioText: {
    fontSize: 14,
    color: "#262626",
  },
  editButton: {
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  postsHeader: {
    borderTopWidth: 1,
    borderTopColor: "#efefef",
    padding: 15,
    alignItems: "center",
  },
  gridImage: {
    width: imageSize,
    height: imageSize,
    margin: 1,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginTop: 15,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
