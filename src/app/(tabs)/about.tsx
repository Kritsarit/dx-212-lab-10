import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { COLORS, SPACING } from "../../lib/theme";

export default function About() {
  const { session, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>กินในงบ</Text>
      <Text style={styles.text}>แอปช่วยเลือกเมนูไม่ให้เกินงบ</Text>
      <Text style={styles.text}>
        ผู้พัฒนา: กฤษศลิษฎ์ อินทรีย์วงศ์ (6823765166)
      </Text>
      <Text style={styles.sub}>dX212 Mobile Programming คาบ 11</Text>

      <View style={styles.account}>
        {session ? (
          <>
            <Text style={styles.text}>
              เข้าสู่ระบบเป็น {session.user.email}
            </Text>
            <Pressable style={styles.btn} onPress={signOut}>
              <Text style={styles.btnText}>ออกจากระบบ</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.btn} onPress={() => router.push("/login")}>
            <Text style={styles.btnText}>เข้าสู่ระบบ / สมัครสมาชิก</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
    textAlign: "center",
  },
  sub: { fontSize: 14, color: COLORS.muted, marginTop: SPACING.sm },
  account: { marginTop: SPACING.lg, width: "100%", alignItems: "center" },
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
