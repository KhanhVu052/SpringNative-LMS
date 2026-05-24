import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
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

export default function TeacherDetails({ route, navigation }: { route: any; navigation: any }) {
    const { teacherId } = route.params || {};
    const { token } = useUser();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthPlace, setBirthPlace] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [subject, setSubject] = useState('');

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

    const fetchTeacherDetails = async () => {
        if (!token) {
            setError('Authorization token is missing.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${BASE_URL}/api/teachers/${teacherId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (!res.ok) {
                throw new Error(`Server returned error: ${res.status}`);
            }

            const data = await res.json();
            
            setFirstName(data.firstName ?? '');
            setLastName(data.lastName ?? '');
            setBirthDate(data.birthDate ?? '');
            setBirthPlace(data.birthPlace ?? '');
            setQualifications(data.qualifications ?? '');
            setSubject(data.subject ?? '');

        } catch (err: any) {
            console.error('Failed to fetch teacher details:', err.message);
            setError(err.message ?? 'Failed to load teacher details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (teacherId) {
            fetchTeacherDetails();
        } else {
            setError('No teacher ID provided.');
            setLoading(false);
        }
    }, [teacherId, token]);

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            Alert.alert('Validation Error', 'First Name and Last Name are required.');
            return;
        }
        if (!subject.trim()) {
            Alert.alert('Validation Error', 'Subject specialization is required.');
            return;
        }

        try {
            setSaving(true);
            const body = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                birthDate: birthDate.trim(),
                birthPlace: birthPlace.trim(),
                qualifications: qualifications.trim(),
                subject: subject.trim(),
            };

            const res = await fetch(`${BASE_URL}/api/teachers/${teacherId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || `Server error: ${res.status}`);
            }

            Alert.alert('Success', 'Teacher details updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Failed to update teacher profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Teacher Account?',
            'Are you sure you want to delete this instructor? This action cannot be undone and will permanently remove their profile records.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setSaving(true);
                            const res = await fetch(`${BASE_URL}/api/teachers/${teacherId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (!res.ok) {
                                const errText = await res.text();
                                throw new Error(errText || `Server error: ${res.status}`);
                            }

                            Alert.alert('Deleted', 'Teacher has been deleted successfully.', [
                                { text: 'OK', onPress: () => navigation.goBack() }
                            ]);
                        } catch (err: any) {
                            Alert.alert('Error', err.message ?? 'Failed to delete teacher.');
                        } finally {
                            setSaving(false);
                        }
                    }
                }
            ]
        );
    };

    const fullName = `${firstName} ${lastName}`.trim() || 'Instructor Profile';

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
                <Text style={styles.headerTitle}>Teacher Details</Text>
                <TouchableOpacity onPress={() => navigation.navigate('my-courses')} style={styles.headerBtn}>
                    <Ionicons name="home" size={24} color="#1E293B" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.loadingText}>Fetching instructor details...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchTeacherDetails}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* User Card Header */}
                    <View style={styles.avatarCard}>
                        <View style={styles.avatarCircle}>
                            <Ionicons name="school" size={44} color="#10B981" />
                        </View>
                        <Text style={styles.cardUsername}>{fullName}</Text>
                        <Text style={styles.cardSubject}>📚 {subject || 'No Subject Listed'}</Text>
                    </View>

                    {/* Form Controls */}
                    <Text style={styles.sectionTitle}>Identity Fields</Text>
                    
                    <View style={styles.formCard}>
                        {/* First Name */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                style={styles.input}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="Enter first name..."
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
                                placeholder="Enter last name..."
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
                                <Ionicons name="calendar-outline" size={20} color="#10B981" style={styles.dateIcon} />
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

                    <Text style={styles.sectionTitle}>Syllabus & Qualification</Text>
                    
                    <View style={styles.formCard}>
                        {/* Subject */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Subject Specialization</Text>
                            <TextInput
                                style={styles.input}
                                value={subject}
                                onChangeText={setSubject}
                                placeholder="e.g. Mathematics, Science"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        {/* Qualifications */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Qualifications & Credentials</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={qualifications}
                                onChangeText={setQualifications}
                                placeholder="Degrees, teaching experiences, credentials..."
                                placeholderTextColor="#94A3B8"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <TouchableOpacity
                        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={styles.btnIcon} />
                                <Text style={styles.saveBtnText}>Save Instructor Profile</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.deleteBtn, saving && styles.deleteBtnDisabled]}
                        onPress={handleDelete}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="trash-outline" size={20} color="#FFFFFF" style={styles.btnIcon} />
                                <Text style={styles.deleteBtnText}>Delete Teacher Account</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            )}
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    errorText: {
        marginTop: 12,
        fontSize: 15,
        color: '#EF4444',
        textAlign: 'center',
        lineHeight: 22,
    },
    retryBtn: {
        marginTop: 20,
        backgroundColor: '#10B981',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    avatarCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ECFDF5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#A7F3D0',
    },
    cardUsername: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 6,
    },
    cardSubject: {
        fontSize: 13.5,
        fontWeight: '600',
        color: '#475569',
    },
    sectionTitle: {
        fontSize: 13.5,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        paddingLeft: 2,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    formGroup: {
        marginBottom: 20,
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
    saveBtn: {
        backgroundColor: '#10B981',
        borderRadius: 12,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    saveBtnDisabled: {
        backgroundColor: '#6EE7B7',
    },
    deleteBtn: {
        backgroundColor: '#EF4444',
        borderRadius: 12,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        marginTop: 12,
    },
    deleteBtnDisabled: {
        backgroundColor: '#FCA5A5',
    },
    btnIcon: {
        marginRight: 8,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    deleteBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
