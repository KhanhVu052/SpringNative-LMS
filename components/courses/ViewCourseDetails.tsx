import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useUser } from '../../context/UserContext';

type CourseParam = { id: string; title: string; instructor: string; hours: string; lessons: number; image: string };
type RootStackParamList = { course: { course: CourseParam } };

const BASE_URL = 'http://10.0.2.2:8080';

export default function ViewCourseDetails({ navigation }: { navigation: any }) {
    const route = useRoute<RouteProp<RootStackParamList, 'course'>>();
    const course = route.params?.course;
    const { token } = useUser();

    const [description, setDescription] = useState<string | null>(null);
    const [descLoading, setDescLoading] = useState(false);
    const [descError, setDescError] = useState<string | null>(null);

    const [paths, setPaths] = useState<{ id: number; level: string; overview: string }[]>([]);
    const [pathsLoading, setPathsLoading] = useState(false);

    useEffect(() => {
        if (!course?.id || !token) return;

        const fetchDetails = async () => {
            try {
                setDescLoading(true);
                setDescError(null);
                const res = await fetch(`${BASE_URL}/api/courses/${course.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                setDescription(data.description ?? '');
            } catch (err: any) {
                setDescError(err.message ?? 'Failed to load description');
            } finally {
                setDescLoading(false);
            }
        };

        fetchDetails();
    }, [course?.id, token]);

    const fetchPaths = useCallback(async () => {
        if (!course?.id || !token) return;
        try {
            setPathsLoading(true);
            const res = await fetch(`${BASE_URL}/api/courses/${course.id}/paths`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            const mapped = (Array.isArray(data) ? data : []).map((item: any) => ({
                id: item.id ?? 0,
                level: item.level || 'N/A',
                overview: item.overview || '',
            }));
            setPaths(mapped);
        } catch (err: any) {
            console.error('Failed to fetch paths:', err.message);
        } finally {
            setPathsLoading(false);
        }
    }, [course?.id, token]);

    useFocusEffect(
        useCallback(() => {
            fetchPaths();
        }, [fetchPaths])
    );


    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Course Image */}
                <View style={styles.imageContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => navigation.navigate('my-courses')}
                    >
                        <Ionicons name="home" size={22} color="#fff" />
                    </TouchableOpacity>
                    <FontAwesome name="code" size={24} color="black" style={styles.coursImage} />
                </View>

                {/* Course Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.courseTitle}>{course?.title ?? 'Course Details'}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('edit-delete-course', {
                                currentItem: {
                                    id: course?.id,
                                    name: course?.title ?? '',
                                    description: description ?? '',
                                }
                            })}
                        >
                            <Text style={styles.actionButtonText}>Edit Information</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.createPathButton]}
                            onPress={() => navigation.navigate('create-path', {
                                course: {
                                    id: course?.id,
                                }
                            })}
                        >
                            <Text style={styles.actionButtonText}>Create Path</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.descriptionSection}>
                    {descLoading ? (
                        <ActivityIndicator size="small" color="#6366F1" />
                    ) : descError ? (
                        <Text style={styles.descriptionError}>{descError}</Text>
                    ) : (
                        <Text style={styles.descriptionText}>
                            {description || 'No description available.'}
                        </Text>
                    )}
                </View>

                {/* Learning Paths */}
                <View style={styles.chaptersSection}>
                    <View style={styles.chaptersHeader}>
                        <Text style={styles.chaptersTitle}>Learning Paths</Text>
                        <Text style={styles.chaptersCount}>
                            {pathsLoading ? 'Loading...' : `${paths.length} in total`}
                        </Text>
                    </View>

                    {pathsLoading && (
                        <ActivityIndicator size="small" color="#6366F1" style={{ marginVertical: 12 }} />
                    )}

                    {!pathsLoading && paths.length === 0 && (
                        <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', paddingVertical: 12 }}>
                            No learning paths available.
                        </Text>
                    )}

                    {!pathsLoading && paths.map((p) => (
                        <TouchableOpacity
                            key={p.id}
                            style={styles.chapterCard}
                            onPress={() => navigation.navigate('learning-paths', {
                                courseId: course?.id,
                                pathId: p.id,
                                courseName: course?.title ?? 'Course',
                            })}
                        >
                            <View style={styles.chapterInfo}>
                                {!!p.overview && (
                                    <Text style={styles.chapterTitle} numberOfLines={2}>
                                        {p.level}. <Text style={{ fontWeight: 'normal', color: '#000' }}>{p.overview}</Text>
                                    </Text>
                                )}
                            </View>
                            <FontAwesome name="arrow-right" size={24} color="black" style={styles.chapterArrow} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeButton: {
        position: 'absolute',
        top: 40,
        right: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    coursImage: {
        fontSize: 100,
    },
    titleSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
        marginTop: 4,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#6366F1',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createPathButton: {
        backgroundColor: '#10B981',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f9f9f9',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statIcon: {
        fontSize: 18,
    },
    statText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    descriptionSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    descriptionError: {
        fontSize: 14,
        color: '#e53935',
    },
    chaptersSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    chaptersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chaptersTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    chaptersCount: {
        fontSize: 14,
        color: '#999',
    },
    chapterCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EDE7F6',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    chapterInfo: {
        flex: 1,
    },
    chapterTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A2E',
        marginBottom: 6,
    },
    chapterDetails: {
        fontSize: 13,
        color: '#8B7FB0',
        fontWeight: '500',
    },
    chapterArrow: {
        fontSize: 24,
        color: '#999',
        marginLeft: 8,
    },
});