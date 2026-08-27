import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GuestSessionProvider } from "../src/context/GuestSessionContext";
import { UploadQueueProvider } from "../src/context/UploadQueueContext";
import { colors } from "../src/theme/colors";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GuestSessionProvider>
        <UploadQueueProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
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
                contentStyle: { backgroundColor: colors.darkBackground },
              }}
            />
            <Stack.Screen
              name="camera"
              options={{
                headerShown: false,
                presentation: "fullScreenModal",
                animation: "fade",
                contentStyle: { backgroundColor: "#000" },
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
          <StatusBar style="auto" />
        </UploadQueueProvider>
      </GuestSessionProvider>
    </SafeAreaProvider>
  );
}
