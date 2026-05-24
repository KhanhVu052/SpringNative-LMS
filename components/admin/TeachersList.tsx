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

type TeacherItem = {
    id: string;
    firstName: string;
    lastName: string;
    subject: string;
    qualifications: string;
    birthPlace: string;
    birthDate: string;
};

export default function TeachersList({ navigation }: { navigation: any }) {
    const { token } = useUser();
    const [teachers, setTeachers] = useState<TeacherItem[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<TeacherItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');

    const fetchTeachers = async (showLoadingIndicator = true) => {
        if (!token) {
            setError('Authorization token is missing.');
            setLoading(false);
            return;
        }

        try {
            if (showLoadingIndicator) setLoading(true);
            setError(null);

            const res = await fetch(`${BASE_URL}/api/teachers`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (!res.ok) {
                throw new Error(`Server returned error: ${res.status}`);
            }

            const data = await res.json();
            const mapped: TeacherItem[] = (Array.isArray(data) ? data : []).map((item: any, index: number) => ({
                id: String(item.id ?? index),
                firstName: item.firstName ?? '',
                lastName: item.lastName ?? '',
                subject: item.subject ?? 'N/A',
                qualifications: item.qualifications ?? 'N/A',
                birthPlace: item.birthPlace ?? '',
                birthDate: item.birthDate ?? '',
            }));

            setTeachers(mapped);
            applyFilter(searchText, mapped);
        } catch (err: any) {
            console.error('Failed to fetch teachers:', err.message);
            setError(err.message ?? 'Failed to load teachers.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTeachers(true);
    }, [token]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTeachers(false);
    }, [token]);

    const applyFilter = (text: string, list: TeacherItem[]) => {
        if (!text.trim()) {
            setFilteredTeachers(list);
            return;
        }
        const query = text.toLowerCase();
        const filtered = list.filter(
            (t) =>
                t.firstName.toLowerCase().includes(query) ||
                t.lastName.toLowerCase().includes(query) ||
                t.subject.toLowerCase().includes(query) ||
                t.qualifications.toLowerCase().includes(query)
        );
        setFilteredTeachers(filtered);
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        applyFilter(text, teachers);
    };

    const renderTeacherCard = ({ item }: { item: TeacherItem }) => {
        const fullName = `${item.firstName} ${item.lastName}`.trim() || 'Anonymous Teacher';

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('teacher-details', { teacherId: item.id })}
            >
                <View style={styles.avatarWrapper}>
                    <Ionicons name="school" size={22} color="#10B981" />
                </View>
                <View style={styles.infoWrapper}>
                    <Text style={styles.nameText} numberOfLines={1}>{fullName}</Text>
                    <Text style={styles.subjectText} numberOfLines={1}>📚 {item.subject}</Text>
                    {item.qualifications !== 'N/A' && (
                        <Text style={styles.qualificationText} numberOfLines={1}>
                            🎓 {item.qualifications}
                        </Text>
                    )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Instructors</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={() => navigation.navigate('create-teacher')} style={styles.headerBtn}>
                        <Ionicons name="add-circle-outline" size={25} color="#10B981" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('my-courses')} style={styles.headerBtn}>
                        <Ionicons name="home" size={24} color="#1E293B" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Input */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name, subject, degree..."
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
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.loadingText}>Fetching system instructors...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => fetchTeachers(true)}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredTeachers}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTeacherCard}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="people-outline" size={48} color="#94A3B8" />
                            <Text style={styles.emptyText}>No instructors found matching search.</Text>
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
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
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
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#ECFDF5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoWrapper: {
        flex: 1,
        marginRight: 12,
    },
    nameText: {
        fontSize: 15.5,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    subjectText: {
        fontSize: 12.5,
        color: '#475569',
        fontWeight: '500',
        marginBottom: 2,
    },
    qualificationText: {
        fontSize: 12,
        color: '#64748B',
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
