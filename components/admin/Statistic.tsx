import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const BASE_URL = 'http://10.0.2.2:8080';

type StatData = {
    teachers: number;
    students: number;
    courses: number;
    enrollments: number;
};

export default function Statistic({ navigation }: { navigation: any }) {
    const { token } = useUser();
    const [stats, setStats] = useState<StatData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async (showLoadingIndicator = true) => {
        if (!token) {
            setError('Authorization token is missing.');
            setLoading(false);
            return;
        }

        try {
            if (showLoadingIndicator) setLoading(true);
            setError(null);

            const res = await fetch(`${BASE_URL}/api/admin/statistics`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            if (!res.ok) {
                throw new Error(`Server returned error: ${res.status}`);
            }

            const data = await res.json();

            // Map keys flexibly to handle diverse backend models
            const teachers = data.teachers ?? data.teacher ?? data.teacherCount ?? 0;
            const students = data.students ?? data.student ?? data.studentCount ?? 0;
            const courses = data.courses ?? data.course ?? data.courseCount ?? 0;
            const enrollments = data.enrollments ?? data.enrollment ?? data.enrollmentCount ?? 0;

            setStats({ teachers, students, courses, enrollments });
        } catch (err: any) {
            console.error('Failed to fetch statistics:', err.message);
            setError(err.message ?? 'Failed to load statistics data.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats(true);
    }, [token]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchStats(false);
    }, [token]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" />


            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                    <Text style={styles.loadingText}>Analyzing records...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => fetchStats(true)}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
                    }
                >
                    <View style={styles.heroCard}>
                        <Text style={styles.heroSubtitle}>Platform Overview</Text>
                        <Text style={styles.heroTitle}>E-Learning Admin Dashboard</Text>
                        <Text style={styles.heroDesc}>
                            Real-time overview of current active instructors, learners, syllabus materials, and student enrollments.
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Key Indicators</Text>

                    <View style={styles.statsGrid}>
                        {/* Teachers */}
                        <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
                            <View style={[styles.iconWrapper, { backgroundColor: '#ECFDF5' }]}>
                                <Ionicons name="school" size={24} color="#10B981" />
                            </View>
                            <Text style={styles.statLabel}>Teachers</Text>
                            <Text style={styles.statNumber}>{stats?.teachers}</Text>
                        </View>

                        {/* Students */}
                        <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
                            <View style={[styles.iconWrapper, { backgroundColor: '#EFF6FF' }]}>
                                <Ionicons name="people" size={24} color="#3B82F6" />
                            </View>
                            <Text style={styles.statLabel}>Students</Text>
                            <Text style={styles.statNumber}>{stats?.students}</Text>
                        </View>

                        {/* Courses */}
                        <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
                            <View style={[styles.iconWrapper, { backgroundColor: '#FFFBEB' }]}>
                                <Ionicons name="book" size={24} color="#F59E0B" />
                            </View>
                            <Text style={styles.statLabel}>Courses</Text>
                            <Text style={styles.statNumber}>{stats?.courses}</Text>
                        </View>

                        {/* Enrollments */}
                        <View style={[styles.statCard, { borderLeftColor: '#EC4899' }]}>
                            <View style={[styles.iconWrapper, { backgroundColor: '#FDF2F8' }]}>
                                <Ionicons name="checkmark-done-circle" size={24} color="#EC4899" />
                            </View>
                            <Text style={styles.statLabel}>Enrollments</Text>
                            <Text style={styles.statNumber}>{stats?.enrollments}</Text>
                        </View>
                    </View>

                    {/* Quick Tips */}
                    <View style={styles.tipCard}>
                        <Ionicons name="information-circle-outline" size={20} color="#4F46E5" />
                        <Text style={styles.tipText}>
                            Swipe down to reload statistics from the backend server database.
                        </Text>
                    </View>
                </ScrollView>
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
    heroCard: {
        backgroundColor: '#4F46E5',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        elevation: 4,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    heroSubtitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#E0E7FF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    heroDesc: {
        fontSize: 13.5,
        color: '#C7D2FE',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 16,
        paddingLeft: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        borderLeftWidth: 5,
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 4,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2F6',
        borderRadius: 12,
        padding: 14,
        marginTop: 24,
        gap: 10,
    },
    tipText: {
        flex: 1,
        fontSize: 12,
        color: '#4F46E5',
        fontWeight: '500',
    },
});
