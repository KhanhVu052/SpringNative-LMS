import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface ProfileProps {
  navigation: any;
}

export default function Profile({ navigation }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');

  const badges = [
    { id: '1', emoji: '🥈', label: '1st' },
    { id: '2', emoji: '🥇', label: '2nd' },
    { id: '3', emoji: '🏆', label: '3rd' },
    { id: '4', emoji: '🏅', label: '4th' },
  ];

  return (
    <View style={styles.container}>
      {/* Blue Header with Profile Photo */}
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Profile Photo centered in the header */}
        <View style={styles.photoWrapper}>
          <View style={styles.photoPlaceholder}>
            <FontAwesome5 name="user-alt" size={80} color="#ccc" />
          </View>
        </View>
      </View>

      {/* White Card Section */}
      <View style={styles.whiteCard}>
        {/* Edit Button (floating) */}
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('edit-profile')}>
          <MaterialIcons name="edit" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Name and Grade */}
        <View style={styles.nameSection}>
          <Text style={styles.nameText}>Mr. James Smith</Text>
          <Text style={styles.gradeText}>12th Grade</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <FontAwesome5 name="book-open" size={28} color="#fff" style={styles.statIcon} />
            <Text style={styles.statLabel}>Total Course</Text>
            <Text style={styles.statValue}>126</Text>
          </View>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <FontAwesome5 name="book-open" size={28} color="#fff" style={styles.statIcon} />
            <Text style={styles.statLabel}>Total Course</Text>
            <Text style={styles.statValue}>126</Text>
          </View>
        </View>

        {/* My Badges */}
        <View style={styles.badgesSection}>
          <Text style={styles.badgesTitle}>My Badges</Text>
          <View style={styles.badgesRow}>
            {badges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('home');
            navigation.navigate('home');
          }}
        >
          <Ionicons
            name="home"
            size={24}
            color={activeTab === 'home' ? '#4361EE' : '#999'}
          />
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('learning')}
        >
          <FontAwesome5
            name="book-reader"
            size={24}
            color={activeTab === 'learning' ? '#4361EE' : '#999'}
          />
          <Text style={[styles.navLabel, activeTab === 'learning' && styles.navLabelActive]}>
            Learning
          </Text>
        </TouchableOpacity>

        {/* Profile FAB */}
        <TouchableOpacity
          style={styles.profileFab}
          onPress={() => setActiveTab('profile')}
        >
          <FontAwesome5 name="user-alt" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },

  /* ── Header ── */
  headerContainer: {
    height: 280,
    backgroundColor: '#4361EE',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
    // Subtle gradient feel via a slightly lighter top
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 10,
  },
  photoWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  photoPlaceholder: {
    width: 180,
    height: 220,
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    backgroundColor: '#d0d8f0',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    paddingBottom: 0,
  },

  /* ── White Card ── */
  whiteCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 100,
  },
  editButton: {
    position: 'absolute',
    top: -22,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#777',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  /* ── Name ── */
  nameSection: {
    marginBottom: 20,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  gradeText: {
    fontSize: 14,
    color: '#888',
  },

  /* ── Stats ── */
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 110,
    justifyContent: 'flex-end',
  },
  statCardOrange: {
    backgroundColor: '#F4845F',
  },
  statCardBlue: {
    backgroundColor: '#4361EE',
  },
  statIcon: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },

  /* ── Badges ── */
  badgesSection: {
    marginTop: 4,
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4361EE',
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 16,
  },
  badgeItem: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  badgeEmoji: {
    fontSize: 36,
  },

  /* ── Bottom Nav ── */
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    paddingVertical: 12,
    paddingBottom: 20,
    paddingHorizontal: 32,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#4361EE',
    fontWeight: '600',
  },
  profileFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4361EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 6,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
