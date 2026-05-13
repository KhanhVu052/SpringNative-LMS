import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
export default function ViewCourseDetails({ navigation }: { navigation: any }) {
    const route = useRoute();

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
                    <Text style={styles.coursImage}>🔵</Text>
                </View>

                {/* Course Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.courseTitle}>Basic English for Class XIII</Text>
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
                    <Text style={styles.descriptionText}>
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem ipsum.
                    </Text>
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