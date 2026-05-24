import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <View style={styles.container}>
      {/* Video Player Header (Mock) */}
      <LinearGradient colors={['#3B0764', '#1E1B4B']} style={styles.videoHeader}>
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <FontAwesome name="angle-left" size={24} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <FontAwesome name="cog" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.videoCenter}>
          <View style={styles.playBtnContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7504/7504100.png' }} 
              style={styles.mockVideoImage} 
            />
            <View style={styles.playOverlay}>
              <FontAwesome name="play" size={24} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <Text style={styles.videoWatermark}>Video Player</Text>
        </View>

        <View style={styles.videoControls}>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
            <View style={styles.progressHandle} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>4:05</Text>
            <Text style={styles.timeText}>15:20</Text>
          </View>
          <View style={styles.bottomControls}>
            <View style={styles.playbackControls}>
              <FontAwesome name="step-backward" size={16} color="#FFFFFF" />
              <View style={styles.smallPlayBtn}>
                <FontAwesome name="play" size={16} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </View>
              <FontAwesome name="step-forward" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.rightControls}>
              <FontAwesome name="volume-up" size={18} color="#FFFFFF" />
              <View style={{ width: 16 }} />
              <FontAwesome name="expand" size={18} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Course Info & Tabs */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subject}>Design Fundamentals</Text>
        <Text style={styles.title}>Understanding Color Theory</Text>
        <Text style={styles.author}>by Sarah Johnson</Text>

        <View style={styles.tabsContainer}>
          {['Overview', 'Resources', 'Notes'].map((tab) => (
            <Pressable 
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'Overview' && (
          <View style={styles.overviewSection}>
            <Text style={styles.sectionTitle}>Lesson Description</Text>
            <Text style={styles.descriptionText}>
              In this lesson, you'll learn the fundamentals of color theory and how to apply it in your design work. We'll cover color psychology, color harmonies, and practical techniques for creating beautiful color palettes.
            </Text>

            <Text style={styles.sectionTitle}>Key Takeaways</Text>
            <View style={styles.bulletList}>
              {['Understanding the color wheel', 'Color harmony principles', 'Applying color psychology', 'Creating accessible designs'].map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Assignment Available Card */}
            <View style={styles.assignmentCard}>
              <View style={styles.assignmentIcon}>
                <Text style={{ fontSize: 24 }}>📝</Text>
              </View>
              <View style={styles.assignmentInfo}>
                <Text style={styles.assignmentTitle}>Assignment Available</Text>
                <Text style={styles.assignmentDesc}>Create a color palette for a mobile app</Text>
                <Pressable 
                  style={styles.startAssignmentBtn}
                  onPress={() => router.push('/course/assignment/1' as any)}
                >
                  <Text style={styles.startAssignmentBtnText}>Start Assignment</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.completedBtn} onPress={() => router.back()}>
          <FontAwesome name="check-circle-o" size={20} color="#FFFFFF" />
          <Text style={styles.completedBtnText}>Mark as Completed</Text>
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
  videoHeader: {
    height: 300,
    paddingTop: 48,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoCenter: {
    alignItems: 'center',
  },
  playBtnContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mockVideoImage: {
    width: 80,
    height: 80,
    position: 'absolute',
    opacity: 0.8,
  },
  playOverlay: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWatermark: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  videoControls: {
    paddingBottom: 20,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBarFill: {
    width: '30%',
    height: '100%',
    backgroundColor: '#5D5FEF',
    borderRadius: 2,
  },
  progressHandle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5D5FEF',
    position: 'absolute',
    left: '30%',
    top: -4,
    marginLeft: -6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  smallPlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  subject: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  tabsContainer: {
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
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#5D5FEF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#5D5FEF',
  },
  overviewSection: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12,
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#475467',
    lineHeight: 24,
    marginBottom: 24,
  },
  bulletList: {
    marginBottom: 24,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5D5FEF',
    marginTop: 10,
    marginRight: 12,
  },
  bulletText: {
    fontSize: 15,
    color: '#475467',
    lineHeight: 24,
    flex: 1,
  },
  assignmentCard: {
    backgroundColor: '#F8F9FF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    marginTop: 8,
  },
  assignmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#5D5FEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 4,
  },
  assignmentDesc: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  startAssignmentBtn: {
    backgroundColor: '#5D5FEF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  startAssignmentBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  completedBtn: {
    backgroundColor: '#5D5FEF',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  completedBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
