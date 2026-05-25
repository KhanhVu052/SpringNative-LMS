import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

import { useCourseContext } from "./context/CourseContext";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE_URL } from "./config";

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  let parentUserContext: any = null;
  try {
    const { useUser } = require("../../context/UserContext");
    parentUserContext = useUser();
  } catch (e) {
    // Outside parent UserContext
  }

  const resolveUserRole = (data: any) => {
    if (!data) return 'ROLE_STUDENT';
    const roleVal = data.role || data.roleName || '';
    if (roleVal) return roleVal;

    const uName = (data.username || '').toLowerCase();
    const uEmail = (data.email || '').toLowerCase();

    if (uName === 'admin' || uEmail.includes('admin')) {
      return 'ROLE_ADMIN';
    }
    if (uName.includes('teacher') || uName.includes('instructor') || uEmail.includes('teacher') || uEmail.includes('instructor')) {
      return 'ROLE_TEACHER';
    }
    return 'ROLE_STUDENT';
  };

  let router: any;
  if (parentUserContext) {
    try {
      const { useNavigation } = require("@react-navigation/native");
      const nav = useNavigation();
      router = {
        replace: (path: string) => {
          if (path.includes("register")) {
            nav.navigate("register");
          } else {
            nav.navigate(path.replace("/", ""));
          }
        },
        push: (path: string) => {
          if (path.includes("register")) {
            nav.navigate("register");
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

  const courseContext = useCourseContext();
  const login = courseContext ? courseContext.login : () => { };
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      Alert.alert("Error", "Please fill in your username/email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        usernameOrEmail,
        password,
      });

      const { token, id, username, email } = response.data;


      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ id, username, email }),
      );

      login({ id, username, email });

      if (parentUserContext) {
        if (parentUserContext.setToken) parentUserContext.setToken(token);
        if (parentUserContext.setUserId) parentUserContext.setUserId(String(id));
        if (parentUserContext.setRole) {
          const resolvedRole = resolveUserRole({ username, email, role: response.data?.role, roleName: response.data?.roleName });
          parentUserContext.setRole(resolvedRole);
        }
      }

      Alert.alert("Successful", "Logged in successfully!");
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Login Error:", error);
      let message = "Login failed. Please check your information.";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Alert.alert("Lỗi", message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = Linking.createURL('campus');
      const loginUrl = `${API_BASE_URL}/api/auth/oauth2-init?provider=google&app_redirect=${encodeURIComponent(redirectUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUrl);

      if (result.type === 'success') {
        const url = result.url;
        const parsedUrl = Linking.parse(url);

        // Bóc tách tham số từ query parameters
        const token = parsedUrl.queryParams?.token as string;
        const username = parsedUrl.queryParams?.username as string;
        const email = parsedUrl.queryParams?.email as string;
        const idStr = parsedUrl.queryParams?.id as string;
        const id = idStr ? parseInt(idStr, 10) : 0;

        if (token) {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', JSON.stringify({ id, username, email }));

          login({ id, username, email });

          if (parentUserContext) {
            if (parentUserContext.setToken) parentUserContext.setToken(token);
            if (parentUserContext.setUserId) parentUserContext.setUserId(String(id));
            if (parentUserContext.setRole) {
              const roleParam = parsedUrl.queryParams?.role as string;
              const resolvedRole = resolveUserRole({ username, email, role: roleParam });
              parentUserContext.setRole(resolvedRole);
            }
          }

          Alert.alert("Successful", "Logged in with Google successfully!");
          router.replace("/(tabs)");
        }
      }
    } catch (error) {
      console.error("Error logging in with Google: ", error);
      Alert.alert("Error", "Login with Google failed.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      const redirectUrl = Linking.createURL('campus');
      const loginUrl = `${API_BASE_URL}/api/auth/oauth2-init?provider=github&app_redirect=${encodeURIComponent(redirectUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUrl);

      if (result.type === 'success') {
        const url = result.url;
        const parsedUrl = Linking.parse(url);

        // Bóc tách tham số từ query parameters
        const token = parsedUrl.queryParams?.token as string;
        const username = parsedUrl.queryParams?.username as string;
        const email = parsedUrl.queryParams?.email as string;
        const idStr = parsedUrl.queryParams?.id as string;
        const id = idStr ? parseInt(idStr, 10) : 0;

        if (token) {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', JSON.stringify({ id, username, email }));

          login({ id, username, email });

          if (parentUserContext) {
            if (parentUserContext.setToken) parentUserContext.setToken(token);
            if (parentUserContext.setUserId) parentUserContext.setUserId(String(id));
            if (parentUserContext.setRole) {
              const roleParam = parsedUrl.queryParams?.role as string;
              const resolvedRole = resolveUserRole({ username, email, role: roleParam });
              parentUserContext.setRole(resolvedRole);
            }
          }

          Alert.alert("Successful", "Logged in with GitHub successfully!");
          router.replace("/(tabs)");
        }
      }
    } catch (error) {
      console.error("Error logging in with GitHub: ", error);
      Alert.alert("Error", "Login with GitHub failed.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {Stack && !parentUserContext && (
        <Stack.Screen
          options={{
            headerLeft: () => (
              <Pressable onPress={() => router.replace('/(tabs)')} style={{ padding: 8, marginLeft: Platform.OS === 'ios' ? -8 : 0 }}>
                <FontAwesome name="arrow-left" size={20} color="#101828" />
              </Pressable>
            ),
          }}
        />
      )}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <View style={styles.laptopScreen} />
            <View style={styles.laptopBase} />
            <View style={styles.userCircle} />
            <View style={styles.userBody} />
          </View>
        </View>

        <Text style={styles.heading}>Log in</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username or Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username or email"
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
            keyboardType="default"
            autoCapitalize="none"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password"
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
        </View>

        <Pressable
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          style={[styles.googleButton, { marginBottom: 12 }]}
          onPress={handleGoogleLogin}
        >
          <FontAwesome
            name="google"
            size={18}
            color="#EA4335"
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Log in with Google</Text>
        </Pressable>

        <Pressable
          style={styles.googleButton}
          onPress={handleGithubLogin}
        >
          <FontAwesome
            name="github"
            size={20}
            color="#181717"
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Log in with GitHub</Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => {
            router.push('/register'); // <-- Đổi thành router.push hoặc router.replace tùy bạn
          }}>
            <Text style={styles.footerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    backgroundColor: "#F8F9FF",
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  illustration: {
    width: 220,
    height: 220,
    borderRadius: 32,
    backgroundColor: "#E9EEFF",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  laptopScreen: {
    width: 160,
    height: 100,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: 30,
  },
  laptopBase: {
    width: 180,
    height: 26,
    borderRadius: 14,
    backgroundColor: "#CBD5E1",
    position: "absolute",
    bottom: 30,
  },
  userCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#5D5FEF",
    position: "absolute",
    top: 58,
  },
  userBody: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7C6CFF",
    position: "absolute",
    top: 120,
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#475467",
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: "600",
  },
  input: {
    height: 56,
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0F172A",
  },
  eyeIcon: {
    padding: 16,
  },
  primaryButton: {
    backgroundColor: "#5D5FEF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
  },
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 32,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 16,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingBottom: 20,
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
});
