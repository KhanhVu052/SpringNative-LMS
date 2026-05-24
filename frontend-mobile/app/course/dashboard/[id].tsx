import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCourseContext } from "../../context/CourseContext";

export default function EnrolledDashboardScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getCourseById, unenrollCourse } = useCourseContext();
  const course = getCourseById(id as string) || {
    title: "Course Details",
    author: "Unknown",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 0,
    rating: "0.0",
    duration: "0h",
    level: "Beginner",
    description: "",
    color: "#3B82F6",
  };

  const [showUnenrollModal, setShowUnenrollModal] = useState(false);

  const gradientColors =
    course.color === "#A855F7"
      ? (["#A855F7", "#4C1D95"] as const)
      : (["#3B82F6", "#1E3A8A"] as const);

  const progressPercent = course.progress || 75;
  const lessonsCompleted = course.lessonsCompleted || 15;
  const totalLessons = course.totalLessons || 20;

  const handleUnenroll = async () => {
    setShowUnenrollModal(false);
    await unenrollCourse(id as string);
    if (course.type === "free") {
      router.replace(`/course/free/${id}` as any);
    } else {
      router.replace(`/course/paid/${id}` as any);
    }
  };

  return (
    <View style={styles.container}>
      {/* UNENROLL MODAL */}
      <Modal visible={showUnenrollModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <FontAwesome
                name="exclamation-triangle"
                size={32}
                color="#F59E0B"
              />
            </View>
            <Text style={styles.modalTitle}>Unenroll from Course?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to unenroll from "{course.title}"? Your
              progress will be saved if you enroll again.
            </Text>

            <Pressable style={styles.modalYesBtn} onPress={handleUnenroll}>
              <Text style={styles.modalYesText}>Yes, Unenroll</Text>
            </Pressable>
            <Pressable
              style={styles.modalCancelBtn}
              onPress={() => setShowUnenrollModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <FontAwesome name="angle-left" size={24} color="#101828" />
        </Pressable>
        <Text style={styles.headerTitle}>My Course</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn}>
            <FontAwesome name="bookmark" size={20} color="#5D5FEF" />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <FontAwesome name="share-alt" size={20} color="#101828" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner */}
        <LinearGradient colors={gradientColors} style={styles.banner}>
          <View style={styles.enrolledBadge}>
            <FontAwesome name="check-circle-o" size={14} color="#FFFFFF" />
            <Text style={styles.enrolledText}>Enrolled</Text>
          </View>

          <View style={styles.bannerIcon}>
            <Text style={{ fontSize: 64 }}>🎓</Text>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                {progressPercent}% Complete
              </Text>
              <Text style={styles.progressText}>
                {lessonsCompleted}/{totalLessons} Lessons
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Title & Info */}
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.author}>by {course.author || "Instructor"}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <FontAwesome name="star" size={14} color="#F59E0B" />
            <Text style={styles.statText}>{course.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="clock-o" size={14} color="#64748B" />
            <Text style={styles.statText}>{course.duration}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="bar-chart" size={14} color="#64748B" />
            <Text style={styles.statText}>{course.level || "Beginner"}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <Pressable
          style={styles.continueBtn}
          onPress={() => router.push(`/course/enrolled/${id}/learn` as any)}
        >
          <Text style={styles.continueBtnText}>Continue Learning</Text>
        </Pressable>

        <Pressable
          style={styles.unenrollBtn}
          onPress={() => setShowUnenrollModal(true)}
        >
          <Text style={styles.unenrollBtnText}>Unenroll from Course</Text>
        </Pressable>

        <View style={styles.divider} />

        {/* Your Progress */}
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressCardsRow}>
          <View style={[styles.progressCard, { backgroundColor: "#FDF4FF" }]}>
            <View
              style={[
                styles.progressIconCircle,
                { backgroundColor: "#F3E8FF" },
              ]}
            >
              <FontAwesome name="check-square-o" size={20} color="#A855F7" />
            </View>
            <Text style={[styles.progressNum, { color: "#A855F7" }]}>
              {lessonsCompleted}
            </Text>
            <Text style={styles.progressLabel}>Completed</Text>
          </View>

          <View style={[styles.progressCard, { backgroundColor: "#F0F9FF" }]}>
            <View
              style={[
                styles.progressIconCircle,
                { backgroundColor: "#E0F2FE" },
              ]}
            >
              <FontAwesome name="line-chart" size={20} color="#3B82F6" />
            </View>
            <Text style={[styles.progressNum, { color: "#3B82F6" }]}>
              {progressPercent}%
            </Text>
            <Text style={styles.progressLabel}>Progress</Text>
          </View>

          <View style={[styles.progressCard, { backgroundColor: "#FFF7ED" }]}>
            <View
              style={[
                styles.progressIconCircle,
                { backgroundColor: "#FFEDD5" },
              ]}
            >
              <FontAwesome name="certificate" size={20} color="#EA580C" />
            </View>
            <Text style={[styles.progressNum, { color: "#EA580C" }]}>
              {totalLessons - lessonsCompleted}
            </Text>
            <Text style={styles.progressLabel}>Remaining</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* About this course */}
        <Text style={styles.sectionTitle}>About this course</Text>
        <Text style={styles.aboutText}>
          {course.description ||
            "Master fundamental concepts and expand your general knowledge across various topics."}
        </Text>

        <View style={styles.divider} />

        {/* Your Instructor */}
        <Text style={styles.sectionTitle}>Your Instructor</Text>
        <View style={styles.instructorCard}>
          <View style={styles.instructorAvatar}>
            <Text style={{ fontSize: 32 }}>👨‍🏫</Text>
          </View>
          <View style={styles.instructorInfo}>
            <Text style={styles.instructorName}>
              {course.author || "By Instructor"}
            </Text>
            <Text style={styles.instructorRole}>Expert Instructor</Text>
            <View style={styles.instructorStats}>
              <FontAwesome name="star" size={12} color="#F59E0B" />
              <Text style={styles.instructorStatText}>4.9 rating</Text>
              <Text style={styles.instructorStatDot}>•</Text>
              <Text style={styles.instructorStatText}>10k+ students</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalYesBtn: {
    width: "100%",
    backgroundColor: "#E11D48",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  modalYesText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  modalCancelBtn: {
    width: "100%",
    backgroundColor: "#F1F5F9",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#475467",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101828",
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  banner: {
    height: 200,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    position: "relative",
    justifyContent: "flex-end",
  },
  enrolledBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  enrolledText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  bannerIcon: {
    position: "absolute",
    top: "25%",
    alignSelf: "center",
  },
  progressSection: {
    width: "100%",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 8,
  },
  author: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  continueBtn: {
    backgroundColor: "#5D5FEF",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  unenrollBtn: {
    backgroundColor: "#F1F5F9",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  unenrollBtnText: {
    color: "#475467",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 16,
  },
  progressCardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  progressCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  progressIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  progressNum: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  aboutText: {
    fontSize: 15,
    color: "#475467",
    lineHeight: 24,
  },
  instructorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FF",
    padding: 16,
    borderRadius: 20,
  },
  instructorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#C4B5FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 4,
  },
  instructorRole: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
  },
  instructorStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  instructorStatText: {
    fontSize: 12,
    color: "#64748B",
  },
  instructorStatDot: {
    fontSize: 12,
    color: "#CBD5E1",
  },
});
