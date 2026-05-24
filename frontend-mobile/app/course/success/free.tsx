import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCourseContext } from '../../context/CourseContext';

export default function FreeEnrollmentSuccessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { enrollCourse, getCourseById } = useCourseContext();
  const course = getCourseById(id as string);

  useEffect(() => {
    if (id) {
      enrollCourse(id as string, 'free');
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Enrollment Successful!</Text>
        <Text style={styles.subtitle}>
          You are now enrolled in "{course?.title || 'the course'}"
        </Text>

        <View style={styles.emailAlert}>
          <FontAwesome name="envelope-o" size={16} color="#5D5FEF" style={{ marginTop: 2 }} />
          <Text style={styles.emailAlertText}>
            A confirmation email has been sent to your registered email address.
          </Text>
        </View>

        <Pressable 
          style={styles.primaryBtn} 
          onPress={() => router.replace(`/course/enrolled/${id || 1}/learn` as any)}
        >
          <Text style={styles.primaryBtnText}>Start Learning</Text>
        </Pressable>

        <Pressable 
          style={styles.secondaryBtn} 
          onPress={() => router.replace('/(tabs)' as any)}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  emailAlert: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    gap: 12,
    marginBottom: 40,
    width: '100%',
  },
  emailAlertText: {
    flex: 1,
    color: '#5D5FEF',
    fontSize: 14,
    lineHeight: 20,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#5D5FEF',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#475467',
    fontSize: 16,
    fontWeight: '600',
  },
});
