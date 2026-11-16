import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { useMenus } from "../../lib/MenuContext";
import { COLORS, SPACING } from "../../lib/theme";

const CATEGORIES = ["ข้าว", "เส้น", "เครื่องดื่ม", "จานเดียว"];
const EMOJIS = ["🍛", "🍜", "🧋", "🍨", "🍗", "🥗"];

export default function AddMenu() {
  const { session } = useAuth();
  const { addMenu } = useMenus();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("ข้าว");
  const [spicy, setSpicy] = useState(false);
  const [emoji, setEmoji] = useState("🍛");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>ต้องเข้าสู่ระบบก่อนเพิ่มเมนู</Text>
        <Pressable style={styles.saveBtn} onPress={() => router.push("/login")}>
          <Text style={styles.saveText}>เข้าสู่ระบบ / สมัครสมาชิก</Text>
        </Pressable>
      </View>
    );
  }

  const priceNum = Number(price);
  const isValid = name.trim() !== "" && !isNaN(priceNum) && priceNum > 0;

  const handleSave = async () => {
    setSubmitted(true);
    if (!isValid) return;

    const error = await addMenu({
      name: name.trim(),
      price: priceNum,
      category,
      spicy,
      emoji,
    });

    if (error) {
      setMessage("❌ " + error);
      return;
    }

    setName("");
    setPrice("");
    setSpicy(false);
    setSubmitted(false);
    setMessage("");
    router.navigate("/");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>ชื่อเมนู</Text>
      <TextInput
        style={styles.input}
        placeholder="เช่น ข้าวผัดกุ้ง"
        value={name}
        onChangeText={setName}
      />
      {submitted && name.trim() === "" && (
        <Text style={styles.error}>กรุณากรอกชื่อเมนู</Text>
      )}

      <Text style={styles.label}>ราคา (บาท)</Text>
      <TextInput
        style={styles.input}
        placeholder="เช่น 55"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      {submitted && (isNaN(priceNum) || priceNum <= 0) && (
        <Text style={styles.error}>ราคาต้องมากกว่า 0</Text>
      )}

      <Text style={styles.label}>หมวดหมู่</Text>
      <View style={styles.row}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.chip, category === cat && styles.chipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={category === cat ? styles.chipTextActive : styles.chipText}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>ไอคอน</Text>
      <View style={styles.row}>
        {EMOJIS.map((em) => (
          <Pressable
            key={em}
            style={[styles.chip, emoji === em && styles.chipActive]}
            onPress={() => setEmoji(em)}
          >
            <Text style={{ fontSize: 20 }}>{em}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>เมนูเผ็ด</Text>
        <Switch value={spicy} onValueChange={setSpicy} />
      </View>

      {message !== "" && <Text style={styles.error}>{message}</Text>}

      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>บันทึกเมนู</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.lg, backgroundColor: COLORS.bg },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: SPACING.md,
    marginBottom: 6,
    color: COLORS.text,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  error: { color: "#dc2626", marginTop: 4, fontSize: 14 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.text },
  chipTextActive: { color: "white", fontWeight: "bold" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: 40,
  },
  saveText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
