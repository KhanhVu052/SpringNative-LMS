import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCourseContext } from './context/CourseContext';

export default function SearchScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(q ? String(q) : '');
  const { recommended, premium } = useCourseContext();

  const allCoursesMap = new Map();
  recommended.forEach((c: any) => allCoursesMap.set(c.id, c));
  premium.forEach((c: any) => allCoursesMap.set(c.id, c));
  const allCourses = Array.from(allCoursesMap.values());

  const filteredCourses = allCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome name="arrow-left" size={20} color="#101828" />
        </Pressable>
        <Text style={styles.headerTitle}>Search course</Text>
      </View>

      <View style={styles.searchBox}>
        <FontAwesome name="search" size={16} color="#94A3B8" style={{ marginRight: 12 }} />
        <TextInput 
          style={styles.input}
          placeholder="Popular English course"
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {searchQuery ? (
          <Text style={styles.resultText}>Result {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} "{searchQuery}"</Text>
        ) : (
          <Text style={styles.resultText}>All Courses ({filteredCourses.length})</Text>
        )}

        {filteredCourses.length > 0 ? (
          <View style={styles.grid}>
            {filteredCourses.map(course => (
              <Pressable key={course.id} style={styles.card} onPress={() => {
                const isPremium = premium.some((p: any) => p.id === course.id);
                router.push(`/course/${isPremium ? 'paid' : 'free'}/${course.id}` as any);
              }}>
                <View style={[styles.cardImage, { backgroundColor: course.color }]}>
                  <Text style={{ fontSize: 40 }}>{course.icon}</Text>
                  <View style={styles.playIconContainer}>
                     <FontAwesome name="play" size={16} color="#FFFFFF" style={{ marginLeft: 3 }} />
                  </View>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{course.title}</Text>
                  <View style={styles.authorRow}>
                    <View style={styles.authorAvatar}>
                      <FontAwesome name="user" size={10} color="#FFFFFF" />
                    </View>
                    <Text style={styles.authorName} numberOfLines={1}>{course.author}</Text>
                    <FontAwesome name="certificate" size={14} color="#F0604A" style={{ marginLeft: 'auto' }} />
                  </View>
                  <Text style={styles.cardMeta}>1.15 hours • 12 Lesson</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
             <FontAwesome name="search" size={48} color="#CBD5E1" />
             <Text style={styles.emptyStateText}>Không có kết quả</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backBtn: { padding: 8, marginLeft: -8, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#101828' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  input: { flex: 1, fontSize: 16, color: '#0F172A' },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  resultText: { fontSize: 16, fontWeight: '700', color: '#475467', marginBottom: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playIconContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#101828', marginBottom: 8, minHeight: 40 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  authorAvatar: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#5D5FEF', justifyContent: 'center', alignItems: 'center', marginRight: 8
  },
  authorName: { fontSize: 12, color: '#475467', flex: 1, marginRight: 4 },
  cardMeta: { fontSize: 11, color: '#94A3B8' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyStateText: { fontSize: 16, color: '#64748B', marginTop: 16 },
});
