import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCourseContext } from '../../context/CourseContext';

export default function PaidEnrollmentSuccessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { enrollCourse, getCourseById } = useCourseContext();
  const course = getCourseById(id as string);

  useEffect(() => {
    if (id) {
      enrollCourse(id as string, 'paid');
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

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>
          You have successfully enrolled in "{course?.title || 'the course'}"
        </Text>

        <View style={styles.receiptBox}>
          <Text style={styles.receiptTitle}>Payment Summary</Text>
          
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Transaction ID</Text>
            <Text style={styles.rowValueMono}>TXNI6FAINWH8</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Amount Paid</Text>
            <Text style={[styles.rowValue, { color: '#5D5FEF' }]}>{course?.price || '$7.70'}</Text>
          </View>
          <View style={[styles.row, { marginBottom: 24 }]}>
            <Text style={styles.rowLabel}>Status</Text>
            <Text style={[styles.rowValue, { color: '#10B981' }]}>Completed</Text>
          </View>

          <Pressable style={styles.downloadBtn}>
            <FontAwesome name="download" size={14} color="#475467" />
            <Text style={styles.downloadText}>Download Receipt</Text>
          </Pressable>
        </View>

        <View style={styles.emailAlert}>
          <FontAwesome name="envelope-o" size={16} color="#5D5FEF" style={{ marginTop: 2 }} />
          <Text style={styles.emailAlertText}>
            A confirmation email has been sent to your registered email address.
          </Text>
        </View>

        <Pressable 
          style={styles.primaryBtn} 
          onPress={() => router.replace(`/course/enrolled/${id || 2}/learn` as any)}
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8F9FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475467',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
  },
  rowValueMono: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
    fontFamily: 'monospace',
  },
  downloadBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  downloadText: {
    color: '#475467',
    fontWeight: '600',
    fontSize: 14,
  },
  emailAlert: {
    flexDirection: 'row',
    backgroundColor: '#F0F4FF',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 32,
    width: '100%',
  },
  emailAlertText: {
    flex: 1,
    color: '#5D5FEF',
    fontSize: 13,
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
