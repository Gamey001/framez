import React from "react";
import { View, StyleSheet, Platform } from "react-native";

interface WebContainerProps {
  children: React.ReactNode;
}

export default function WebContainer({ children }: WebContainerProps) {
  if (Platform.OS === "web") {
    return (
      <View style={styles.webWrapper}>
        <View style={styles.webContainer}>{children}</View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  webContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 600, // Tablet size
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
