import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const BASE_URL = 'http://10.0.2.2:8080';

type PathDetails = {
    id: number;
    level: string;
    description: string;
    points: number;
    durationWeeks: number;
    overview: string;
};

type LearningContent = {
    id: number;
    title: string;
    type: string;
    description: string;
    contentUrl: string;
    points: number;
    orderIndex: number;
};

const TYPE_ICONS: Record<string, { name: string; color: string }> = {
    video: { name: 'videocam-outline', color: '#E53935' },
    article: { name: 'document-text-outline', color: '#1E88E5' },
    quiz: { name: 'help-circle-outline', color: '#FB8C00' },
    assignment: { name: 'clipboard-outline', color: '#43A047' },
};

interface LearningPathProps {
    route: any;
    navigation: any;
}

export default function LearningPath({ route, navigation }: LearningPathProps) {
    const { courseId, pathId, courseName } = route.params || {};

    const [path, setPath] = useState<PathDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [lessons, setLessons] = useState<LearningContent[]>([]);
    const [lessonsLoading, setLessonsLoading] = useState(false);

    const fetchPathDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${BASE_URL}/api/courses/${courseId}/paths/${pathId}`);
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setPath({
                id: data.id ?? 0,
                level: data.level || 'N/A',
                description: data.description || '',
                points: data.points ?? 0,
                durationWeeks: data.durationWeeks ?? 0,
                overview: data.overview || '',
            });
        } catch (err: any) {
            setError(err.message ?? 'Failed to load path details');
        } finally {
            setLoading(false);
        }
    };

    const fetchLessons = async () => {
        try {
            setLessonsLoading(true);
            const res = await fetch(`${BASE_URL}/api/courses/${courseId}/paths/${pathId}/contents`);
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            const mapped: LearningContent[] = (Array.isArray(data) ? data : []).map((item: any) => ({
                id: item.id ?? 0,
                title: item.title || 'Untitled',
                type: item.type || 'article',
                description: item.description || '',
                contentUrl: item.contentUrl || '',
                points: item.points ?? 0,
                orderIndex: item.orderIndex ?? 0,
            }));
            setLessons(mapped);
        } catch (err: any) {
            console.error('Failed to fetch lessons:', err.message);
        } finally {
            setLessonsLoading(false);
        }
    };

    const getIcon = (type: string) => {
        return TYPE_ICONS[type.toLowerCase()] ?? { name: 'document-outline', color: '#757575' };
    };

    useFocusEffect(
        useCallback(() => {
            if (courseId && pathId) {
                fetchPathDetails();
                fetchLessons();
            }
        }, [courseId, pathId])
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {courseName || 'Learning Path'}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Loading */}
            {loading && (
                <View style={styles.centeredState}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={styles.stateText}>Loading path details...</Text>
                </View>
            )}

            {/* Error */}
            {!loading && error && (
                <View style={styles.centeredState}>
                    <Ionicons name="warning-outline" size={40} color="#FF9800" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchPathDetails}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Path Details */}
            {!loading && !error && path && (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Level Badge */}
                    <View style={styles.levelBadge}>
                        <Ionicons name="trophy-outline" size={20} color="#fff" />
                        <Text style={styles.levelText}>{path.level}</Text>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Ionicons name="time-outline" size={28} color="#2196F3" />
                            <Text style={styles.statValue}>{path.durationWeeks}</Text>
                            <Text style={styles.statLabel}>Weeks</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="star-outline" size={28} color="#FF9800" />
                            <Text style={styles.statValue}>{path.points}</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                    </View>

                    {/* Overview */}
                    {!!path.overview && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Overview</Text>
                            <Text style={styles.sectionBody}>{path.overview}</Text>
                        </View>
                    )}

                    {/* Description */}
                    {!!path.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.sectionBody}>{path.description}</Text>
                        </View>
                    )}

                    {/* Edit Button */}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('edit-delete-path', {
                            courseId,
                            pathId,
                            currentPath: path,
                        })}
                    >
                        <Text style={styles.editButtonText}>Edit Path Information</Text>
                    </TouchableOpacity>

                    {/* Lessons Section */}
                    <View style={styles.lessonsSection}>
                        <View style={styles.lessonsHeader}>
                            <Text style={styles.sectionTitle}>Lessons</Text>
                            <TouchableOpacity
                                style={styles.addLessonButton}
                                onPress={() => navigation.navigate('create-lesson', { courseId, pathId })}
                            >
                                <Ionicons name="add" size={18} color="#fff" />
                                <Text style={styles.addLessonText}>Add</Text>
                            </TouchableOpacity>
                        </View>

                        {lessonsLoading && (
                            <ActivityIndicator size="small" color="#2196F3" style={{ marginVertical: 16 }} />
                        )}

                        {!lessonsLoading && lessons.length === 0 && (
                            <View style={styles.emptyLessons}>
                                <Ionicons name="folder-open-outline" size={36} color="#ccc" />
                                <Text style={styles.emptyLessonsText}>No lessons yet. Tap + to create one.</Text>
                            </View>
                        )}

                        {!lessonsLoading && lessons.map((item, index) => {
                            const icon = getIcon(item.type);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.lessonCard}
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate('lesson-detail', {
                                        courseId,
                                        pathId,
                                        contentId: item.id,
                                        content: item,
                                    })}
                                >
                                    <View style={[styles.lessonIconContainer, { backgroundColor: icon.color + '18' }]}>
                                        <Ionicons name={icon.name as any} size={22} color={icon.color} />
                                    </View>
                                    <View style={styles.lessonInfo}>
                                        <Text style={styles.lessonTitle} numberOfLines={2}>
                                            {index + 1}. {item.title}
                                        </Text>
                                        <View style={styles.lessonMeta}>
                                            <Text style={styles.lessonTypeBadge}>{item.type}</Text>
                                            {item.points > 0 && (
                                                <Text style={styles.lessonPoints}>
                                                    <Ionicons name="star" size={11} color="#FF9800" /> {item.points} pts
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
                                </TouchableOpacity>
                            );
                        })}
                    </View>


                </ScrollView>
            )}

            {/* Empty State */}
            {!loading && !error && !path && (
                <View style={styles.centeredState}>
                    <Text style={styles.stateText}>No path details available.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 2,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 12,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
        marginBottom: 20,
    },
    levelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#212121',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 13,
        color: '#757575',
        marginTop: 4,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    sectionBody: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
    },
    centeredState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    stateText: {
        marginTop: 12,
        fontSize: 14,
        color: '#999',
    },
    errorText: {
        fontSize: 14,
        color: '#e53935',
        textAlign: 'center',
        marginHorizontal: 32,
        marginTop: 12,
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    editButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 8,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    lessonsSection: {
        marginTop: 8,
        marginBottom: 16,
    },
    lessonsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    addLessonButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#43A047',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    addLessonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    emptyLessons: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },
    emptyLessonsText: {
        marginTop: 8,
        fontSize: 13,
        color: '#999',
    },
    lessonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    lessonIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    lessonInfo: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#212121',
        marginBottom: 4,
    },
    lessonMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    lessonTypeBadge: {
        fontSize: 11,
        color: '#757575',
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
        textTransform: 'capitalize',
    },
    lessonPoints: {
        fontSize: 11,
        color: '#FF9800',
        fontWeight: '600',
    },
});
