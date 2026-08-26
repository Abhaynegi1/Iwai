import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GuestSessionProvider } from "../src/context/GuestSessionContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GuestSessionProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#1b184e" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
            contentStyle: { backgroundColor: "#0f0d23" },
          }}
        />
        <StatusBar style="light" />
      </GuestSessionProvider>
    </SafeAreaProvider>
  );
}
