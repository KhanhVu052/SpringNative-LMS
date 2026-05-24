import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function CategoriesScreen() {
  const router = useRouter();

  const categories = [
    { name: "Language", icon: "🗣️", color: "#F0604A" },
    { name: "Math", icon: "∑", color: "#4E70D4" },
    { name: "Biology", icon: "🔬", color: "#16A34A" },
    { name: "Agriculture", icon: "🚜", color: "#3B82F6" },
    { name: "Science", icon: "🧪", color: "#A855F7" },
    { name: "Music", icon: "🎵", color: "#E11D48" },
    { name: "Arts", icon: "🎨", color: "#F59E0B" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#101828" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {categories.map((cat, idx) => (
          <Pressable key={idx} style={styles.item} onPress={() => router.push(`/search?q=${cat.name}` as any)}>
            <View style={styles.iconContainer}>
              <Text style={{ fontSize: 28, color: cat.color }}>{cat.icon}</Text>
            </View>
            <Text style={styles.name}>{cat.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 48,
    alignItems: 'center',
    marginRight: 16,
  },
  name: { fontSize: 20, color: '#475467', fontWeight: '500' }
});
