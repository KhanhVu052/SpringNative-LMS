import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

// Dynamically resolve expo-router to support standard React Navigation environments
let useRouter: any = () => ({ replace: () => { }, push: () => { } });
let Stack: any = null;
try {
  const expoRouter = require("expo-router");
  useRouter = expoRouter.useRouter;
  Stack = expoRouter.Stack;
} catch (e) {
  // Not inside expo-router
}

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { API_BASE_URL } from "./config";

export default function RegisterScreen() {
  let parentUserContext: any = null;
  try {
    const { useUser } = require("../../context/UserContext");
    parentUserContext = useUser();
  } catch (e) {
    // Outside parent UserContext
  }

  let router: any;
  if (parentUserContext) {
    try {
      const { useNavigation } = require("@react-navigation/native");
      const nav = useNavigation();
      router = {
        replace: (path: string) => {
          if (path.includes("login")) {
            try { nav.goBack(); } catch (e) { }
          } else {
            nav.navigate(path.replace("/", ""));
          }
        },
        push: (path: string) => {
          if (path.includes("login")) {
            try { nav.goBack(); } catch (e) { }
          } else {
            nav.navigate(path.replace("/", ""));
          }
        }
      };
    } catch (e) {
      router = { replace: () => { }, push: () => { } };
    }
  } else {
    try {
      router = useRouter();
    } catch (e) {
      router = { replace: () => { }, push: () => { } };
    }
  }

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // --- Bắt đầu kiểm tra dữ liệu phía client ---
    if (!username || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường thông tin.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        "Lỗi",
        "Định dạng email không hợp lệ. Vui lòng kiểm tra lại.",
      );
      return;
    }

    // Regex to check for at least one uppercase letter, one number, and one special character
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Lỗi",
        "Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt.",
      );
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Lỗi", "Bạn phải đồng ý với Điều khoản & Điều kiện.");
      return;
    }
    // --- Kết thúc kiểm tra dữ liệu ---

    setLoading(true);
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      Alert.alert(
        "Thành công",
        "Tài khoản đã được tạo! Vui lòng đăng nhập.",
      );
      router.push("/login");
    } catch (error: any) {
      console.log("Registration Error:", error);
      let message = "Đăng ký thất bại. Vui lòng thử lại.";

      if (typeof error.response?.data === 'string') {
        message = error.response.data;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      }

      Alert.alert("Lỗi", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Register</Text>
        <Pressable
          style={styles.termsRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View
            style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}
          >
            {acceptedTerms && <View style={styles.checkboxInner} />}
          </View>

          <Text style={styles.termsText}>
            I agree to the Terms & Conditions and Privacy Policy.
          </Text>
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#94A3B8"
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#94A3B8"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#94A3B8"
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="#94A3B8"
            />
          </Pressable>
        </View>

        <Pressable
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.footerLink}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    backgroundColor: "#F8F9FF",
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 16,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: "#5D5FEF",
    borderColor: "#5D5FEF",
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  termsText: {
    flex: 1,
    color: "#475467",
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    height: 56,
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#0F172A",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0F172A",
  },
  primaryButton: {
    backgroundColor: "#5D5FEF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  flex: {
    flex: 1,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    color: "#64748B",
    fontSize: 15,
  },
  footerLink: {
    color: "#5D5FEF",
    fontWeight: "700",
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  eyeIcon: {
    padding: 16,
  },
});
