import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface EditProfileProps {
  navigation: any;
}

interface DropdownOption {
  label: string;
  value: string;
}

const genderOptions: DropdownOption[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'none' },
];

const educationOptions: DropdownOption[] = [
  { label: 'High School', value: 'high_school' },
  { label: 'Bachelor\'s Degree', value: 'bachelor' },
  { label: 'Master\'s Degree', value: 'master' },
  { label: 'Doctorate', value: 'doctorate' },
  { label: 'Other', value: 'other' },
];

/* ── Floating-label input ── */
function FloatingInput({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <View style={inputStyles.wrapper}>
      <Text style={[inputStyles.label, isFloating && inputStyles.labelFloat]}>
        {label}
      </Text>
      <TextInput
        style={inputStyles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
      />
    </View>
  );
}

/* ── Dropdown selector ── */
function DropdownSelect({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  onSelect: (opt: DropdownOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const displayText = selected ? selected.label : 'Select one';

  return (
    <>
      <TouchableOpacity
        style={dropStyles.wrapper}
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
      >
        <Text style={dropStyles.label}>{label}</Text>
        <View style={dropStyles.row}>
          <Text style={[dropStyles.value, !selected && dropStyles.placeholder]}>
            {displayText}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#555" />
        </View>
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={dropStyles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={dropStyles.sheet}>
            <Text style={dropStyles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[dropStyles.option, item.value === value && dropStyles.optionActive]}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text style={[dropStyles.optionText, item.value === value && dropStyles.optionTextActive]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={18} color="#5B67F8" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const BASE_URL = 'http://192.168.0.104:8080';
// TODO: replace with the actual logged-in user's ID
const USER_ID = 1;

/* ── Main screen ── */
export default function EditProfile({ navigation }: EditProfileProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [institute, setInstitute] = useState('');
  const [education, setEducation] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await fetch(`${BASE_URL}/api/users/${USER_ID}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setName(data.name ?? data.username ?? data.fullName ?? '');
        setPhone(data.phone ?? data.phoneNumber ?? '');
        setEmail(data.email ?? '');
        setGender(data.gender ?? '');
        setInstitute(data.institute ?? data.school ?? data.organization ?? '');
        setEducation(data.education ?? data.educationLevel ?? '');
      } catch (err: any) {
        setFetchError(err.message ?? 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = () => {
    // TODO: wire to API
    alert('Profile updated successfully!');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5B67F8" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      )}

      {/* Fetch error banner */}
      {!loading && fetchError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{fetchError}</Text>
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        {/* Avatar area */}
        <View style={styles.avatarSection}>
          <View style={styles.dashedCircle}>
            <View style={styles.avatarInner}>
              <Ionicons name="sunny" size={52} color="#5B67F8" />
            </View>
          </View>
          {/* Camera button */}
          <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.85}>
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Tell a little bit about yourself</Text>

        {/* Form fields */}
        <View style={styles.form}>
          <FloatingInput label="Name" value={name} onChangeText={setName} />
          <FloatingInput label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <FloatingInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <FloatingInput label="Current Password" value={password} onChangeText={setPassword} keyboardType="default" />
          <FloatingInput label="New Password" value={newPassword} onChangeText={setNewPassword} keyboardType="default" />
          <FloatingInput label="Confirm New Password" value={confirmPassword} onChangeText={setConfirmPassword} keyboardType="default" />
        </View>

        {/* Update button */}
        <TouchableOpacity style={styles.updateBtn} activeOpacity={0.85} onPress={handleUpdate}>
          <Text style={styles.updateText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ────────────────── Styles ────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F2FB',
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  backBtn: {
    marginTop: Platform.OS === 'ios' ? 56 : 20,
    marginBottom: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Avatar ── */
  avatarSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  dashedCircle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 2.5,
    borderColor: '#5B67F8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8EAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 4,
    right: '28%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F0F2FB',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  /* ── Subtitle ── */
  subtitle: {
    textAlign: 'center',
    fontSize: 13.5,
    color: '#888',
    marginTop: 10,
    marginBottom: 28,
  },

  /* ── Form ── */
  form: {
    gap: 16,
  },

  /* ── Update button ── */
  updateBtn: {
    marginTop: 28,
    backgroundColor: '#5B67F8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#5B67F8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  updateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  /* ── Loading ── */
  loadingOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F2FB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#888',
  },
  /* ── Error banner ── */
  errorBanner: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 8,
  },
  errorBannerText: {
    color: '#c62828',
    fontSize: 13,
    textAlign: 'center',
  },
});

/* ── Floating input styles ── */
const inputStyles = StyleSheet.create({
  wrapper: {
    borderWidth: 1.5,
    borderColor: '#D0D3E8',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 10,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: 14,
    left: 14,
    fontSize: 14,
    color: '#aaa',
    backgroundColor: '#fff',
    paddingHorizontal: 2,
  },
  labelFloat: {
    top: -9,
    left: 10,
    fontSize: 12,
    color: '#5B67F8',
  },
  input: {
    fontSize: 15,
    color: '#222',
    paddingTop: 2,
    paddingBottom: 0,
  },
});

/* ── Dropdown styles ── */
const dropStyles = StyleSheet.create({
  wrapper: {
    borderWidth: 1.5,
    borderColor: '#D0D3E8',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#5B67F8',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  placeholder: {
    color: '#aaa',
  },

  /* ── Modal sheet ── */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    maxHeight: '60%',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionActive: {
    backgroundColor: '#F0F2FF',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  optionTextActive: {
    color: '#5B67F8',
    fontWeight: '600',
  },
});
