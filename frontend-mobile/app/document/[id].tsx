import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { API_BASE_URL } from '../config';

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

export default function DocumentViewerScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock document data
  const documentTitle = id === '1' ? 'Lesson 1 Lecture Notes' : 
                        id === '2' ? 'Lesson 1 Practice Problems' : 
                        id === '3' ? 'Lesson 2 Lecture Notes' : 'Document Viewer';

  const handleDownload = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập');
        return;
      }

      Alert.alert('Đang tải', 'Vui lòng chờ trong giây lát...', [], { cancelable: true });

      const fileUri = FileSystem.documentDirectory + `document_${id}.pdf`;
      
      const result = await FileSystem.downloadAsync(
        `${API_BASE_URL}/api/books/${id}/download`,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (result && result.uri) {
        if (Platform.OS === 'android') {
          // Xin quyền chọn thư mục trên Android
          const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (permissions.granted) {
            // Đọc file vừa tải thành chuỗi base64
            const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
            // Tạo file mới trong thư mục người dùng đã chọn
            const newUri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, `document_${id}.pdf`, 'application/pdf');
            // Ghi dữ liệu vào file mới
            await FileSystem.writeAsStringAsync(newUri, base64, { encoding: FileSystem.EncodingType.Base64 });
            Alert.alert('Thành công', 'File đã được lưu vào máy!');
          }
        } else {
          // Trên iOS, Share menu là cách chuẩn mực để Save to Files
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(result.uri, { 
              dialogTitle: 'Lưu tài liệu vào máy',
              mimeType: 'application/pdf' 
            });
          } else {
            Alert.alert('Thành công', 'File đã được tải về app: ' + result.uri);
          }
        }
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Lỗi', 'Không thể lưu file. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <FontAwesome name="angle-left" size={24} color="#101828" />
        </Pressable>
        <Text style={styles.headerTitle}>{documentTitle}</Text>
        <Pressable style={styles.iconBtn} onPress={handleDownload}>
          <FontAwesome name="download" size={20} color="#101828" />
        </Pressable>
      </View>

      <View style={styles.pdfContainer}>
        <View style={styles.pdfPlaceholder}>
          <FontAwesome name="file-pdf-o" size={64} color="#EF4444" style={{ marginBottom: 16 }} />
          <Text style={styles.pdfText}>PDF Viewer</Text>
          <Text style={styles.pdfSubtext}>This is a placeholder for the actual PDF document.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    textAlign: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfContainer: {
    flex: 1,
    padding: 24,
  },
  pdfPlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pdfText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  pdfSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});
