import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    ActivityIndicator,
    Alert,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';

const BASE_URL = 'http://10.0.2.2:8080';

export default function UserDetail({ route, navigation }: { route: any; navigation: any }) {
    const { userId } = route.params || {};
    const { token } = useUser();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [provider, setProvider] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [role, setRole] = useState('ROLE_STUDENT');

    const fetchUserDetails = async () => {
        if (!token) {
            setError('Authorization token is missing.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (!res.ok) {
                throw new Error(`Server returned error: ${res.status}`);
            }

            const data = await res.json();

            setUsername(data.username ?? '');
            setEmail(data.email ?? '');
            setProvider(data.provider ?? 'local');
            setIsActive(data.isActive ?? data.active ?? data.enabled ?? true);

            // Map role safely
            let roleStr = 'ROLE_STUDENT';
            if (data.role) {
                roleStr = data.role;
            } else if (data.roleName) {
                roleStr = data.roleName;
            } else if (Array.isArray(data.roles) && data.roles.length > 0) {
                roleStr = typeof data.roles[0] === 'object' ? (data.roles[0].name ?? data.roles[0].authority) : data.roles[0];
            }
            setRole(roleStr);

        } catch (err: any) {
            console.error('Failed to fetch user details:', err.message);
            setError(err.message ?? 'Failed to load user details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        } else {
            setError('No user ID provided.');
            setLoading(false);
        }
    }, [userId, token]);

    const handleSave = async () => {
        if (!email.trim()) {
            Alert.alert('Validation Error', 'Email cannot be empty.');
            return;
        }

        try {
            setSaving(true);
            const body = {
                email: email.trim(),
                provider: provider.trim(),
                isActive: isActive,
                username: username, // Keep username read-only but send it if needed
                role: role
            };

            const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
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

            Alert.alert('Success', 'User details updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Failed to update user.');
        } finally {
            setSaving(false);
        }
    };
    const handleDelete = () => {
        Alert.alert(
            'Delete User Account?',
            'Are you sure you want to delete this user? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setSaving(true);
                            const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (!res.ok) {
                                const errText = await res.text();
                                throw new Error(errText || `Server error: ${res.status}`);
                            }

                            Alert.alert('Deleted', 'User has been deleted successfully.', [
                                { text: 'OK', onPress: () => navigation.goBack() }
                            ]);
                        } catch (err: any) {
                            Alert.alert('Error', err.message ?? 'Failed to delete user.');
                        } finally {
                            setSaving(false);
                        }
                    }
                }
            ]
        );
    };
    const getRoleBadgeStyle = (userRole: string) => {
        const r = userRole.toUpperCase();
        if (r.includes('ADMIN')) return { bg: '#FEE2E2', text: '#EF4444' };
        if (r.includes('TEACHER') || r.includes('INSTRUCTOR')) return { bg: '#FEF3C7', text: '#D97706' };
        return { bg: '#E0F2FE', text: '#0284C7' };
    };

    const roleColors = getRoleBadgeStyle(role);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Details</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                    <Text style={styles.loadingText}>Fetching user profile details...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchUserDetails}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* User Card Header */}
                    <View style={styles.avatarCard}>
                        <View style={styles.avatarCircle}>
                            <Ionicons name="person" size={44} color="#4F46E5" />
                        </View>
                        <Text style={styles.cardUsername}>{username}</Text>
                        <View style={[styles.roleBadge, { backgroundColor: roleColors.bg }]}>
                            <Text style={[styles.roleText, { color: roleColors.text }]}>
                                {role.replace('ROLE_', '')}
                            </Text>
                        </View>
                    </View>

                    {/* Form Controls */}
                    <Text style={styles.sectionTitle}>Account Details</Text>

                    <View style={styles.formCard}>
                        {/* Username (Read Only) */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={[styles.input, styles.inputDisabled]}
                                value={username}
                                editable={false}
                                selectTextOnFocus={false}
                            />
                            <Text style={styles.fieldHelper}>Username cannot be edited.</Text>
                        </View>

                        {/* Email Input */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="Enter user email..."
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        {/* Provider Input */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Identity Provider</Text>
                            <TextInput
                                style={styles.input}
                                value={provider}
                                onChangeText={setProvider}
                                autoCapitalize="none"
                                placeholder="e.g. local, google, github"
                                placeholderTextColor="#94A3B8"
                            />
                            <Text style={styles.fieldHelper}>The auth provider source for this login.</Text>
                        </View>

                        {/* Active Toggle Switch */}
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleTextCol}>
                                <Text style={styles.toggleLabel}>Active Status</Text>
                                <Text style={styles.toggleDesc}>
                                    Toggle whether this user account can log in or access the application.
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#CBD5E1', true: '#C7D2FE' }}
                                thumbColor={isActive ? '#4F46E5' : '#64748B'}
                                ios_backgroundColor="#CBD5E1"
                                onValueChange={setIsActive}
                                value={isActive}
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
                                <Text style={styles.saveBtnText}>Save User Modifications</Text>
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
                                <Text style={styles.deleteBtnText}>Delete User Account</Text>
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
        flex: 1,
        textAlign: 'center',
    },
    headerTitle: {
        flex: 6,
        fontSize: 18,
        paddingLeft: 12,
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
        backgroundColor: '#4F46E5',
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
        backgroundColor: '#EEF2F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    cardUsername: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
    },
    roleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 8,
    },
    roleText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionTitle: {
        fontSize: 15,
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
    inputDisabled: {
        backgroundColor: '#F8F9FD',
        color: '#64748B',
        borderColor: '#E2E8F0',
    },
    fieldHelper: {
        fontSize: 11.5,
        color: '#94A3B8',
        marginTop: 6,
        fontWeight: '500',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1.5,
        borderTopColor: '#F1F5F9',
        paddingTop: 20,
        marginTop: 8,
    },
    toggleTextCol: {
        flex: 1,
        marginRight: 16,
    },
    toggleLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    toggleDesc: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 16,
    },
    saveBtn: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    saveBtnDisabled: {
        backgroundColor: '#A5B4FC',
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
