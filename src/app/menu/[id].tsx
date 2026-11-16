import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { useMenus } from "../../lib/MenuContext";
import { COLORS, SPACING } from "../../lib/theme";

export default function MenuDetail() {
  const { session } = useAuth();
  const { menus, loading, updatePrice, deleteMenu } = useMenus();
  const { id } = useLocalSearchParams<{ id: string }>();
  const menu = menus.find((m) => m.id === Number(id));

  const [newPrice, setNewPrice] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!menu) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>ไม่พบเมนูนี้</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.btnText}>← กลับ</Text>
        </Pressable>
      </View>
    );
  }

  const isOwner = session !== null && menu.created_by === session.user.id;

  const handleUpdate = async () => {
    const price = Number(newPrice);
    if (newPrice.trim() === "" || isNaN(price) || price <= 0) {
      setMessage("ราคาต้องเป็นตัวเลขมากกว่า 0");
      return;
    }
    const error = await updatePrice(menu.id, price);
    setMessage(error ? "❌ " + error : "✔ บันทึกราคาแล้ว");
    if (!error) setNewPrice("");
  };

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    const error = await deleteMenu(menu.id);
    if (error) {
      setMessage("❌ " + error);
      setConfirming(false);
      return;
    }
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: menu.name }} />
      <Text style={styles.emoji}>{menu.emoji}</Text>
      <Text style={styles.title}>{menu.name}</Text>
      <Text style={styles.price}>{menu.price} บาท</Text>

      <View style={styles.tags}>
        <Text style={styles.tag}>{menu.category}</Text>
        {menu.spicy && <Text style={[styles.tag, styles.spicy]}>เผ็ด</Text>}
      </View>

      {isOwner ? (
        <View style={styles.ownerBox}>
          <Text style={styles.ownerTitle}>เมนูของคุณ</Text>
          <TextInput
            style={styles.input}
            placeholder={`ราคาใหม่ (ตอนนี้ ${menu.price})`}
            keyboardType="numeric"
            value={newPrice}
            onChangeText={setNewPrice}
          />
          <Pressable style={styles.btn} onPress={handleUpdate}>
            <Text style={styles.btnText}>บันทึกราคา</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.danger]} onPress={handleDelete}>
            <Text style={styles.btnText}>
              {confirming ? "กดอีกครั้งเพื่อยืนยันการลบ" : "ลบเมนูนี้"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.note}>
          {menu.created_by
            ? "เมนูนี้เพิ่มโดยผู้ใช้อื่น — แก้/ลบไม่ได้"
            : "เมนูของร้าน — แก้/ลบไม่ได้"}
        </Text>
      )}

      {message !== "" && <Text style={styles.note}>{message}</Text>}

      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.btnText}>← กลับ</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bg,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.bg,
  },
  emoji: { fontSize: 72, marginTop: SPACING.md },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 4,
  },
  tags: { flexDirection: "row", gap: 8, marginTop: SPACING.sm },
  tag: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.muted,
  },
  spicy: { color: "#dc2626", borderColor: "#fca5a5" },
  ownerBox: {
    width: "100%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ownerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  danger: { backgroundColor: "#dc2626", marginTop: 8 },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
  note: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 12,
    textAlign: "center",
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: SPACING.lg,
  },
});
