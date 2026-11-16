import { Tabs } from "expo-router";
import { COLORS } from "../../lib/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: "white",
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "เมนู" }} />
      <Tabs.Screen name="add" options={{ title: "เพิ่มเมนู" }} />
      <Tabs.Screen name="about" options={{ title: "เกี่ยวกับ" }} />
    </Tabs>
  );
}
