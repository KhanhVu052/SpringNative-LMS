import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';

// Dynamically resolve expo-router to support standard React Navigation environments
let useRouter: any = () => ({ replace: () => { }, push: () => { }, back: () => { } });
let Stack: any = null;
try {
  const expoRouter = require("expo-router");
  useRouter = expoRouter.useRouter;
  Stack = expoRouter.Stack;
} catch (e) {
  // Not inside expo-router
}

import { useCourseContext } from './context/CourseContext';

export default function MyCoursesScreen() {
  let router: any;
  try {
    router = useRouter();
  } catch (e) {
    router = { replace: () => { }, push: () => { }, back: () => { } };
  }

  const courseContext = useCourseContext();
  const enrolled = courseContext ? courseContext.enrolled : [];

  let parentUserContext: any = null;
  try {
    const { useUser } = require("../../context/UserContext");
    parentUserContext = useUser();
  } catch (e) {
    // Outside parent UserContext
  }

  const [parentCourses, setParentCourses] = React.useState<any[]>([]);
  const [parentLoading, setParentLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchParentCourses = async () => {
      if (!parentUserContext || !parentUserContext.token) return;
      try {
        setParentLoading(true);
        const res = await fetch('http://10.0.2.2:8080/api/courses', {
          headers: {
            'Authorization': `Bearer ${parentUserContext.token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Map to match the card structure
          const mapped = data.map((item: any, index: number) => ({
            id: String(item.id || index),
            title: item.name || item.title || 'Untitled Course',
            author: item.instructor || item.instructorName || 'By Instructor',
            color: '#5D5FEF',
            progress: index % 2 !== 0 ? 100 : 75
          }));
          setParentCourses(mapped);
        }
      } catch (err) {
        console.warn('Failed to fetch parent courses:', err);
      } finally {
        setParentLoading(false);
      }
    };
    fetchParentCourses();
  }, [parentUserContext?.token]);

  const displayCourses = parentUserContext ? parentCourses : enrolled;

  return (
    <View style={styles.container}>
      {Stack && !parentUserContext && (
        <Stack.Screen options={{ headerShown: false }} />
      )}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Courses</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!Array.isArray(displayCourses) || displayCourses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <FontAwesome name="folder-open" size={48} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptyText}>You haven't enrolled in any courses. Explore the home page to find your next adventure!</Text>
            <Pressable style={styles.exploreBtn} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.exploreBtnText}>Explore Courses</Text>
            </Pressable>
          </View>
        ) : (
          displayCourses?.map((course, index) => {
            // Mocking progress for demonstration. E.g. every second course is completed.
            const progress = course.progress || (index % 2 !== 0 ? 100 : 75);
            const isCompleted = progress === 100;
            const iconBg = course.color || (isCompleted ? '#A855F7' : '#5D5FEF');

            return (
              <Pressable
                key={course.id}
                style={styles.courseCard}
                onPress={() => router.push(`/course/dashboard/${course.id}` as any)}
              >
                <View style={[styles.courseIconBox, { backgroundColor: iconBg }]}>
                  {isCompleted ? (
                    <Feather name="check-circle" size={32} color="#FFFFFF" />
                  ) : (
                    <Feather name="play" size={32} color="#FFFFFF" />
                  )}
                </View>

                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle} numberOfLines={1}>{course.title}</Text>
                  <Text style={styles.courseAuthor}>{course.author || 'By Instructor'}</Text>

                  {isCompleted ? (
                    <View style={styles.completedBadge}>
                      <FontAwesome name="check-circle-o" size={14} color="#10B981" />
                      <Text style={styles.completedText}>Completed</Text>
                    </View>
                  ) : (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progress</Text>
                        <Text style={styles.progressPercent}>{progress}%</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                      </View>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
  },
  content: {
    padding: 24,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  courseIconBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 4,
  },
  courseAuthor: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  progressContainer: {
    width: '100%',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5D5FEF',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5D5FEF',
    borderRadius: 3,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  completedText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  exploreBtn: {
    backgroundColor: '#5D5FEF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
