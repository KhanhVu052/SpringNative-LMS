import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useUser } from '../../context/UserContext';

const BASE_URL = 'http://10.0.2.2:8080';

export default function CreateTeacher({ navigation }: { navigation: any }) {
    const { token } = useUser();
    const [submitting, setSubmitting] = useState(false);

    // Form fields state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthPlace, setBirthPlace] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [subject, setSubject] = useState('');

    // Birth Date logic
    const [birthDate, setBirthDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

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

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setBirthDate(formatDate(selectedDate));
        }
    };

    const validateForm = () => {
        if (!username.trim()) return 'Username is required.';
        if (!password.trim() || password.length < 6) return 'Password must be at least 6 characters.';
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return 'A valid email is required.';
        if (!firstName.trim()) return 'First Name is required.';
        if (!lastName.trim()) return 'Last Name is required.';
        if (!birthDate.trim()) return 'Birth Date is required.';
        if (!birthPlace.trim()) return 'Birth Place is required.';
        if (!subject.trim()) return 'Subject specialization is required.';
        return null;
    };

    const handleCreate = async () => {
        const validationError = validateForm();
        if (validationError) {
            Alert.alert('Validation Error', validationError);
            return;
        }

        if (!token) {
            Alert.alert('Error', 'Authorization token is missing.');
            return;
        }

        try {
            setSubmitting(true);
            const body = {
                username: username.trim(),
                password: password,
                email: email.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                birthDate: birthDate.trim(),
                birthPlace: birthPlace.trim(),
                qualifications: qualifications.trim() || null,
                subject: subject.trim(),
            };

            const res = await fetch(`${BASE_URL}/api/teachers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || `Server error: ${res.status}`);
            }

            Alert.alert('Success', 'Teacher account created successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (err: any) {
            Alert.alert('Registration Failed', err.message ?? 'An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Teacher</Text>
                <TouchableOpacity onPress={() => navigation.navigate('my-courses')} style={styles.headerBtn}>
                    <Ionicons name="home" size={24} color="#1E293B" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Login Credentials</Text>
                <View style={styles.formCard}>
                    {/* Username */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter login username..."
                            placeholderTextColor="#94A3B8"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter password (min 6 chars)..."
                            placeholderTextColor="#94A3B8"
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter professional email..."
                            placeholderTextColor="#94A3B8"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Personal Details</Text>
                <View style={styles.formCard}>
                    {/* First Name */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="First name..."
                            placeholderTextColor="#94A3B8"
                        />
                    </View>

                    {/* Last Name */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Last name..."
                            placeholderTextColor="#94A3B8"
                        />
                    </View>

                    {/* Date of Birth */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Birth Date</Text>
                        <TouchableOpacity
                            style={styles.dateSelector}
                            onPress={() => setShowDatePicker(true)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="calendar-outline" size={20} color="#4F46E5" style={styles.dateIcon} />
                            <Text style={[styles.dateText, !birthDate && styles.datePlaceholder]}>
                                {birthDate
                                    ? parseDate(birthDate).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                      })
                                    : 'Select date of birth...'}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={parseDate(birthDate)}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateChange}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* Place of Birth */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Birth Place</Text>
                        <TextInput
                            style={styles.input}
                            value={birthPlace}
                            onChangeText={setBirthPlace}
                            placeholder="City, Country..."
                            placeholderTextColor="#94A3B8"
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Professional Qualification</Text>
                <View style={styles.formCard}>
                    {/* Subject Specialization */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Subject Specialization</Text>
                        <TextInput
                            style={styles.input}
                            value={subject}
                            onChangeText={setSubject}
                            placeholder="e.g. Mathematics, Computer Science"
                            placeholderTextColor="#94A3B8"
                        />
                    </View>

                    {/* Qualifications details */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Degrees & Qualifications</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={qualifications}
                            onChangeText={setQualifications}
                            placeholder="e.g. PhD in Applied Mathematics, 8 years teaching experience..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Create Button */}
                <TouchableOpacity
                    style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                    onPress={handleCreate}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="person-add-outline" size={20} color="#FFFFFF" style={styles.btnIcon} />
                            <Text style={styles.submitBtnText}>Create Teacher Profile</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginTop: 8,
        paddingLeft: 2,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    formGroup: {
        marginBottom: 18,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 14,
        height: 48,
        fontSize: 14.5,
        color: '#1E293B',
        backgroundColor: '#FFFFFF',
    },
    textArea: {
        height: 100,
        paddingTop: 12,
        paddingBottom: 12,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 14,
        height: 48,
        backgroundColor: '#FFFFFF',
    },
    dateIcon: {
        marginRight: 10,
    },
    dateText: {
        fontSize: 14.5,
        color: '#1E293B',
    },
    datePlaceholder: {
        color: '#94A3B8',
    },
    submitBtn: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        elevation: 3,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    submitBtnDisabled: {
        backgroundColor: '#A5B4FC',
    },
    btnIcon: {
        marginRight: 8,
    },
    submitBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
