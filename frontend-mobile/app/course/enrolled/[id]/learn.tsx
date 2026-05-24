import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCourseContext } from '../../../context/CourseContext';

export default function LearnTabScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getCourseById, savedDocuments, toggleSaveDocument } = useCourseContext();
  const course = getCourseById(id);
  const courseTitle = course?.title || 'Course Details';
  const [activeTab, setActiveTab] = useState('Learn');

  const renderListItem = (title: string, emoji: string, route: string) => (
    <Pressable style={styles.listItem} onPress={() => router.push(route as any)}>
      <View style={styles.iconCircle}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.listTitle}>{title}</Text>
      <FontAwesome name="angle-right" size={20} color="#94A3B8" />
    </Pressable>
  );

  const renderDocItem = (title: string, docId: string) => {
    const isSaved = savedDocuments?.some((d: any) => d.id === docId);

    return (
      <Pressable style={styles.docItem} onPress={() => router.push(`/document/${docId}` as any)}>
        <View style={styles.docIconBox}>
          <FontAwesome name="file-text-o" size={20} color="#EF4444" />
        </View>
        <Text style={styles.listTitle}>{title}</Text>
        <Pressable 
          style={styles.docActionBtn}
          onPress={() => toggleSaveDocument({
            id: docId,
            title,
            course: courseTitle,
            date: `Saved on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          })}
        >
          <FontAwesome name={isSaved ? "bookmark" : "bookmark-o"} size={16} color={isSaved ? "#5D5FEF" : "#475467"} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <FontAwesome name="angle-left" size={24} color="#101828" />
        </Pressable>
        <Text style={styles.headerTitle}>{courseTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.courseTitle}>{courseTitle}</Text>
        <Text style={styles.courseDesc}>
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.
        </Text>

        <View style={styles.tabsContainer}>
          <Pressable 
            style={[styles.tabButton, activeTab === 'Learn' && styles.tabActive]}
            onPress={() => setActiveTab('Learn')}
          >
            <Text style={[styles.tabText, activeTab === 'Learn' && styles.tabTextActive]}>
              Learn
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.tabButton, activeTab === 'Homework' && styles.tabActiveOrange]}
            onPress={() => setActiveTab('Homework')}
          >
            <Text style={[styles.tabText, activeTab === 'Homework' && styles.tabTextActive]}>
              Homework
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.tabButton, activeTab === 'Documents' && styles.tabActiveGreen]}
            onPress={() => setActiveTab('Documents')}
          >
            <Text style={[styles.tabText, activeTab === 'Documents' && styles.tabTextActive]}>
              Documents
            </Text>
          </Pressable>
        </View>

        {activeTab === 'Learn' ? (
          <>
            <Text style={styles.sectionTitle}>Chapters</Text>
            {renderListItem('Introductions', '📝', `/course/lesson/1`)}
            {renderListItem('Sentences', '✍️', `/course/lesson/2`)}
            {renderListItem('Part of Speech', '📖', `/course/lesson/3`)}

            <Text style={styles.sectionTitle}>Video Learning</Text>
            {renderListItem('English for Everyday', '🎥', `/course/lesson/4`)}
            {renderListItem('Short English Speaking', '🗣️', `/course/lesson/5`)}

            <Text style={styles.sectionTitle}>Additional learning</Text>
            {renderListItem('How to do English', '📚', `/course/lesson/6`)}
            {renderListItem('Do different kinds of words learn', '🎯', `/course/lesson/7`)}
            {renderListItem('Basic English for introduction', '💡', `/course/lesson/8`)}

            <Text style={styles.sectionTitle}>Related Chapters</Text>
            {renderListItem('English for Everyday', '📖', `/course/lesson/9`)}
            {renderListItem('Sentences', '✏️', `/course/lesson/10`)}
            {renderListItem('Part of Speech', '📝', `/course/lesson/11`)}
          </>
        ) : activeTab === 'Homework' ? (
          <View style={styles.homeworkState}>
            <Text style={styles.sectionTitle}>Homework for you</Text>
            {renderListItem('Write down some words about your first birthday', '📝', `/course/assignment/1`)}
            {renderListItem('Write a word you learnt recently', '📝', `/course/assignment/2`)}
          </View>
        ) : (
          <View style={styles.documentsState}>
            <Text style={styles.sectionTitle}>Lesson 1: Introduction to Algebra</Text>
            {renderDocItem('Lesson 1 Lecture Notes', '1')}
            {renderDocItem('Lesson 1 Practice Problems', '2')}

            <Text style={styles.sectionTitle}>Lesson 2: Linear Equations</Text>
            {renderDocItem('Lesson 2 Lecture Notes', '3')}
            {renderDocItem('Lesson 2 Worksheet', '4')}
          </View>
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
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12,
  },
  courseDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    gap: 12,
    marginBottom: 32,
  },
  tabButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#5D5FEF',
  },
  tabActiveOrange: {
    backgroundColor: '#EA580C',
  },
  tabActiveGreen: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 16,
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 18,
  },
  listTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 20,
  },
  homeworkState: {
    paddingTop: 8,
  },
  documentsState: {
    paddingTop: 8,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  docIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  docActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
