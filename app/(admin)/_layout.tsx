import { Stack } from "expo-router";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

// Admin protection hook
function useProtectedAdminRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAdmin, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const inAdminGroup = segments[0] === "(admin)";
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (!isAdmin && inAdminGroup) {
      // Redirect to home if not admin but trying to access admin routes
      router.replace("/(tabs)");
    }
  }, [isAdmin, isAuthenticated, segments, isLoading]);
}

export default function AdminLayout() {
  // Use the admin protection
  useProtectedAdminRoute();

  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Admin Dashboard",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}