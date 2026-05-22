import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';

const EMOJIS = ['🔵', '🟣', '🟠', '🟢', '🔴', '🟡'];

type Course = {
    id: string;
    title: string;
    instructor: string;
    hours: string;
    lessons: number;
    image: string;
};

type RootStackParamList = {
    course: { course: Course };
    profile: undefined;
    home: undefined;
};

export default function ViewCourse() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [activeTab, setActiveTab] = useState('home');
    const [username, setUsername] = useState('Tarek Masud');
    const [searchText, setSearchText] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://10.0.2.2:8080/api/courses`);
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();
            // Map API response to the shape the UI expects
            const mapped: Course[] = data.map((item: any, index: number) => ({
                id: String(item.id ?? index),
                title: item.name || item.title || 'Untitled Course',
                instructor: item.instructor || item.instructorName || 'Unknown',
                hours: String(item.hours ?? item.duration ?? '0'),
                lessons: Number(item.lessons ?? item.lessonCount ?? 0),
                image: EMOJIS[index % EMOJIS.length],
            }));
            setCourses(mapped);
        } catch (err: any) {
            setError(err.message ?? 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCourses();
        }, [])
    );

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.userName}>John Doe</Text>
            </View>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" size={24} color="black" />
                <TextInput
                    style={styles.searchInput}
                    returnKeyType='search'
                    placeholder="Type your search here ..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#999"
                />
            </View>

            {/* Result Text */}
            <Text style={styles.resultText}>
                {loading ? 'Loading courses...' : `My Courses`}
            </Text>

            {/* Loading */}
            {loading && (
                <View style={styles.centeredState}>
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text style={styles.stateText}>Fetching courses...</Text>
                </View>
            )}

            {/* Error */}
            {!loading && error && (
                <View style={styles.centeredState}>
                    <FontAwesome name="warning" style={styles.errorIcon} size={24} color="yellow" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchCourses}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Course Grid */}
            {!loading && !error && (
                <FlatList
                    data={filteredCourses}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    renderItem={({ item: course }) => (
                        <TouchableOpacity
                            style={styles.courseCard}
                            onPress={() => navigation.navigate('course', { course })}
                        >
                            <View style={styles.courseImagePlaceholder}>
                                <Text style={styles.courseImage}>{course.image}</Text>
                                <View style={styles.playButton}>
                                    <Text style={styles.playIcon}>▶</Text>
                                </View>
                            </View>
                            <View style={styles.courseInfo}>
                                <Text style={styles.courseTitle}>{course.title}</Text>
                                <View style={styles.instructorRow}>
                                    <Text style={styles.instructor}>{course.instructor}</Text>
                                </View>
                                <Text style={styles.courseDetails}>{course.hours} hours • {course.lessons} Lesson</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    scrollEnabled={true}
                    ListEmptyComponent={
                        <View style={styles.centeredState}>
                            <Text style={styles.stateText}>No courses found.</Text>
                        </View>
                    }
                />
            )}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => {
                        setActiveTab('home');
                        navigation.navigate('home');
                    }}
                >
                    <Ionicons name="home" size={24} color="black" />
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => {
                        setActiveTab('profile');
                        navigation.navigate('profile');
                    }}
                >
                    <FontAwesome5 name="user-alt" size={24} color="black" />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 16,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    greeting: {
        fontSize: 14,
        color: '#666',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#f5f5f5',
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#000',
    },
    resultText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    courseCard: {
        width: '48%',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    courseImagePlaceholder: {
        width: '100%',
        height: 140,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    courseImage: {
        fontSize: 60,
    },
    playButton: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    courseInfo: {
        padding: 12,
    },
    courseTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    instructorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    instructor: {
        fontSize: 12,
        color: '#666',
    },
    courseDetails: {
        fontSize: 11,
        color: '#999',
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
    errorIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#e53935',
        textAlign: 'center',
        marginHorizontal: 32,
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#6366F1',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingVertical: 12,
        paddingBottom: 16,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navIcon: {
        fontSize: 28,
        marginBottom: 4,
    },
    navIconActive: {
        fontSize: 28,
    },
    navLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});
