import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useAuthStore } from "@/hooks/useAuthStore";
import { trpc, trpcClient } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Auth protection hook
function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const initialRenderRef = useRef(true);

  useEffect(() => {
    // Skip navigation on the first render to avoid the "navigate before mounting" error
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    
    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated and not in auth group
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to the home page if authenticated and in auth group
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, isLoading]);
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Use the auth protection
  useProtectedRoute();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
    </Stack>
  );
}