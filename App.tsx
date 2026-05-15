import { StyleSheet, Text, View, Button, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native';
import React, { useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ViewCourse from './components/courses/ViewCourse';
import ViewCourseDetails from './components/courses/ViewCourseDetails';
import CreateCourse from './components/courses/CreateCourse';
import EditDeleteCourse from './components/courses/EditDeleteCourse';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('home');
  const [username, setUsername] = useState('Tarek Masud');
  const courses = [
    { id: '1', title: 'Basic English for Class XIII', lessons: 28, instructor: 'Smith J.', image: '🔵' },
    { id: '2', title: 'General Knowledge', lessons: 28, instructor: 'Smith J.', image: '🟣' },
    { id: '3', title: 'Introduction to Programming', lessons: 28, instructor: 'Smith J.', image: '�' },
  ];

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello</Text>
          <Text style={styles.userName}>{username}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>All Category ▼</Text>
          </TouchableOpacity>
          <TextInput returnKeyType='search' style={styles.searchInput} placeholder="Search here" />
        </View>

        {/* Featured Courses */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredContainer}>
          <View style={[styles.courseCard, { backgroundColor: '#ADD8E6' }]}>
            <Text style={styles.courseTitle}>Basic English for Class XIII</Text>
            <Text style={styles.courseSubtitle}>28 Lessons</Text>
          </View>
          <View style={[styles.courseCard, { backgroundColor: '#DDA0DD' }]}>
            <Text style={styles.courseTitle}>General Knowledge</Text>
            <Text style={styles.courseSubtitle}>28 Lessons</Text>
          </View>
        </ScrollView>

        {/* Where You Left */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where You Left</Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressIcon}>🎯</Text>
            <View>
              <Text style={styles.progressTitle}>How to get started</Text>
              <Text style={styles.progressSubtitle}>You can start from where you left</Text>
            </View>
            <Text style={styles.progressPercent}>60%</Text>
          </View>
        </View>

        {/* All Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Courses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('courses')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.courseGrid}>
            <View style={styles.courseButton}>
              <Text style={styles.courseIcon}>📚</Text>
              <Text style={styles.courseLabel}>Literature</Text>
            </View>
            <View style={styles.courseButton}>
              <Text style={styles.courseIcon}>📊</Text>
              <Text style={styles.courseLabel}>General math</Text>
            </View>
            <View style={styles.courseButton}>
              <Text style={styles.courseIcon}>💬</Text>
              <Text style={styles.courseLabel}>Language</Text>
            </View>
            <View style={styles.courseButton}>
              <Text style={styles.courseIcon}>🧬</Text>
              <Text style={styles.courseLabel}>Biology</Text>
            </View>
          </View>
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for you</Text>
            <TouchableOpacity onPress={() => alert('View all recommended courses')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedContainer}>
            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.recommendedCard}
                onPress={() => alert(`Viewing: ${course.title}`)}
              >
                <View style={styles.courseImagePlaceholder}>{course.image}</View>
                <Text style={styles.recommendedTitle}>{course.title}</Text>
                <Text style={styles.instructor}>By {course.instructor}</Text>
                <Text style={styles.courseDetails}>17 Files • 40 Mins</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Premium Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Premium Courses</Text>
            <TouchableOpacity onPress={() => alert('View all premium courses')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.premiumCard}
                onPress={() => alert(`Premium Course: ${course.title}`)}
              >
                <View style={styles.courseImagePlaceholder}>{course.image}</View>
                <Text style={styles.premiumTitle}>Basic math for class XIII</Text>
                <Text style={styles.instructor}>By John Smith</Text>
                <Text style={styles.courseDetails}>1.15 hours • 12 Lesson</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat Support */}
        <View style={styles.chatSupport}>
          <Text style={styles.chatIcon}>💬</Text>
          <View>
            <Text style={styles.chatTitle}>Chat Support</Text>
            <Text style={styles.chatSubtitle}>Start a conversation now</Text>
          </View>
        </View>
        <Button title="CreateCourse" onPress={() => navigation.navigate('create-course')} />
        <Button title="EditDeleteCourse" onPress={() => navigation.navigate('edit-delete-course', { currentItem: { id: 1, name: 'Example Course', description: 'This is an example course' } })} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons name="home" size={24} color="black" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('learning')}
        >
          <FontAwesome5 name="book-reader" size={24} color="black" />
          <Text style={styles.navLabel}>Learning</Text>
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="courses" component={ViewCourse} options={{ title: 'All Courses' }} />
        <Stack.Screen name="course" component={ViewCourseDetails} options={{ title: 'Course Details' }} />
        <Stack.Screen name="create-course" component={CreateCourse} options={{ title: 'Create Course' }} />
        <Stack.Screen name="edit-delete-course" component={EditDeleteCourse} options={{ title: 'Edit Course' }} />
        <Stack.Screen name="profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" component={EditProfile} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  featuredContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  courseCard: {
    width: 200,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'flex-end',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  seeAll: {
    color: '#6366F1',
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#E0F0FF',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  progressSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  progressPercent: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  courseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseButton: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  courseIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  courseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  recommendedContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  recommendedCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  courseImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 40,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 8,
    color: '#000',
  },
  instructor: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 8,
  },
  courseDetails: {
    fontSize: 11,
    color: '#999',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  premiumCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  premiumTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 8,
    color: '#000',
  },
  chatSupport: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#EDE7F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  chatIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  chatSubtitle: {
    fontSize: 12,
    color: '#666',
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