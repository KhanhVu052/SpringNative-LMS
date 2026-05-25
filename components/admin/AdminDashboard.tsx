import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import Statistic from './Statistic';
import UsersList from './UsersList';
import TeachersList from './TeachersList';

export default function AdminDashboard({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState<'statistic' | 'users' | 'teachers'>('statistic');
  const { setToken, setUserId, setRole } = useUser();

  const handleLogout = () => {
    if (setToken) setToken(undefined);
    if (setUserId) setUserId('');
    if (setRole) setRole('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'statistic':
        return <Statistic navigation={navigation} />;
      case 'users':
        return <UsersList navigation={navigation} />;
      case 'teachers':
        return <TeachersList navigation={navigation} />;
      default:
        return <Statistic navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Admin Dashboard Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>System Console</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Main Tab Viewport */}
      <View style={styles.viewport}>
        {renderContent()}
      </View>

      {/* Premium Admin Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'statistic' && styles.navItemActive]}
          onPress={() => setActiveTab('statistic')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === 'statistic' ? 'bar-chart' : 'bar-chart-outline'}
            size={22}
            color={activeTab === 'statistic' ? '#4F46E5' : '#64748B'}
          />
          <Text style={[styles.navLabel, activeTab === 'statistic' && styles.navLabelActive]}>
            Statistic
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'users' && styles.navItemActive]}
          onPress={() => setActiveTab('users')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === 'users' ? 'people' : 'people-outline'}
            size={22}
            color={activeTab === 'users' ? '#4F46E5' : '#64748B'}
          />
          <Text style={[styles.navLabel, activeTab === 'users' && styles.navLabelActive]}>
            Users
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'teachers' && styles.navItemActive]}
          onPress={() => setActiveTab('teachers')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === 'teachers' ? 'school' : 'school-outline'}
            size={22}
            color={activeTab === 'teachers' ? '#4F46E5' : '#64748B'}
          />
          <Text style={[styles.navLabel, activeTab === 'teachers' && styles.navLabelActive]}>
            Teachers
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  adminBadge: {
    backgroundColor: '#EEF2FF',
    borderColor: '#E0E7FF',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  adminBadgeText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewport: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 4,
  },
  navItemActive: {
    backgroundColor: '#EEF2FF',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  navLabelActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});
