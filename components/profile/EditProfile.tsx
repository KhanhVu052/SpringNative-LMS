import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface EditProfileProps {
  navigation: any;
}

/* ── Floating-label input ── */
function FloatingInput({
  label,
  value,
  onChangeText,
  keyboardType,
  multiline,
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <View style={[inputStyles.wrapper, multiline && inputStyles.wrapperMultiline]}>
      <Text style={[inputStyles.label, isFloating && inputStyles.labelFloat]}>
        {label}
      </Text>
      <TextInput
        style={[inputStyles.input, multiline && inputStyles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
        multiline={multiline}
        maxLength={maxLength}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

/* ── Date picker field ── */
function DatePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (dateStr: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);

  const parseDate = (str: string): Date => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const d = new Date(str + 'T00:00:00');
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  };

  const formatDate = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const displayValue = value
    ? parseDate(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Select date';

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(formatDate(selectedDate));
    }
  };

  return (
    <>
      <TouchableOpacity
        style={dateStyles.wrapper}
        activeOpacity={0.8}
        onPress={() => setShowPicker(true)}
      >
        <Text style={dateStyles.label}>{label}</Text>
        <View style={dateStyles.row}>
          <Ionicons name="calendar-outline" size={20} color="#5B67F8" style={dateStyles.icon} />
          <Text style={[dateStyles.value, !value && dateStyles.placeholder]}>
            {displayValue}
          </Text>
        </View>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={parseDate(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </>
  );
}

const BASE_URL = 'http://10.0.2.2:8080';
// TODO: replace with the actual logged-in teacher's ID
const TEACHER_ID = 1;

/* ── Main screen ── */
export default function EditProfile({ navigation }: EditProfileProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [subject, setSubject] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await fetch(`${BASE_URL}/api/teachers/${TEACHER_ID}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Expected JSON but received:', contentType, text.substring(0, 500));
          throw new Error('Server returned non-JSON response.');
        }
        const data = await res.json();
        setFirstName(data.firstName ?? '');
        setLastName(data.lastName ?? '');
        setBirthDate(data.birthDate ?? '');
        setBirthPlace(data.birthPlace ?? '');
        setSubject(data.subject ?? '');
        setQualifications(data.qualifications ?? '');
      } catch (err: any) {
        setFetchError(err.message ?? 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, []);

  const validateDate = (dateStr: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
    const parsed = new Date(dateStr);
    return !isNaN(parsed.getTime());
  };

  const handleUpdate = async () => {
    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Validation Error', 'First Name and Last Name are required.');
      return;
    }
    if (!birthDate.trim() || !validateDate(birthDate.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid Birth Date (YYYY-MM-DD).');
      return;
    }
    if (!birthPlace.trim()) {
      Alert.alert('Validation Error', 'Birth Place is required.');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Validation Error', 'Subject is required.');
      return;
    }

    try {
      setSaving(true);
      const body = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate: birthDate.trim(),
        birthPlace: birthPlace.trim(),
        subject: subject.trim(),
        qualifications: qualifications.trim() || null,
      };
      const res = await fetch(`${BASE_URL}/api/teachers/${TEACHER_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.text();
        console.error('Update failed:', errData);
        throw new Error(`Update failed: ${res.status}`);
      }
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Failed to update profile');
    } finally {
      setSaving(false);
    }
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
              <Ionicons name="person" size={52} color="#5B67F8" />
            </View>
          </View>
          {/* Camera button */}
          <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.85}>
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Update your teacher profile</Text>

        {/* Section: Personal Information */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.form}>
          <FloatingInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            maxLength={100}
          />
          <FloatingInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            maxLength={100}
          />
          <DatePickerField
            label="Birth Date"
            value={birthDate}
            onChange={setBirthDate}
          />
          <FloatingInput
            label="Birth Place"
            value={birthPlace}
            onChangeText={setBirthPlace}
            maxLength={200}
          />
        </View>

        {/* Section: Professional Information */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Professional Information</Text>
        <View style={styles.form}>
          <FloatingInput
            label="Subject"
            value={subject}
            onChangeText={setSubject}
            maxLength={200}
          />
          <FloatingInput
            label="Qualifications"
            value={qualifications}
            onChangeText={setQualifications}
            multiline
            maxLength={1000}
          />
        </View>

        {/* Update button */}
        <TouchableOpacity
          style={[styles.updateBtn, saving && styles.updateBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleUpdate}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.updateText}>Update Profile</Text>
          )}
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
    paddingTop: 16,
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

  /* ── Section title ── */
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 14,
    marginLeft: 2,
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
  updateBtnDisabled: {
    backgroundColor: '#9DA4F9',
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
  wrapperMultiline: {
    paddingBottom: 14,
    minHeight: 100,
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
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

/* ── Date picker styles ── */
const dateStyles = StyleSheet.create({
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
  },
  icon: {
    marginRight: 10,
  },
  value: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  placeholder: {
    color: '#aaa',
  },
});
