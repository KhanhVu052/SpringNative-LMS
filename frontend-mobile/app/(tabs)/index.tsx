import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCourseContext } from "../context/CourseContext";

export default function HomeScreen() {
  const router = useRouter();

  const { enrolled, recommended, premium, isLoggedIn, user } =
    useCourseContext();

  const [searchQuery, setSearchQuery] = useState("");

  const displayName = isLoggedIn && user?.username ? user.username : "Guest";

  const filteredRecommended = recommended.filter((c: any) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPremium = premium.filter((c: any) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={() => router.push("/(tabs)/profile" as any)}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {displayName.substring(0, 2).toUpperCase()}
            </Text>
          </Pressable>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.nameText}>{displayName}</Text>
          </View>
        </View>
        <Pressable style={styles.bellIcon}>
          <FontAwesome name="bell-o" size={20} color="#5D5FEF" />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      {/* Search and Category Row */}
      <View style={styles.searchRow}>

        <Pressable
          style={styles.searchContainer}
          onPress={() => router.push("/search" as any)}
        >
          <View
            pointerEvents="none"
            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Search lesson, name, science"
              placeholderTextColor="#94A3B8"
              editable={false}
            />
          </View>
          <FontAwesome name="search" size={16} color="#94A3B8" />
        </Pressable>
      </View>

      {/* Enrolled Courses (Large Category Cards) */}
      {enrolled.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.largeCardsScroll}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16 }}
        >
          {enrolled.map((course: any) => (
            <Pressable
              key={course.id}
              style={[
                styles.largeCard,
                { backgroundColor: course.color || "#5D5FEF" },
              ]}
              onPress={() =>
                router.push(`/course/dashboard/${course.id}` as any)
              }
            >
              <View
                style={[
                  styles.largeCardIcon,
                  { backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
              >
                <Text style={{ fontSize: 24 }}>{course.icon}</Text>
              </View>
              <Text style={styles.largeCardTitle}>{course.title}</Text>
              <Text style={styles.largeCardSub}>20 Lessons</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      {/* Where You Left */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { marginLeft: 24, marginBottom: 16 }]}
        >
          Where You Left
        </Text>
        <View style={styles.whereLeftCard}>
          <View style={styles.rocketIconContainer}>
            <Text style={{ fontSize: 24 }}>🚀</Text>
          </View>
          <View style={styles.whereLeftInfo}>
            <Text style={styles.whereLeftTitle}>How to get started</Text>
            <Text style={styles.whereLeftSub}>
              Not start from where you left
            </Text>
          </View>
          <Pressable style={styles.arrowButton}>
            <FontAwesome name="chevron-right" size={12} color="#5D5FEF" />
          </Pressable>
        </View>
      </View>

      {/* All Courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Courses</Text>
          <Pressable>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {[
            { name: "Coding", icon: "💻", color: "#E0F2FE" },
            { name: "Technology", icon: "📱", color: "#F3E8FF" },
            { name: "Economics", icon: "📈", color: "#FEF3C7" },
            { name: "Science", icon: "🔬", color: "#DCFCE7" },
            { name: "Programming", icon: "⚙️", color: "#FCE7F3" },
            { name: "Music", icon: "🎵", color: "#E0E7FF" },
            { name: "Art", icon: "🎨", color: "#FFEDD5" },
            { name: "Literature", icon: "📚", color: "#F1F5F9" },
            { name: "Language", icon: "🗣️", color: "#FFF7ED" },
            { name: "General math", icon: "🔢", color: "#ECFDF5" },
            { name: "Biology", icon: "🧬", color: "#FEFCE8" },
          ].map((cat, idx) => (
            <View key={idx} style={styles.subjectItem}>
              <View
                style={[styles.subjectIcon, { backgroundColor: cat.color }]}
              >
                <Text style={{ fontSize: 24 }}>{cat.icon}</Text>
              </View>
              <Text style={styles.subjectName}>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Recommended for you */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <Pressable>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {filteredRecommended.length > 0 ? (
            filteredRecommended.map((course: any) => (
              <Pressable
                key={course.id}
                style={styles.courseCard}
                onPress={() => router.push(`/course/free/${course.id}` as any)}
              >
                <View
                  style={[
                    styles.courseImage,
                    { backgroundColor: course.color },
                  ]}
                >
                  <Text style={{ fontSize: 60 }}>{course.icon}</Text>
                </View>
                <View style={styles.courseCardInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseAuthor}>{course.author}</Text>
                  <View style={styles.courseFooter}>
                    <Text style={styles.coursePrice}>{course.price}</Text>
                    <View style={styles.likesRow}>
                      <FontAwesome name="heart" size={12} color="#EF4444" />
                      <Text style={styles.likesText}>{course.likes} likes</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={{ color: "#64748B" }}>
              No courses match your search.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Premium Courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Premium Courses</Text>
          <Pressable>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {filteredPremium.length > 0 ? (
            filteredPremium.map((course: any) => (
              <Pressable
                key={course.id}
                style={styles.courseCard}
                onPress={() => router.push(`/course/paid/${course.id}` as any)}
              >
                <View
                  style={[
                    styles.courseImage,
                    { backgroundColor: course.color },
                  ]}
                >
                  <Text style={{ fontSize: 60 }}>{course.icon}</Text>
                </View>
                <View style={styles.courseCardInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseAuthor}>{course.author}</Text>
                  <View style={styles.courseFooter}>
                    <Text style={styles.coursePrice}>{course.price}</Text>
                    <View style={styles.likesRow}>
                      <FontAwesome name="heart" size={12} color="#EF4444" />
                      <Text style={styles.likesText}>{course.likes} likes</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={{ color: "#64748B" }}>
              No courses match your search.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Chat Support */}
      <View style={styles.section}>
        <Pressable style={styles.whereLeftCard}>
          <View
            style={[styles.rocketIconContainer, { backgroundColor: "#F1F5F9" }]}
          >
            <FontAwesome name="comment-o" size={24} color="#5D5FEF" />
          </View>
          <View style={styles.whereLeftInfo}>
            <Text style={styles.whereLeftTitle}>Chat Support</Text>
            <Text style={styles.whereLeftSub}>Start a conversation now</Text>
          </View>
          <FontAwesome name="chevron-right" size={12} color="#94A3B8" />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  content: {
    paddingBottom: 40,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
  },
  greeting: {
    fontSize: 14,
    color: "#64748B",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101828",
  },
  bellIcon: {
    padding: 8,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  categoryDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5D5FEF",
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  categoryText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  largeCardsScroll: {
    marginBottom: 24,
  },
  largeCard: {
    width: 200,
    height: 160,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
  },
  largeCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  largeCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  largeCardSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5D5FEF",
  },
  whereLeftCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rocketIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#5D5FEF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  whereLeftInfo: {
    flex: 1,
  },
  whereLeftTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 4,
  },
  whereLeftSub: {
    fontSize: 13,
    color: "#64748B",
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E9EEFF",
    justifyContent: "center",
    alignItems: "center",
  },
  subjectItem: {
    alignItems: "center",
    marginRight: 24,
  },
  subjectIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#475467",
  },
  courseCard: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  courseImage: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  courseCardInfo: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 4,
  },
  courseAuthor: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 12,
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coursePrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10B981",
  },
  likesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likesText: {
    fontSize: 12,
    color: "#64748B",
  },
});
