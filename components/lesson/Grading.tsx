import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const BASE_URL = 'http://10.0.2.2:8080';

type StudentSubmission = {
    id: number;
    studentId: number;
    studentName: string;
    submittedAt: string;
    status: string;
    mark: number | null;
    comment: string;
};

export default function Grading({ route, navigation }: { route: any; navigation: any }) {
    const { courseId, pathId, contentId, lessonTitle } = route.params || {};

    const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Grading form state
    const [selectedStudent, setSelectedStudent] = useState<StudentSubmission | null>(null);
    const [mark, setMark] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(
                `${BASE_URL}/api/courses/${courseId}/paths/${pathId}/contents/${contentId}/submissions`
            );
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            const mapped: StudentSubmission[] = data.map((item: any) => ({
                id: item.id ?? 0,
                studentId: item.studentId ?? 0,
                studentName: item.studentName || 'Unknown Student',
                submittedAt: item.submittedAt || '',
                status: item.status || 'pending',
                mark: item.mark ?? null,
                comment: item.comment || '',
            }));
            setSubmissions(mapped);
        } catch (err: any) {
            setError(err.message ?? 'Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (courseId && pathId && contentId) {
                fetchSubmissions();
            }
        }, [courseId, pathId, contentId])
    );

    const selectStudent = (student: StudentSubmission) => {
        setSelectedStudent(student);
        setMark(student.mark !== null ? String(student.mark) : '');
        setComment(student.comment || '');
    };

    const clearSelection = () => {
        setSelectedStudent(null);
        setMark('');
        setComment('');
    };

    const handleSubmitGrade = async () => {
        if (!selectedStudent) return;
        if (mark.trim() === '') {
            Alert.alert('Validation', 'Please enter a mark.');
            return;
        }
        const numMark = parseFloat(mark);
        if (isNaN(numMark) || numMark < 0 || numMark > 100) {
            Alert.alert('Validation', 'Mark must be between 0 and 100.');
            return;
        }
        try {
            setSubmitting(true);
            const res = await fetch(
                `${BASE_URL}/api/courses/${courseId}/paths/${pathId}/contents/${contentId}/submissions/${selectedStudent.id}/grade`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mark: numMark,
                        comment: comment.trim(),
                    }),
                }
            );
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || `Server error: ${res.status}`);
            }
            Alert.alert('Success', `Grade submitted for ${selectedStudent.studentName}!`);
            clearSelection();
            fetchSubmissions();
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Failed to submit grade.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'graded':
                return { bg: '#E8F5E9', color: '#2E7D32', icon: 'checkmark-circle' as const };
            case 'pending':
                return { bg: '#FFF3E0', color: '#E65100', icon: 'time' as const };
            default:
                return { bg: '#F5F5F5', color: '#757575', icon: 'ellipse' as const };
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const AVATAR_COLORS = ['#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#8B5CF6', '#EF4444'];
    const getAvatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

    // ─── Grading Form ───
    if (selectedStudent) {
        const statusInfo = getStatusStyle(selectedStudent.status);
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#4338CA" />

                {/* Header */}
                <View style={styles.gradientHeader}>
                    <TouchableOpacity onPress={clearSelection} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>Grade Student</Text>
                    <View style={{ width: 32 }} />
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                >
                    <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">

                        {/* Student Info Card */}
                        <View style={styles.studentInfoCard}>
                            <View style={[styles.avatarLarge, { backgroundColor: getAvatarColor(selectedStudent.studentId) }]}>
                                <Text style={styles.avatarLargeText}>{getInitials(selectedStudent.studentName)}</Text>
                            </View>
                            <Text style={styles.studentInfoName}>{selectedStudent.studentName}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                                <Ionicons name={statusInfo.icon} size={14} color={statusInfo.color} />
                                <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                                    {selectedStudent.status.toUpperCase()}
                                </Text>
                            </View>
                            <Text style={styles.submittedDate}>
                                Submitted: {formatDate(selectedStudent.submittedAt)}
                            </Text>
                        </View>

                        {/* Mark Input */}
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>
                                Mark <Text style={styles.required}>*</Text>
                            </Text>
                            <Text style={styles.formHint}>Enter a score between 0 and 100</Text>
                            <View style={styles.markInputRow}>
                                <TextInput
                                    style={styles.markInput}
                                    value={mark}
                                    onChangeText={setMark}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    maxLength={3}
                                    editable={!submitting}
                                />
                                <Text style={styles.markSuffix}>/ 100</Text>
                            </View>
                            {/* Quick mark buttons */}
                            <View style={styles.quickMarks}>
                                {[25, 50, 75, 100].map(v => (
                                    <TouchableOpacity
                                        key={v}
                                        style={[styles.quickMarkBtn, mark === String(v) && styles.quickMarkBtnActive]}
                                        onPress={() => setMark(String(v))}
                                        disabled={submitting}
                                    >
                                        <Text style={[styles.quickMarkText, mark === String(v) && styles.quickMarkTextActive]}>
                                            {v}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Comment Input */}
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Comment</Text>
                            <Text style={styles.formHint}>Provide feedback for the student</Text>
                            <TextInput
                                style={styles.commentInput}
                                value={comment}
                                onChangeText={setComment}
                                placeholder="Write your feedback here..."
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                editable={!submitting}
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitButton, submitting && { opacity: 0.6 }]}
                            onPress={handleSubmitGrade}
                            disabled={submitting}
                            activeOpacity={0.8}
                        >
                            {submitting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                            )}
                            <Text style={styles.submitButtonText}>
                                {submitting ? 'Submitting...' : 'Submit Grade'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }

    // ─── Submissions List ───
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4338CA" />

            {/* Header */}
            <View style={styles.gradientHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle} numberOfLines={1}>Grading</Text>
                    {lessonTitle && (
                        <Text style={styles.headerSubtitle} numberOfLines={1}>{lessonTitle}</Text>
                    )}
                </View>
                <View style={{ width: 32 }} />
            </View>

            {/* Summary Bar */}
            {!loading && !error && submissions.length > 0 && (
                <View style={styles.summaryBar}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{submissions.length}</Text>
                        <Text style={styles.summaryLabel}>Total</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: '#2E7D32' }]}>
                            {submissions.filter(s => s.status.toLowerCase() === 'graded').length}
                        </Text>
                        <Text style={styles.summaryLabel}>Graded</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: '#E65100' }]}>
                            {submissions.filter(s => s.status.toLowerCase() === 'pending').length}
                        </Text>
                        <Text style={styles.summaryLabel}>Pending</Text>
                    </View>
                </View>
            )}

            {/* Loading */}
            {loading && (
                <View style={styles.centeredState}>
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text style={styles.stateText}>Loading submissions...</Text>
                </View>
            )}

            {/* Error */}
            {!loading && error && (
                <View style={styles.centeredState}>
                    <Ionicons name="warning-outline" size={48} color="#FF9800" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchSubmissions}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Empty */}
            {!loading && !error && submissions.length === 0 && (
                <View style={styles.centeredState}>
                    <Ionicons name="document-text-outline" size={56} color="#C5CAE9" />
                    <Text style={styles.emptyTitle}>No Submissions Yet</Text>
                    <Text style={styles.emptySubtext}>
                        Student submissions will appear here once they are submitted.
                    </Text>
                </View>
            )}

            {/* Submissions List */}
            {!loading && !error && submissions.length > 0 && (
                <FlatList
                    data={submissions}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const statusInfo = getStatusStyle(item.status);
                        return (
                            <TouchableOpacity
                                style={styles.submissionCard}
                                onPress={() => selectStudent(item)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.studentId) }]}>
                                    <Text style={styles.avatarText}>{getInitials(item.studentName)}</Text>
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.studentName}>{item.studentName}</Text>
                                    <Text style={styles.submittedText}>
                                        {formatDate(item.submittedAt)}
                                    </Text>
                                </View>
                                <View style={styles.cardRight}>
                                    <View style={[styles.statusBadgeSmall, { backgroundColor: statusInfo.bg }]}>
                                        <Text style={[styles.statusBadgeSmallText, { color: statusInfo.color }]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                    {item.mark !== null && (
                                        <Text style={styles.markPreview}>{item.mark}/100</Text>
                                    )}
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#C5CAE9" />
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F8',
    },
    // ─── Header ───
    gradientHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 56 : 40,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#4338CA',
    },
    backButton: {
        padding: 4,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 12,
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
    },
    // ─── Summary Bar ───
    summaryBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 16,
        elevation: 3,
        shadowColor: '#4338CA',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333',
    },
    summaryLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    summaryDivider: {
        width: 1,
        backgroundColor: '#E8EAF6',
    },
    // ─── List ───
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    submissionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    cardContent: {
        flex: 1,
    },
    studentName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#212121',
    },
    submittedText: {
        fontSize: 12,
        color: '#888',
        marginTop: 3,
    },
    cardRight: {
        alignItems: 'flex-end',
        marginRight: 8,
    },
    statusBadgeSmall: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
    },
    statusBadgeSmallText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    markPreview: {
        fontSize: 13,
        fontWeight: '700',
        color: '#4338CA',
        marginTop: 4,
    },
    // ─── Grading Form ───
    formScroll: {
        padding: 20,
        paddingBottom: 40,
    },
    studentInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#4338CA',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    avatarLarge: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarLargeText: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '800',
    },
    studentInfoName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#212121',
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 5,
        marginBottom: 6,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    submittedDate: {
        fontSize: 13,
        color: '#888',
    },
    formGroup: {
        marginBottom: 22,
    },
    formLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    formHint: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10,
    },
    required: {
        color: '#EF4444',
    },
    markInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E8EAF6',
        paddingHorizontal: 16,
        elevation: 1,
    },
    markInput: {
        flex: 1,
        fontSize: 28,
        fontWeight: '800',
        color: '#4338CA',
        paddingVertical: 14,
    },
    markSuffix: {
        fontSize: 18,
        fontWeight: '600',
        color: '#999',
    },
    quickMarks: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    quickMarkBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E8EAF6',
    },
    quickMarkBtnActive: {
        backgroundColor: '#4338CA',
        borderColor: '#4338CA',
    },
    quickMarkText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#666',
    },
    quickMarkTextActive: {
        color: '#fff',
    },
    commentInput: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E8EAF6',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#333',
        minHeight: 120,
        elevation: 1,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4338CA',
        paddingVertical: 16,
        borderRadius: 14,
        gap: 10,
        elevation: 4,
        shadowColor: '#4338CA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
    },
    // ─── States ───
    centeredState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    stateText: {
        marginTop: 12,
        fontSize: 14,
        color: '#999',
    },
    errorText: {
        fontSize: 14,
        color: '#E53935',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#4338CA',
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 24,
    },
    retryText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#555',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 6,
        lineHeight: 20,
    },
});
