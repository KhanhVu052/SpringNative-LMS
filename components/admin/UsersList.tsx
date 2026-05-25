import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';

const BASE_URL = 'http://10.0.2.2:8080';

type UserItem = {
    id: string;
    username: string;
    email: string;
    role: string;
};

export default function UsersList({ navigation }: { navigation: any }) {
    const { token } = useUser();
    const [users, setUsers] = useState<UserItem[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');

    const fetchUsers = async (showLoadingIndicator = true) => {
        if (!token) {
            setError('Authorization token is missing.');
            setLoading(false);
            return;
        }

        try {
            if (showLoadingIndicator) setLoading(true);
            setError(null);

            const res = await fetch(`${BASE_URL}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (!res.ok) {
                throw new Error(`Server returned error: ${res.status}`);
            }

            const data = await res.json();
            const mapped: UserItem[] = (Array.isArray(data) ? data : []).map((item: any, index: number) => {
                let roleStr = 'ROLE_STUDENT';
                if (item.role) {
                    roleStr = item.role;
                } else if (item.roleName) {
                    roleStr = item.roleName;
                } else if (Array.isArray(item.roles) && item.roles.length > 0) {
                    roleStr = typeof item.roles[0] === 'object' ? (item.roles[0].name ?? item.roles[0].authority) : item.roles[0];
                }

                return {
                    id: String(item.id ?? index),
                    username: item.username ?? item.fullName ?? item.name ?? 'No Name',
                    email: item.email ?? 'No Email',
                    role: String(roleStr),
                };
            });

            setUsers(mapped);
            applyFilter(searchText, mapped);
        } catch (err: any) {
            console.error('Failed to fetch users:', err.message);
            setError(err.message ?? 'Failed to load system users.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers(true);
    }, [token]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUsers(false);
    }, [token]);

    const applyFilter = (text: string, list: UserItem[]) => {
        if (!text.trim()) {
            setFilteredUsers(list);
            return;
        }
        const query = text.toLowerCase();
        const filtered = list.filter(
            (u) =>
                u.username.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                u.role.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        applyFilter(text, users);
    };

    const getRoleColor = (role: string) => {
        const r = role.toUpperCase();
        if (r.includes('ADMIN')) return { bg: '#FEE2E2', text: '#EF4444' };
        if (r.includes('TEACHER') || r.includes('INSTRUCTOR')) return { bg: '#FEF3C7', text: '#D97706' };
        return { bg: '#E0F2FE', text: '#0284C7' };
    };

    const renderUserCard = ({ item }: { item: UserItem }) => {
        const colors = getRoleColor(item.role);
        const roleLabel = item.role.replace('ROLE_', '');

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('user-detail', { userId: item.id })}
            >
                <View style={styles.avatarWrapper}>
                    <Ionicons name="person" size={20} color="#64748B" />
                </View>
                <View style={styles.infoWrapper}>
                    <Text style={styles.usernameText} numberOfLines={1}>{item.username}</Text>
                    <Text style={styles.emailText} numberOfLines={1}>{item.email}</Text>
                </View>
                <View style={[styles.roleBadge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.roleText, { color: colors.text }]}>{roleLabel}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>

            {/* Search Input */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by username or email..."
                        placeholderTextColor="#94A3B8"
                        value={searchText}
                        onChangeText={handleSearch}
                        autoCapitalize="none"
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearBtn}>
                            <Ionicons name="close-circle" size={18} color="#94A3B8" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                    <Text style={styles.loadingText}>Fetching system users...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => fetchUsers(true)}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={renderUserCard}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="people-outline" size={48} color="#94A3B8" />
                            <Text style={styles.emptyText}>No users matched your query.</Text>
                        </View>
                    }
                />
            )}
        </View>
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
    searchSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
    },
    clearBtn: {
        padding: 4,
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
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
    },
    avatarWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoWrapper: {
        flex: 1,
        marginRight: 12,
    },
    usernameText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 2,
    },
    emailText: {
        fontSize: 12.5,
        color: '#64748B',
    },
    roleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    roleText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
});
