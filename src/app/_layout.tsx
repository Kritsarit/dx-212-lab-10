import { Stack } from "expo-router";
import { AuthProvider } from "../lib/AuthContext";
import { MenuProvider } from "../lib/MenuContext";
import { COLORS } from "../lib/theme";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MenuProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: "white",
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "หน้าแรก" }}
          />
          <Stack.Screen
            name="login"
            options={{ title: "เข้าสู่ระบบ", presentation: "modal" }}
          />
        </Stack>
      </MenuProvider>
    </AuthProvider>
  );
}