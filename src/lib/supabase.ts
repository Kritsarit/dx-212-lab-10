import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";
import "react-native-url-polyfill/auto";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const canStore = Platform.OS !== "web" || typeof window !== "undefined";

export const supabase = createClient(url, key, {
  auth: {
    storage: canStore ? AsyncStorage : undefined,
    persistSession: canStore,
    autoRefreshToken: canStore,
    detectSessionInUrl: false,
  },
});

if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
