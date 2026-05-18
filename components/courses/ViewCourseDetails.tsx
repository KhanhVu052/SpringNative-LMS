import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

type CourseParam = { id: string; title: string; instructor: string; hours: string; lessons: number; image: string };
type RootStackParamList = { course: { course: CourseParam } };

const BASE_URL = 'http://192.168.0.104:8080';

export default function ViewCourseDetails({ navigation }: { navigation: any }) {
    const route = useRoute<RouteProp<RootStackParamList, 'course'>>();
    const course = route.params?.course;

    const [description, setDescription] = useState<string | null>(null);
    const [descLoading, setDescLoading] = useState(false);
    const [descError, setDescError] = useState<string | null>(null);

    useEffect(() => {
        if (!course?.id) return;
        const fetchDetails = async () => {
            try {
                setDescLoading(true);
                setDescError(null);
                const res = await fetch(`${BASE_URL}/api/courses/${course.id}`);
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
    }, [course?.id]);

    const chapters = [
        { id: '1', title: 'Introductions', hours: 2, minutes: 18, lessons: 12 },
        { id: '2', title: 'English for Everyday', hours: 2, minutes: 18, lessons: 12 },
        { id: '3', title: 'Sentences', hours: 2, minutes: 18, lessons: 12 },
        { id: '4', title: 'Parts of Speech', hours: 2, minutes: 18, lessons: 12 },
    ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Course Image */}
                <View style={styles.imageContainer}>
                    <Text style={styles.coursImage}>{course?.image ?? '🔵'}</Text>
                </View>

                {/* Course Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.courseTitle}>{course?.title ?? 'Course Details'}</Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('edit-delete-course', {
                            currentItem: {
                                id: course?.id,
                                name: course?.title ?? '',
                                description: description ?? '',
                            }
                        })}
                    >
                        <Text style={styles.editButtonText}>Edit Information</Text>
                    </TouchableOpacity>
                </View>

                {/* Course Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statIcon}>👥</Text>
                        <Text style={styles.statText}>25.6k</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statIcon}>⏱️</Text>
                        <Text style={styles.statText}>5h 34min</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statIcon}>⭐</Text>
                        <Text style={styles.statText}>4.7 ratings</Text>
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

                {/* Chapters */}
                <View style={styles.chaptersSection}>
                    <View style={styles.chaptersHeader}>
                        <Text style={styles.chaptersTitle}>Chapters</Text>
                        <Text style={styles.chaptersCount}>14 in total</Text>
                    </View>

                    {chapters.map((chapter) => (
                        <TouchableOpacity key={chapter.id} style={styles.chapterCard}>
                            <View style={styles.chapterInfo}>
                                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                                <Text style={styles.chapterDetails}>
                                    {chapter.hours} Hrs {chapter.minutes} Min • {chapter.lessons} Lesson
                                </Text>
                            </View>
                            <Text style={styles.chapterArrow}>›</Text>
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
    },
    coursImage: {
        fontSize: 100,
    },
    titleSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    editButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#6366F1',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        justifyContent: 'center',
    },
    editButtonText: {
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
        fontWeight: '600',
        color: '#000',
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