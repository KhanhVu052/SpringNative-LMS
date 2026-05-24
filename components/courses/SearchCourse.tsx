import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
};

export default function SearchCourse() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<any>();
    const initialQuery = route.params?.query ?? '';

    const [searchText, setSearchText] = useState(initialQuery);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchCourses = async (query: string) => {
        if (!query.trim()) {
            setCourses([]);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://10.0.2.2:8080/api/search?query=${encodeURIComponent(query.trim())}`);
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();
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
            setError(err.message ?? 'Failed to search courses');
        } finally {
            setLoading(false);
        }
    };

    // Search when the component mounts with the initial query
    useEffect(() => {
        if (initialQuery) {
            searchCourses(initialQuery);
        }
    }, []);

    const handleSubmitSearch = () => {
        searchCourses(searchText);
    };

    return (
        <View style={styles.container}>
            {/* Header Row with Back Button and Search Bar */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <FontAwesome5 name="search" size={18} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        returnKeyType='search'
                        placeholder="Type your search here ..."
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={handleSubmitSearch}
                        placeholderTextColor="#999"
                        autoFocus={!initialQuery}
                    />
                </View>
            </View>

            {/* Result Text */}
            <Text style={styles.resultText}>
                {loading ? 'Searching...' : `Result ${courses.length} course`}
            </Text>

            {/* Loading */}
            {loading && (
                <View style={styles.centeredState}>
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text style={styles.stateText}>Searching courses...</Text>
                </View>
            )}

            {/* Error */}
            {!loading && error && (
                <View style={styles.centeredState}>
                    <FontAwesome name="warning" size={24} color="black" style={styles.errorIcon} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleSubmitSearch}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Course Grid */}
            {!loading && !error && (
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    renderItem={({ item: course }) => (
                        <TouchableOpacity
                            style={styles.courseCard}
                            onPress={() => navigation.navigate('course', { course })}
                        >
                            <View style={styles.courseImagePlaceholder}>
                                <FontAwesome5 name="play-circle" size={24} color="black" />
                                <View style={styles.playButton}>
                                    <FontAwesome5 name="play-circle" size={24} color="black" />
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
                        !searchText.trim() ? (
                            <View style={styles.centeredState}>
                                <FontAwesome5 name="search" size={40} color="#ccc" />
                                <Text style={styles.stateText}>Enter a keyword to search for courses</Text>
                            </View>
                        ) : (
                            <View style={styles.centeredState}>
                                <Text style={styles.stateText}>No courses found.</Text>
                            </View>
                        )
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 16,
        marginTop: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    backButton: {
        marginRight: 12,
        padding: 8,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#f5f5f5',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
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
    playButton: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
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
});
