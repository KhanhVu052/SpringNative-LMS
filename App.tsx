import { StyleSheet, Text, View, Button, ScrollView, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
import Feather from '@expo/vector-icons/Feather';
import MyCourse from './components/courses/MyCourse';
import LearningPath from './components/path/LearningPath';
import EditDeletePath from './components/path/EditDeletePath';
import CreatePath from './components/path/CreatePath';
import CreateLesson from './components/lesson/CreateLesson';
import LessonDetail from './components/lesson/LessonDetail';
import Grading from './components/lesson/Grading';
import SearchCourse from './components/courses/SearchCourse';
import Statistic from './components/admin/Statistic';
import UsersList from './components/admin/UsersList';
import UserDetail from './components/admin/UserDetail';
import TeachersList from './components/admin/TeachersList';
import CreateTeacher from './components/admin/CreateTeacher';
import TeacherDetails from './components/admin/TeacherDetails';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { UserProvider, useUser } from './context/UserContext';
import Login from './components/profile/Login';

const Stack = createNativeStackNavigator();

const EMOJIS = ['🔵', '🟣', '🟠', '🟢', '🔴', '🟡'];

type Course = {
  id: string;
  title: string;
  instructor: string;
  hours: string;
  lessons: number;
  image: string;
};

function HomeScreen({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('home');
  const [username, setUsername] = useState('');
  const [homeSearchText, setHomeSearchText] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, token } = useUser();

  // Fetch username from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:8080/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        setUsername(data.username || 'User');
      } catch (err: any) {
        console.error('Failed to fetch user:', err.message);
        setUsername('User');
      }
    };
    fetchUser();
  }, [userId, token]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://10.0.2.2:8080/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
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
        console.error('Failed to fetch courses:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const recommendedCourses = courses.slice(0, 5);
  const premiumCourses = courses.slice(5, 10).length > 0 ? courses.slice(5, 10) : courses.slice(0, 5);

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
          <TextInput
            returnKeyType='search'
            style={styles.searchInput}
            placeholder="Search here"
            value={homeSearchText}
            onChangeText={setHomeSearchText}
            onSubmitEditing={() => {
              if (homeSearchText.trim()) {
                navigation.navigate('search-courses', { query: homeSearchText.trim() });
                setHomeSearchText('');
              }
            }}
          />
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
            <Feather name="target" size={24} color="#5B67F8" style={styles.progressIcon} />
            <View>
              <Text style={styles.progressTitle}>How to get started</Text>
              <Text style={styles.progressSubtitle}>You can start from where you left</Text>
            </View>
            <Text style={styles.progressPercent}>60%</Text>
          </View>
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for you</Text>
            <TouchableOpacity onPress={() => navigation.navigate('courses')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#6366F1" style={{ marginVertical: 20 }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedContainer}>
              {recommendedCourses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={styles.recommendedCard}
                  onPress={() => navigation.navigate('course', { course })}
                >
                  <View style={styles.courseImagePlaceholder}>
                    <FontAwesome name="code" size={24} color="black" />
                  </View>
                  <Text style={styles.recommendedTitle}>{course.title}</Text>
                  <Text style={styles.instructor}>By {course.instructor}</Text>
                  <Text style={styles.courseDetails}>{course.hours} hours • {course.lessons} Lessons</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Premium Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Premium Courses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('courses')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#6366F1" style={{ marginVertical: 20 }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {premiumCourses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={styles.premiumCard}
                  onPress={() => navigation.navigate('course', { course })}
                >
                  <View style={styles.courseImagePlaceholder}>
                    <FontAwesome name="code" size={24} color="black" />
                  </View>
                  <Text style={styles.premiumTitle}>{course.title}</Text>
                  <Text style={styles.instructor}>By {course.instructor}</Text>
                  <Text style={styles.courseDetails}>{course.hours} hours • {course.lessons} Lessons</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        <View>
          <Button title="MyCourse" onPress={() => navigation.navigate('my-courses')} />
          <Button title="Statistic" onPress={() => navigation.navigate('statistic')} />
          <Button title="UsersList" onPress={() => navigation.navigate('users-list')} />
          <Button title="TeachersList" onPress={() => navigation.navigate('teachers-list')} />
        </View>
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

function AppNavigator() {
  const { token } = useUser();

  if (!token) {
    return <Login />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="courses" component={ViewCourse} options={{ headerShown: false }} />
        <Stack.Screen name="course" component={ViewCourseDetails} options={{ headerShown: false }} />
        <Stack.Screen name="create-course" component={CreateCourse} options={{ headerShown: false }} />
        <Stack.Screen name="edit-delete-course" component={EditDeleteCourse} options={{ headerShown: false }} />
        <Stack.Screen name="profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="my-courses" component={MyCourse} options={{ headerShown: false }} />
        <Stack.Screen name="learning-paths" component={LearningPath} options={{ headerShown: false }} />
        <Stack.Screen name="edit-delete-path" component={EditDeletePath} options={{ headerShown: false }} />
        <Stack.Screen name="create-path" component={CreatePath} options={{ headerShown: false }} />
        <Stack.Screen name="create-lesson" component={CreateLesson} options={{ headerShown: false }} />
        <Stack.Screen name="lesson-detail" component={LessonDetail} options={{ headerShown: false }} />
        <Stack.Screen name="grading" component={Grading} options={{ headerShown: false }} />
        <Stack.Screen name="search-courses" component={SearchCourse} options={{ headerShown: false }} />
        <Stack.Screen name="statistic" component={Statistic} options={{ headerShown: false }} />
        <Stack.Screen name="users-list" component={UsersList} options={{ headerShown: false }} />
        <Stack.Screen name="user-detail" component={UserDetail} options={{ headerShown: false }} />
        <Stack.Screen name="teachers-list" component={TeachersList} options={{ headerShown: false }} />
        <Stack.Screen name="create-teacher" component={CreateTeacher} options={{ headerShown: false }} />
        <Stack.Screen name="teacher-details" component={TeacherDetails} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
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