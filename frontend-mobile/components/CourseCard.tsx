import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CourseCardProps {
  id: number;
  name: string;
  description?: string;
  price?: number;
  isPremium?: boolean;
  onPress: () => void;
}

export default function CourseCard({
  name,
  description,
  price,
  isPremium,
  onPress,
}: CourseCardProps) {
  const isFree = !price || price === 0;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {/* Placeholder image */}
        <Image 
          source={{ uri: 'https://via.placeholder.com/150/5D5FEF/FFFFFF?text=Course' }} 
          style={styles.image} 
        />
        {isPremium && (
          <View style={styles.premiumBadge}>
            <FontAwesome name="star" size={12} color="#FFFFFF" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {description || 'No description available'}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.price, isFree && styles.freeText]}>
            {isFree ? 'Free' : `$${price}`}
          </Text>
          <View style={styles.rating}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 220,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  freeText: {
    color: '#10B981',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
