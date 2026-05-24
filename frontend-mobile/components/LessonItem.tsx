import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface LessonItemProps {
  index: number;
  title: string;
  duration?: string;
  isCompleted?: boolean;
  onPress: () => void;
}

export default function LessonItem({
  index,
  title,
  duration,
  isCompleted,
  onPress,
}: LessonItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={[styles.indexCircle, isCompleted && styles.completedCircle]}>
        {isCompleted ? (
          <FontAwesome name="check" size={12} color="#FFFFFF" />
        ) : (
          <Text style={styles.indexText}>{index}</Text>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.duration}>{duration || '10 mins'}</Text>
      </View>
      <View style={styles.playBtn}>
        <FontAwesome name="play-circle" size={24} color="#5D5FEF" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  indexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E9EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  completedCircle: {
    backgroundColor: '#10B981',
  },
  indexText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5D5FEF',
  },
  content: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 4,
  },
  duration: {
    fontSize: 13,
    color: '#64748B',
  },
  playBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
