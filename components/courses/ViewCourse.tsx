import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ViewCourseDetails from './ViewCourseDetails';

const Stack = createNativeStackNavigator();

export default function ViewCourse() {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    
    const courses = [
        { id: '1', title: 'Basic math for class XIII', instructor: 'John Smith', hours: '1.15', lessons: 12, image: '🔵' },
        { id: '2', title: 'Basic math for class XIII', instructor: 'John Smith', hours: '1.15', lessons: 12, image: '🟣' },
        { id: '3', title: 'Basic math for class XIII', instructor: 'John Smith', hours: '1.15', lessons: 12, image: '🟠' },
        { id: '4', title: 'Basic math for class XIII', instructor: 'John Smith', hours: '1.15', lessons: 12, image: '🔵' },
        { id: '5', title: 'Basic math for class XIII', instructor: 'John Smith', hours: '1.15', lessons: 12, image: '🟣' },
        { id: '6', title: 'Basic math for class XIII', instructor: 'John Smith', hours: '1.15', lessons: 12, image: '🟠' },
    ];

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    returnKeyType='search'
                    placeholder="Popular English course"
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#999"
                />
            </View>

            {/* Result Text */}
            <Text style={styles.resultText}>Result 25 course "English"</Text>

            {/* Course Grid */}
            <FlatList
                data={filteredCourses}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item: course }) => (
                    <TouchableOpacity 
                        style={styles.courseCard}
                        onPress={() => alert('Course details coming soon!')}
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
                                <Text style={styles.instructorIcon}>👨‍🏫</Text>
                                <Text style={styles.instructor}>{course.instructor}</Text>
                            </View>
                            <Text style={styles.courseDetails}>{course.hours} hours • {course.lessons} Lesson</Text>
                        </View>
                    </TouchableOpacity>
                )}
                scrollEnabled={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 16,
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
    instructorIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    instructor: {
        fontSize: 12,
        color: '#666',
    },
    courseDetails: {
        fontSize: 11,
        color: '#999',
    },
});