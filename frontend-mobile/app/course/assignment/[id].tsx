import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useCourseContext } from '../../context/CourseContext';

export default function AssignmentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, enrolled } = useCourseContext();
  
  // Lấy khóa học đầu tiên người dùng đang học (hoặc fallback là 1)
  const courseId = enrolled && enrolled.length > 0 ? enrolled[0].id : 1;

  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [link, setLink] = useState('');
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const checkSubmission = async () => {
      const status = await AsyncStorage.getItem(`assignment_submitted_${id}`);
      if (status === 'true') {
        setIsSubmitted(true);
      }
    };
    checkSubmission();
  }, [id]);

  const pickDocument = async () => {
    if (isSubmitted) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
        setProgress(0);
      }
    } catch (err) {
      Alert.alert("Error", "Could not pick document");
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để nộp bài.");
      return;
    }

    if ((file || link.trim() !== '') && !uploading && !isSubmitted) {
      setUploading(true);
      setProgress(0);
      try {
        if (file) {
          const formData = new FormData();
          formData.append('studentId', user.id.toString());
          formData.append('studentName', user.username);
          formData.append('title', 'Bài tập số ' + id);
          formData.append('description', comment || 'Không có ghi chú');
          formData.append('file', {
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'application/octet-stream'
          } as any);

          await axios.post(`${API_BASE_URL}/api/courses/${courseId}/submissions/file`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
              }
            }
          });
        } else {
          // Nộp link
          await axios.post(`${API_BASE_URL}/api/courses/${courseId}/submissions/link`, {
            studentId: user.id,
            studentName: user.username,
            title: 'Bài tập số ' + id,
            description: comment || 'Không có ghi chú',
            url: link
          });
          setProgress(100);
        }

        await AsyncStorage.setItem(`assignment_submitted_${id}`, 'true');
        setIsSubmitted(true);
        Alert.alert("Thành công", "Nộp bài thành công!", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } catch (err: any) {
        console.error("Lỗi nộp bài:", err);
        Alert.alert("Lỗi", err.response?.data?.error || "Không thể nộp bài, vui lòng thử lại.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <FontAwesome name="angle-left" size={24} color="#101828" />
        </Pressable>
        <Text style={styles.headerTitle}>Assignment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Title Area */}
        <View style={styles.titleArea}>
          <View style={styles.iconBox}>
            <Text style={{ fontSize: 28 }}>📝</Text>
          </View>
          <View style={styles.titleInfo}>
            <Text style={styles.title}>Create a Color Palette</Text>
            <Text style={styles.subtitle}>Due: Dec 25, 2024  •  100 points</Text>
          </View>
        </View>

        {/* Alert Banner */}
        <View style={styles.alertBanner}>
          <FontAwesome name="clock-o" size={16} color="#EA580C" style={{ marginTop: 2 }} />
          <Text style={styles.alertText}>Due in 5 days</Text>
        </View>

        {/* Instructions */}
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.paragraph}>
          Create a comprehensive color palette for a mobile fitness app. Your palette should include:
        </Text>
        <View style={styles.bulletList}>
          {['Primary colors (2-3 colors)', 'Secondary colors (3-4 colors)', 'Neutral colors (grays, blacks, whites)', 'Success, warning, and error states'].map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.paragraph}>
          Submit your work as a PDF or Figma file. Include brief explanations for your color choices and how they relate to the fitness/wellness theme.
        </Text>

        {/* Requirements */}
        <Text style={styles.sectionTitle}>Requirements</Text>
        <View style={styles.reqList}>
          {[
            'Color palette with at least 8-10 colors',
            'Accessibility considerations (WCAG AA compliance)',
            'Usage guidelines for each color',
            'Examples showing colors in context'
          ].map((req, index) => (
            <View key={index} style={styles.reqItem}>
              <View style={styles.checkSquare}>
                <FontAwesome name="check" size={12} color="#5D5FEF" />
              </View>
              <Text style={styles.reqText}>{req}</Text>
            </View>
          ))}
        </View>

        {/* Submission Area */}
        <Text style={styles.sectionTitle}>Your Submission</Text>
        
        {isSubmitted ? (
          <View style={[styles.uploadBox, { borderColor: '#10B981', backgroundColor: '#ECFDF5' }]}>
            <View style={[styles.uploadIconCircle, { backgroundColor: '#D1FAE5' }]}>
              <FontAwesome name="check" size={24} color="#10B981" />
            </View>
            <Text style={[styles.uploadTitle, { color: '#065F46' }]}>Bạn đã nộp bài</Text>
            <Text style={styles.uploadSub}>Bài tập của bạn đã được ghi nhận.</Text>
          </View>
        ) : (
          <Pressable style={styles.uploadBox} onPress={pickDocument}>
            {file ? (
              <View style={{ alignItems: 'center', width: '100%' }}>
                <View style={[styles.uploadIconCircle, { backgroundColor: '#ECFDF5' }]}>
                  <FontAwesome name="file-text" size={24} color="#10B981" />
                </View>
                <Text style={styles.uploadTitle} numberOfLines={1}>{file.name}</Text>
                {uploading ? (
                  <View style={{ width: '100%', marginTop: 12 }}>
                    <Text style={{ textAlign: 'center', marginBottom: 8, color: '#64748B' }}>Uploading... {progress}%</Text>
                    <View style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3 }}>
                      <View style={{ height: '100%', backgroundColor: '#10B981', borderRadius: 3, width: `${progress}%` }} />
                    </View>
                  </View>
                ) : (
                  <Text style={styles.uploadSub}>Ready to submit ({(file.size ? (file.size / 1024 / 1024).toFixed(2) : 0)} MB)</Text>
                )}
                <Pressable style={[styles.chooseFilesBtn, { backgroundColor: '#F1F5F9', marginTop: 16 }]} onPress={pickDocument}>
                  <Text style={[styles.chooseFilesText, { color: '#475467' }]}>Change File</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.uploadIconCircle}>
                  <FontAwesome name="upload" size={24} color="#5D5FEF" />
                </View>
                <Text style={styles.uploadTitle}>Upload your files</Text>
                <Text style={styles.uploadSub}>Drag and drop or click to browse</Text>
                <View style={styles.chooseFilesBtn}>
                  <Text style={styles.chooseFilesText}>Choose Files</Text>
                </View>
                <Text style={styles.uploadFormats}>Supported formats: PDF, Figma, PNG, JPG (Max 10MB)</Text>
              </>
            )}
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>Link URL (Optional)</Text>
        <TextInput 
          style={[styles.inputUrl, isSubmitted && { backgroundColor: '#F1F5F9', color: '#94A3B8' }]}
          placeholder="Dán link bài làm (Google Drive, Github...)"
          placeholderTextColor="#94A3B8"
          value={link}
          onChangeText={setLink}
          editable={!isSubmitted && !file}
        />

        <Text style={styles.sectionTitle}>Comments (Optional)</Text>
        <TextInput 
          style={[styles.textArea, isSubmitted && { backgroundColor: '#F1F5F9', color: '#94A3B8' }]}
          placeholder="Add any additional notes or explanations..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={comment}
          onChangeText={setComment}
          editable={!isSubmitted}
        />

      </ScrollView>

      {/* Bottom Button */}
      {!isSubmitted && (
        <View style={styles.bottomBar}>
          <Pressable 
            style={(file || link.trim() !== '') && !uploading ? styles.submitBtnActive : styles.submitBtnDisabled}
            onPress={handleSubmit}
            disabled={uploading}
          >
            <FontAwesome name="check" size={16} color={(file || link.trim() !== '') && !uploading ? "#FFFFFF" : "#94A3B8"} />
            <Text style={(file || link.trim() !== '') && !uploading ? styles.submitBtnTextActive : styles.submitBtnTextDisabled}>
              {uploading ? `Uploading... ${progress}%` : "Submit Assignment"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    padding: 24,
    paddingBottom: 120,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#5D5FEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleInfo: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCE8',
    borderWidth: 1,
    borderColor: '#FEF08A',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 32,
  },
  alertText: {
    color: '#B45309',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 16,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#475467',
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletList: {
    marginBottom: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#475467',
    marginTop: 10,
    marginRight: 12,
  },
  bulletText: {
    fontSize: 15,
    color: '#475467',
    lineHeight: 24,
    flex: 1,
  },
  reqList: {
    marginBottom: 32,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkSquare: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  reqText: {
    fontSize: 15,
    color: '#475467',
    flex: 1,
    lineHeight: 24,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  uploadSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  chooseFilesBtn: {
    backgroundColor: '#5D5FEF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  chooseFilesText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  uploadFormats: {
    fontSize: 12,
    color: '#94A3B8',
  },
  inputUrl: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    color: '#101828',
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    height: 120,
    color: '#101828',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submitBtnDisabled: {
    backgroundColor: '#F1F5F9',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnTextDisabled: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '700',
  },
  submitBtnActive: {
    backgroundColor: '#5D5FEF',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnTextActive: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
