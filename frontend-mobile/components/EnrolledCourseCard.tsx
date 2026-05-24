import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ViewStyle, StyleProp } from 'react-native';

interface EnrolledCourseCardProps {
  id: number;
  name: string;
  progress: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function EnrolledCourseCard({
  name,
  progress,
  onPress,
  style,
}: EnrolledCourseCardProps) {
  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/150/7C6CFF/FFFFFF?text=Enrolled' }} 
          style={styles.image} 
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}% Complete</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 260,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 16,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  progressContainer: {
    gap: 6,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5D5FEF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
