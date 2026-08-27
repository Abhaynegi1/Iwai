import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GuestSessionProvider } from "../src/context/GuestSessionContext";
import { UploadQueueProvider } from "../src/context/UploadQueueContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GuestSessionProvider>
        <UploadQueueProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#0f0d23" },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="join"
              options={{
                headerShown: false,
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="camera"
              options={{
                headerShown: false,
                presentation: "fullScreenModal",
                animation: "fade",
              }}
            />
            <Stack.Screen
              name="event-info"
              options={{
                headerShown: false,
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
          </Stack>
          <StatusBar style="light" />
        </UploadQueueProvider>
      </GuestSessionProvider>
    </SafeAreaProvider>
  );
}
