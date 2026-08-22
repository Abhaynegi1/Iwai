import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { APP_NAME } from "@iwai/shared";

/**
 * IWAI Mobile — Placeholder Home Screen
 *
 * This is a minimal placeholder screen to confirm:
 *   - Expo + expo-router works
 *   - Workspace package imports work (@iwai/shared)
 *   - TypeScript is configured correctly
 *
 * Replace this with the actual camera-first experience.
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Logo mark */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>I</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.subtitle}>Event Memory & Photo Sharing</Text>

      {/* Status */}
      <View style={styles.badge}>
        <View style={styles.dot} />
        <Text style={styles.badgeText}>Infrastructure ready</Text>
      </View>

      {/* Placeholder action */}
      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Join an Event</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>Feature development starting soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b184e",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: "#9db1ff",
    textAlign: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34d399",
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#5a5af7",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  hint: {
    color: "#7585ff",
    fontSize: 13,
    marginTop: 8,
  },
});
