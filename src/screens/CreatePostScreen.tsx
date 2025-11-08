import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { usePosts } from "../contexts/PostContext";
import { Ionicons } from "@expo/vector-icons";

export default function CreatePostScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const { createPost } = usePosts();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image");
      return;
    }

    setLoading(true);
    try {
      await createPost(imageUri, caption);
      Alert.alert("Success", "Post created successfully!");
      setImageUri(null);
      setCaption("");
      navigation.navigate("Feed");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity onPress={handlePost} disabled={loading || !imageUri}>
          <Text
            style={[
              styles.postButton,
              (!imageUri || loading) && styles.postButtonDisabled,
            ]}
          >
            {loading ? "Posting..." : "Share"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Picker */}
      {!imageUri ? (
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Ionicons name="camera" size={60} color="#999" />
          <Text style={styles.imagePickerText}>Tap to select a photo</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={pickImage}
          >
            <Text style={styles.changeImageText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Caption Input */}
      <View style={styles.captionContainer}>
        <TextInput
          style={styles.captionInput}
          placeholder="Write a caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={2200}
        />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0095f6" />
          <Text style={styles.loadingText}>Creating post...</Text>
        </View>
      )}
    </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  postButton: {
    color: "#0095f6",
    fontSize: 16,
    fontWeight: "600",
  },
  postButtonDisabled: {
    opacity: 0.3,
  },
  imagePicker: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    margin: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#efefef",
    borderStyle: "dashed",
  },
  imagePickerText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
  },
  imageContainer: {
    margin: 15,
  },
  image: {
    width: "100%",
    height: 400,
    borderRadius: 10,
  },
  changeImageButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#efefef",
    borderRadius: 8,
    alignItems: "center",
  },
  changeImageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  captionContainer: {
    padding: 15,
  },
  captionInput: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#000",
  },
});
