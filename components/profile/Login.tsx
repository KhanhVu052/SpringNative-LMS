import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { useUser } from '../../context/UserContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Login() {
  const { login, loading } = useUser();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    try {
      await login(usernameOrEmail.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleAutoFill = (role: 'admin' | 'student') => {
    setError(null);
    if (role === 'admin') {
      setUsernameOrEmail('admin');
      setPassword('12345678');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Decorative Top Background */}
        <View style={styles.topBanner}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="graduation-cap" size={48} color="#4F46E5" />
          </View>
          <Text style={styles.appName}>CourseHub</Text>
          <Text style={styles.appSubtitle}>E-Learning Management System</Text>
        </View>

        {/* Card Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          {error && (
            <View style={styles.errorContainer}>
              <FontAwesome5 name="exclamation-circle" size={16} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Username/Email Input */}
          <Text style={styles.inputLabel}>Username or Email</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="user" size={18} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your username or email"
              placeholderTextColor="#9CA3AF"
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome5 name="lock" size={18} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
              <FontAwesome5 name={secureText ? 'eye-slash' : 'eye'} size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Quick Sandbox Autofill Box */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>DEMO ACCOUNTS</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.autofillContainer}>
            <TouchableOpacity
              style={styles.autofillButton}
              onPress={() => handleAutoFill('admin')}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="user-shield" size={14} color="#4F46E5" />
              <Text style={styles.autofillText}>Admin Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  topBanner: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 18,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#111827',
    fontSize: 15,
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    paddingHorizontal: 12,
    letterSpacing: 1,
  },
  autofillContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  autofillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderColor: '#E0E7FF',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  autofillText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '600',
  },
});
