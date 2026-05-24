import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    ViewToken,
} from "react-native";

const slides = [
  {
    key: "one",
    title: "Education is the best learn ever",
    description:
      "Build knowledge with every step and enjoy a polished study experience designed for learners.",
    accent: "#D7E4FF",
  },
  {
    key: "two",
    title: "Education is the best learn ever",
    description:
      "Track progress, stay motivated, and move confidently through each lesson.",
    accent: "#FFF3DE",
  },
  {
    key: "three",
    title: "Education is the best learn ever",
    description:
      "Complete onboarding quickly and access lessons, quizzes, and rewards in one place.",
    accent: "#E6FFE8",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<(typeof slides)[number]>>(null);

  const goToHomeScreen = () => {
    router.replace("/login");
  };

  const handleNext = () => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < slides.length) {
      flatListRef.current?.scrollToIndex({ index: nextIndex });
    } else {
      goToHomeScreen();
    }
  };

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View
              style={[styles.illustration, { backgroundColor: item.accent }]}
            >
              <View style={styles.illustrationCard} />
              <View style={styles.illustrationBadge} />
              <View style={styles.illustrationSpark} />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.paginationRow}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable onPress={goToHomeScreen}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>

        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  slide: {
    paddingTop: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  illustration: {
    width: "100%",
    height: 340,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    overflow: "hidden",
  },
  illustrationCard: {
    width: 220,
    height: 180,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  illustrationBadge: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: "#5D5FEF",
    top: 28,
    right: 28,
  },
  illustrationSpark: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    bottom: 28,
    left: 28,
    opacity: 0.7,
  },
  content: {
    width: "100%",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#475467",
    lineHeight: 24,
    marginBottom: 12,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 28,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#5D5FEF",
  },
  inactiveDot: {
    backgroundColor: "#CBD5E1",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  skipText: {
    color: "#475467",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#5D5FEF",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
