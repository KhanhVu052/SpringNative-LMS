import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCourseContext } from '../../context/CourseContext';

export default function FreeCourseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Introduction');
  const { getCourseById, isLoggedIn } = useCourseContext();
  const course = getCourseById(id as string) || { title: 'Basic English for Class XIII', author: 'by Sarah Johnson' };
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleEnroll = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    router.push(`/course/success/free?id=${id}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <FontAwesome name="angle-left" size={24} color="#101828" />
        </Pressable>
        <Text style={styles.headerTitle}>Course Details</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn}>
            <FontAwesome name="bookmark-o" size={20} color="#101828" />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <FontAwesome name="share-alt" size={20} color="#101828" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner */}
        <LinearGradient colors={['#3B82F6', '#4F46E5'] as const} style={styles.banner}>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>FREE</Text>
          </View>
          <View style={styles.playButtonCircle}>
            <FontAwesome name="play" size={24} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </View>
        </LinearGradient>

        <Text style={styles.title}>Basic English for Class XIII</Text>
        <Text style={styles.author}>by Sarah Johnson</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <FontAwesome name="star" size={14} color="#F59E0B" />
            <Text style={styles.statText}>4.8 (2.3k)</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="clock-o" size={14} color="#64748B" />
            <Text style={styles.statText}>12h</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="bar-chart" size={14} color="#64748B" />
            <Text style={styles.statText}>Beginner</Text>
          </View>
        </View>

        <Pressable style={styles.enrollBtn} onPress={handleEnroll}>
          <Text style={styles.enrollBtnText}>Enroll for Free</Text>
        </Pressable>

        <View style={styles.tabsRow}>
          <Pressable 
            style={[styles.tab, activeTab === 'Introduction' && styles.activeTab]}
            onPress={() => setActiveTab('Introduction')}
          >
            <Text style={[styles.tabText, activeTab === 'Introduction' && styles.activeTabText]}>
              Introduction
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'Curriculum' && styles.activeTab]}
            onPress={() => setActiveTab('Curriculum')}
          >
            <Text style={[styles.tabText, activeTab === 'Curriculum' && styles.activeTabText]}>
              Curriculum
            </Text>
          </Pressable>
        </View>

        {activeTab === 'Introduction' && (
          <View style={styles.tabContent}>
            <View style={styles.freeAlertBox}>
              <Text style={styles.freeAlertText}>
                🎉 This course is completely free! Enroll now and start learning immediately.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>About this course</Text>
            <Text style={styles.aboutText}>
              Master fundamental English concepts for Class XIII students.
            </Text>

            <Text style={styles.sectionTitle}>What you'll learn</Text>
            <View style={styles.learnList}>
              <View style={styles.learnItem}>
                <FontAwesome name="check-circle-o" size={18} color="#10B981" />
                <Text style={styles.learnText}>Basic grammar rules</Text>
              </View>
              <View style={styles.learnItem}>
                <FontAwesome name="check-circle-o" size={18} color="#10B981" />
                <Text style={styles.learnText}>Sentence structure</Text>
              </View>
              <View style={styles.learnItem}>
                <FontAwesome name="check-circle-o" size={18} color="#10B981" />
                <Text style={styles.learnText}>Everyday vocabulary</Text>
              </View>
              <View style={styles.learnItem}>
                <FontAwesome name="check-circle-o" size={18} color="#10B981" />
                <Text style={styles.learnText}>Reading comprehension</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Instructor</Text>
            <View style={styles.instructorCard}>
              <View style={styles.instructorAvatar}>
                <Text style={{ fontSize: 32 }}>👩‍🏫</Text>
              </View>
              <View style={styles.instructorInfo}>
                <Text style={styles.instructorName}>Sarah Johnson</Text>
                <Text style={styles.instructorRole}>Expert Instructor</Text>
                <View style={styles.instructorStats}>
                  <FontAwesome name="star" size={12} color="#F59E0B" />
                  <Text style={styles.instructorStatText}>4.9 rating</Text>
                  <Text style={styles.instructorStatDot}>•</Text>
                  <Text style={styles.instructorStatText}>10k+ students</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'Curriculum' && (
          <View style={styles.tabContent}>
            <View style={styles.previewAlert}>
              <FontAwesome name="lock" size={14} color="#B45309" style={{ marginTop: 2 }} />
              <Text style={styles.previewAlertText}>
                Preview available for first 2 lessons. Enroll to unlock all content.
              </Text>
            </View>

            <Text style={styles.sectionHeading}>Section 1: Getting Started</Text>
            
            <View style={styles.lessonCard}>
              <View style={styles.lessonIconPlay}>
                <FontAwesome name="play" size={14} color="#5D5FEF" style={{ marginLeft: 2 }} />
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>Welcome to the Course</Text>
                <Text style={styles.lessonTime}>5:30</Text>
              </View>
            </View>

            <View style={styles.lessonCard}>
              <View style={styles.lessonIconPlay}>
                <FontAwesome name="play" size={14} color="#5D5FEF" style={{ marginLeft: 2 }} />
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>Course Overview</Text>
                <Text style={styles.lessonTime}>8:15</Text>
              </View>
            </View>

            <View style={styles.lessonCard}>
              <View style={styles.lessonIconLocked}>
                <FontAwesome name="lock" size={14} color="#94A3B8" />
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitleLocked}>Setting Up Tools</Text>
                <Text style={styles.lessonTime}>12:45</Text>
              </View>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>Locked</Text>
              </View>
            </View>

            <Text style={[styles.sectionHeading, { marginTop: 8 }]}>Section 2: Core Content</Text>

            <View style={styles.lessonCard}>
              <View style={styles.lessonIconLocked}>
                <FontAwesome name="lock" size={14} color="#94A3B8" />
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitleLocked}>Fundamental Concepts</Text>
                <Text style={styles.lessonTime}>15:20</Text>
              </View>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>Locked</Text>
              </View>
            </View>

            <View style={styles.lessonCard}>
              <View style={styles.lessonIconLocked}>
                <FontAwesome name="lock" size={14} color="#94A3B8" />
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitleLocked}>Practical Applications</Text>
                <Text style={styles.lessonTime}>18:30</Text>
              </View>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>Locked</Text>
              </View>
            </View>

            <View style={styles.lessonCard}>
              <View style={styles.lessonIconLocked}>
                <FontAwesome name="lock" size={14} color="#94A3B8" />
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitleLocked}>Advanced Techniques</Text>
                <Text style={styles.lessonTime}>22:10</Text>
              </View>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>Locked</Text>
              </View>
            </View>

          </View>
        )}

      </ScrollView>

      {/* Login Required Modal */}
      <Modal visible={showLoginModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Login Required</Text>
            <Text style={styles.modalMessage}>You need to be logged in to enroll in a course.</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalBtnCancel} onPress={() => setShowLoginModal(false)}>
                <Text style={styles.modalBtnCancelText}>Later</Text>
              </Pressable>
              <Pressable style={styles.modalBtnConfirm} onPress={() => { setShowLoginModal(false); router.push('/login'); }}>
                <Text style={styles.modalBtnConfirmText}>Login/Register</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  banner: {
    height: 200,
    borderRadius: 20,
    marginBottom: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  freeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  freeBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  playButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  author: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  enrollBtn: {
    backgroundColor: '#5D5FEF',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  enrollBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#5D5FEF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#5D5FEF',
  },
  tabContent: {
    paddingBottom: 20,
  },
  freeAlertBox: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  freeAlertText: {
    color: '#047857',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 15,
    color: '#475467',
    lineHeight: 24,
    marginBottom: 24,
  },
  learnList: {
    marginBottom: 24,
  },
  learnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  learnText: {
    fontSize: 15,
    color: '#475467',
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    padding: 16,
    borderRadius: 20,
  },
  instructorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#C4B5FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 4,
  },
  instructorRole: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  instructorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  instructorStatText: {
    fontSize: 12,
    color: '#64748B',
  },
  instructorStatDot: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  previewAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEFCE8',
    borderWidth: 1,
    borderColor: '#FEF08A',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
  },
  previewAlertText: {
    color: '#B45309',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 16,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    marginBottom: 12,
  },
  lessonIconPlay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonIconLocked: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 4,
  },
  lessonTitleLocked: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  lessonTime: {
    fontSize: 13,
    color: '#94A3B8',
  },
  lockedBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  lockedBadgeText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: '#475467',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalBtnCancelText: {
    color: '#475467',
    fontSize: 15,
    fontWeight: '600',
  },
  modalBtnConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#5D5FEF',
    alignItems: 'center',
  },
  modalBtnConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
