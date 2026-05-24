import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Dimensions, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCourseContext } from '../context/CourseContext';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { isLoggedIn, user, logout, login, enrolled, savedDocuments } = useCourseContext();

  const enrolledCount = enrolled ? enrolled.length : 0;
  const savedDocsCount = savedDocuments ? savedDocuments.length : 0;

  const [modalVisible, setModalVisible] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/api/users/${user.id}`, {
        username: editUsername,
        email: editEmail
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const updatedUser = response.data;
      if (typeof updatedUser === 'string') {
        throw new Error('Phiên đăng nhập hết hạn hoặc lỗi máy chủ.');
      }
      
      await AsyncStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
      
      login({ ...user, ...updatedUser });

      setModalVisible(false);
      Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!');
    } catch (error: any) {
      console.error(error);
      let errorMsg = 'Failed to update profile.';
      if (typeof error.response?.data === 'string') {
        errorMsg = error.response.data;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      Alert.alert('Lỗi', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const requireLogin = () => {
    Alert.alert('Login Required', 'Please login to access this feature.', [
      { text: 'Later', style: 'cancel' },
      { text: 'Login', onPress: () => router.push('/login') }
    ]);
  };

  const displayName = isLoggedIn && user?.username ? user.username : 'Guest';
  const displayEmail = isLoggedIn && user?.email ? user.email : 'Not logged in';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Top Header Background */}
      <LinearGradient colors={['#7C6CFF', '#5D5FEF']} style={styles.headerGradient}>
        
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {isLoggedIn && (
            <View style={styles.cameraBadge}>
              <FontAwesome name="camera" size={12} color="#5D5FEF" />
            </View>
          )}
        </View>

        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{displayEmail}</Text>

        {isLoggedIn && (
          <Pressable style={styles.editBtn} onPress={() => {
            setEditUsername(user?.username || '');
            setEditEmail(user?.email || '');
            setModalVisible(true);
          }}>
            <FontAwesome name="edit" size={14} color="#FFFFFF" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </Pressable>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={{ fontSize: 28, marginBottom: 8 }}>📚</Text>
            <Text style={styles.statNumber}>{isLoggedIn ? enrolledCount.toString() : '0'}</Text>
            <Text style={styles.statLabel}>Total Course</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={{ fontSize: 28, marginBottom: 8 }}>✅</Text>
            <Text style={styles.statNumber}>{isLoggedIn ? '8' : '0'}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Badges</Text>
        <View style={styles.badgesRow}>
          <View style={styles.badgeItem}>
            <View style={[styles.badgeIconBox, { backgroundColor: '#E2E8F0' }]}>
              <Text style={{ fontSize: 32 }}>🥈</Text>
            </View>
            <Text style={styles.badgeText}>Silver</Text>
          </View>
          <View style={styles.badgeItem}>
            <View style={[styles.badgeIconBox, { backgroundColor: '#FCD34D' }]}>
              <Text style={{ fontSize: 32 }}>🥇</Text>
            </View>
            <Text style={styles.badgeText}>Gold</Text>
          </View>
          <View style={styles.badgeItem}>
            <View style={[styles.badgeIconBox, { backgroundColor: '#10B981' }]}>
              <Text style={{ fontSize: 32 }}>🎓</Text>
            </View>
            <Text style={styles.badgeText}>Graduate</Text>
          </View>
          <View style={styles.badgeItem}>
            <View style={[styles.badgeIconBox, { backgroundColor: '#F97316' }]}>
              <Text style={{ fontSize: 32 }}>🏆</Text>
            </View>
            <Text style={styles.badgeText}>Champion</Text>
          </View>
        </View>
      </View>

      {/* Menus Section */}
      <View style={styles.menuContainer}>
        <Pressable style={styles.menuItem} onPress={isLoggedIn ? () => router.push('/my-courses' as any) : requireLogin}>
          <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
            <Text style={{ fontSize: 20 }}>🎓</Text>
          </View>
          <Text style={styles.menuText}>My Courses</Text>
          {isLoggedIn && (
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>{enrolledCount}</Text>
            </View>
          )}
          <FontAwesome name="angle-right" size={20} color="#94A3B8" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={isLoggedIn ? () => router.push('/my-documents' as any) : requireLogin}>
          <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
            <Text style={{ fontSize: 20 }}>📄</Text>
          </View>
          <Text style={styles.menuText}>My Documents</Text>
          {isLoggedIn && (
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>{savedDocsCount}</Text>
            </View>
          )}
          <FontAwesome name="angle-right" size={20} color="#94A3B8" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={isLoggedIn ? () => {} : requireLogin}>
          <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
            <Text style={{ fontSize: 20 }}>📜</Text>
          </View>
          <Text style={styles.menuText}>Certificates</Text>
          {isLoggedIn && (
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>3</Text>
            </View>
          )}
          <FontAwesome name="angle-right" size={20} color="#94A3B8" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={isLoggedIn ? () => {} : requireLogin}>
          <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
            <FontAwesome name="gear" size={20} color="#5D5FEF" />
          </View>
          <Text style={styles.menuText}>Settings</Text>
          <FontAwesome name="angle-right" size={20} color="#94A3B8" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
            <FontAwesome name="share-alt" size={20} color="#5D5FEF" />
          </View>
          <Text style={styles.menuText}>Share the app</Text>
          <FontAwesome name="angle-right" size={20} color="#94A3B8" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
            <FontAwesome name="question-circle-o" size={20} color="#5D5FEF" />
          </View>
          <Text style={styles.menuText}>Contact us</Text>
          <FontAwesome name="angle-right" size={20} color="#94A3B8" />
        </Pressable>

        {isLoggedIn ? (
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.loginButton} onPress={() => router.push('/login')}>
            <FontAwesome name="sign-in" size={20} color="#5D5FEF" />
            <Text style={styles.loginText}>Login / Register</Text>
          </Pressable>
        )}
      </View>

      <View style={{ height: 40 }} />

      {/* Edit Profile Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <FontAwesome name="close" size={24} color="#64748B" />
              </Pressable>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput 
                style={styles.input} 
                value={editUsername} 
                onChangeText={setEditUsername} 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={styles.input} 
                value={editEmail} 
                onChangeText={setEditEmail} 
                keyboardType="email-address"
              />
            </View>

            <Pressable style={styles.saveBtn} onPress={handleSaveProfile} disabled={saving}>
              <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  headerGradient: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8B7BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A89BFF',
  },
  avatarText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7C6CFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#E0E7FF',
    marginBottom: 16,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 24,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#E0E7FF',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeItem: {
    alignItems: 'center',
    width: (width - 48) / 4 - 8,
  },
  badgeIconBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#475467',
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
  },
  menuBadge: {
    backgroundColor: '#E9EEFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  menuBadgeText: {
    color: '#5D5FEF',
    fontWeight: '700',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    gap: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9EEFF',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    gap: 8,
  },
  loginText: {
    color: '#5D5FEF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 360,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475467',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FF',
    color: '#0F172A',
  },
  saveBtn: {
    backgroundColor: '#5D5FEF',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
