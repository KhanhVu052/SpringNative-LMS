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
    Linking,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';

const BASE_URL = 'http://10.0.2.2:8080';

type LessonData = {
    id: number;
    title: string;
    type: string;
    description: string;
    contentUrl: string;
    points: number;
    orderIndex: number;
};

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
    video: { icon: 'videocam', color: '#E53935', bg: '#FFEBEE' },
    article: { icon: 'document-text', color: '#1E88E5', bg: '#E3F2FD' },
    quiz: { icon: 'help-circle', color: '#FB8C00', bg: '#FFF3E0' },
    assignment: { icon: 'clipboard', color: '#43A047', bg: '#E8F5E9' },
    document: { icon: 'document-text', color: '#1E88E5', bg: '#E3F2FD' },
    exercise: { icon: 'barbell', color: '#7B1FA2', bg: '#F3E5F5' },
};

const CONTENT_TYPES = ['VIDEO', 'DOCUMENT', 'QUIZ', 'ARTICLE', 'EXERCISE'];

export default function LessonDetail({ route, navigation }: { route: any; navigation: any }) {
    const { courseId, pathId, contentId } = route.params || {};
    const { token } = useUser();

    const [lesson, setLesson] = useState<LessonData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Edit mode state
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editType, setEditType] = useState('VIDEO');
    const [editDescription, setEditDescription] = useState('');
    const [editContentUrl, setEditContentUrl] = useState('');
    const [editPoints, setEditPoints] = useState('');
    const [editOrderIndex, setEditOrderIndex] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchLesson = async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(
                `${BASE_URL}/api/courses/${courseId}/paths/${pathId}/contents`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const list = await res.json();
            const data = list.find((item: any) => String(item.id) === String(contentId));
            if (!data) {
                throw new Error('Lesson not found on this learning path.');
            }
            const mapped: LessonData = {
                id: data.id ?? 0,
                title: data.title || 'Untitled',
                type: data.type || 'article',
                description: data.description || '',
                contentUrl: data.contentUrl || '',
                points: data.points ?? 0,
                orderIndex: data.orderIndex ?? 0,
            };
            setLesson(mapped);
        } catch (err: any) {
            setError(err.message ?? 'Failed to load lesson details');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (courseId && pathId && contentId && token) {
                fetchLesson();
                setEditing(false);
            }
        }, [courseId, pathId, contentId, token])
    );

    const getTypeConfig = (type: string) => {
        return TYPE_CONFIG[type.toLowerCase()] ?? { icon: 'document-outline', color: '#757575', bg: '#F5F5F5' };
    };

    const startEditing = () => {
        if (!lesson) return;
        setEditTitle(lesson.title);
        setEditType(lesson.type.toUpperCase());
        setEditDescription(lesson.description);
        setEditContentUrl(lesson.contentUrl);
        setEditPoints(String(lesson.points));
        setEditOrderIndex(String(lesson.orderIndex));
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
    };

    const handleUpdate = async () => {
        if (editTitle.trim() === '') {
            Alert.alert('Validation', 'Title is required.');
            return;
        }
        if (!token) return;
        try {
            setSaving(true);
            const res = await fetch(
                `${BASE_URL}/api/courses/${courseId}/paths/${pathId}/contents/${contentId}`,
                {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: editTitle.trim(),
                        type: editType,
                        description: editDescription.trim(),
                        contentUrl: editContentUrl.trim(),
                        points: editPoints ? parseInt(editPoints, 10) : 0,
                        orderIndex: editOrderIndex ? parseInt(editOrderIndex, 10) : 0,
                    }),
                }
            );
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || `Server error: ${res.status}`);
            }
            Alert.alert('Success', 'Lesson updated successfully!');
            setEditing(false);
            fetchLesson();
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Failed to update lesson.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Lesson',
            'Are you sure? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setDeleting(true);
                            const res = await fetch(
                                `${BASE_URL}/api/courses/${courseId}/paths/${pathId}/contents/${contentId}`,
                                { 
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                }
                            );
                            if (!res.ok) {
                                const errText = await res.text();
                                throw new Error(errText || `Server error: ${res.status}`);
                            }
                            Alert.alert('Deleted', 'Lesson deleted successfully.', [
                                { text: 'OK', onPress: () => navigation.goBack() },
                            ]);
                        } catch (err: any) {
                            Alert.alert('Error', err.message ?? 'Failed to delete lesson.');
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    const openUrl = (url: string) => {
        if (!url) return;
        Linking.openURL(url).catch(() => {
            Alert.alert('Error', 'Unable to open this URL.');
        });
    };

    // ─── Edit Mode ───
    if (editing && lesson) {
        const isSaveDisabled = editTitle.trim() === '' || saving;
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={cancelEditing} style={styles.backButton}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        Edit Lesson
                    </Text>
                    <TouchableOpacity
                        onPress={handleUpdate}
                        disabled={isSaveDisabled}
                        style={{ opacity: isSaveDisabled ? 0.4 : 1 }}
                    >
                        <Text style={styles.saveHeaderText}>
                            {saving ? 'Saving...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                >
                    <ScrollView contentContainerStyle={styles.editForm} keyboardShouldPersistTaps="handled">
                        {/* Title */}
                        <View style={styles.editGroup}>
                            <Text style={styles.editLabel}>Title <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.editInput}
                                value={editTitle}
                                onChangeText={setEditTitle}
                                placeholder="Lesson title..."
                                editable={!saving}
                            />
                        </View>

                        {/* Content Type */}
                        <View style={styles.editGroup}>
                            <Text style={styles.editLabel}>Content Type</Text>
                            <View style={styles.typeContainer}>
                                {CONTENT_TYPES.map((t) => (
                                    <TouchableOpacity
                                        key={t}
                                        style={[
                                            styles.typeChip,
                                            editType === t && styles.typeChipSelected,
                                        ]}
                                        onPress={() => setEditType(t)}
                                        disabled={saving}
                                    >
                                        <Text
                                            style={[
                                                styles.typeChipText,
                                                editType === t && styles.typeChipTextSelected,
                                            ]}
                                        >
                                            {t}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Description */}
                        <View style={styles.editGroup}>
                            <Text style={styles.editLabel}>Description</Text>
                            <TextInput
                                style={[styles.editInput, styles.editTextArea]}
                                value={editDescription}
                                onChangeText={setEditDescription}
                                placeholder="Enter description..."
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                editable={!saving}
                            />
                        </View>

                        {/* Content URL */}
                        <View style={styles.editGroup}>
                            <Text style={styles.editLabel}>Content URL</Text>
                            <TextInput
                                style={styles.editInput}
                                value={editContentUrl}
                                onChangeText={setEditContentUrl}
                                placeholder="https://example.com/video"
                                autoCapitalize="none"
                                keyboardType="url"
                                editable={!saving}
                            />
                        </View>

                        {/* Points & Order */}
                        <View style={styles.editRow}>
                            <View style={styles.editHalf}>
                                <Text style={styles.editLabel}>Points</Text>
                                <TextInput
                                    style={styles.editInput}
                                    value={editPoints}
                                    onChangeText={setEditPoints}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    editable={!saving}
                                />
                            </View>
                            <View style={styles.editHalf}>
                                <Text style={styles.editLabel}>Order Index</Text>
                                <TextInput
                                    style={styles.editInput}
                                    value={editOrderIndex}
                                    onChangeText={setEditOrderIndex}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    editable={!saving}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }

    // ─── View Mode ───
    const typeConf = lesson ? getTypeConfig(lesson.type) : null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    Lesson Detail
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('my-courses')} style={styles.backButton}>
                    <Ionicons name="home" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Loading */}
            {loading && (
                <View style={styles.centeredState}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={styles.stateText}>Loading lesson...</Text>
                </View>
            )}

            {/* Error */}
            {!loading && error && (
                <View style={styles.centeredState}>
                    <Ionicons name="warning-outline" size={40} color="#FF9800" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchLesson}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Lesson Detail */}
            {!loading && !error && lesson && typeConf && (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Type Badge & Title */}
                    <View style={styles.heroSection}>
                        <View style={[styles.heroIcon, { backgroundColor: typeConf.bg }]}>
                            <Ionicons name={typeConf.icon as any} size={40} color={typeConf.color} />
                        </View>
                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                        <View style={[styles.typeBadge, { backgroundColor: typeConf.bg }]}>
                            <Text style={[styles.typeBadgeText, { color: typeConf.color }]}>
                                {lesson.type.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Ionicons name="star-outline" size={24} color="#FF9800" />
                            <Text style={styles.statValue}>{lesson.points}</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="list-outline" size={24} color="#2196F3" />
                            <Text style={styles.statValue}>{lesson.orderIndex}</Text>
                            <Text style={styles.statLabel}>Order</Text>
                        </View>
                    </View>

                    {/* Description */}
                    {!!lesson.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.sectionBody}>{lesson.description}</Text>
                        </View>
                    )}

                    {/* Content URL */}
                    {!!lesson.contentUrl && (
                        <TouchableOpacity
                            style={styles.urlCard}
                            activeOpacity={0.7}
                            onPress={() => openUrl(lesson.contentUrl)}
                        >
                            <View style={styles.urlIconWrap}>
                                <Ionicons name="link-outline" size={22} color="#1E88E5" />
                            </View>
                            <View style={styles.urlInfo}>
                                <Text style={styles.urlLabel}>Content Link</Text>
                                <Text style={styles.urlText} numberOfLines={1}>
                                    {lesson.contentUrl}
                                </Text>
                            </View>
                            <Ionicons name="open-outline" size={20} color="#1E88E5" />
                        </TouchableOpacity>
                    )}

                    {/* Grade Students Button */}
                    <TouchableOpacity
                        style={styles.gradeButton}
                        onPress={() => navigation.navigate('grading', {
                            courseId,
                            pathId,
                            contentId,
                            lessonTitle: lesson.title,
                        })}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="school-outline" size={20} color="#fff" />
                        <Text style={styles.gradeButtonText}>Grade Students</Text>
                    </TouchableOpacity>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.editActionButton}
                            onPress={startEditing}
                            disabled={deleting}
                        >
                            <Ionicons name="create-outline" size={20} color="#fff" />
                            <Text style={styles.editActionText}>Edit Lesson</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.deleteActionButton, deleting && { opacity: 0.4 }]}
                            onPress={handleDelete}
                            disabled={deleting}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                            <Text style={styles.deleteActionText}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {/* Empty State */}
            {!loading && !error && !lesson && (
                <View style={styles.centeredState}>
                    <Text style={styles.stateText}>No lesson details available.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 2,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 12,
    },
    saveHeaderText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2196F3',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    // ─── Hero ───
    heroSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    heroIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    lessonTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#212121',
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    typeBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
    },
    typeBadgeText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    // ─── Stats ───
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#212121',
        marginTop: 6,
    },
    statLabel: {
        fontSize: 12,
        color: '#757575',
        marginTop: 2,
    },
    // ─── Sections ───
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    sectionBody: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
    },
    // ─── URL Card ───
    urlCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    urlIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    urlInfo: {
        flex: 1,
    },
    urlLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    urlText: {
        fontSize: 13,
        color: '#1E88E5',
    },
    // ─── Grade Button ───
    gradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4338CA',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        marginBottom: 12,
    },
    gradeButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    // ─── Actions ───
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    editActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    editActionText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    deleteActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FF3B30',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 6,
    },
    deleteActionText: {
        color: '#FF3B30',
        fontSize: 15,
        fontWeight: '700',
    },
    // ─── States ───
    centeredState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    stateText: {
        marginTop: 12,
        fontSize: 14,
        color: '#999',
    },
    errorText: {
        fontSize: 14,
        color: '#e53935',
        textAlign: 'center',
        marginHorizontal: 32,
        marginTop: 12,
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    retryText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    // ─── Edit Mode ───
    editForm: {
        padding: 16,
        paddingBottom: 40,
    },
    editGroup: {
        marginBottom: 20,
    },
    editLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    required: {
        color: '#E53935',
    },
    editInput: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#333333',
        backgroundColor: '#FAFAFA',
    },
    editTextArea: {
        height: 100,
    },
    editRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    editHalf: {
        flex: 1,
    },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        backgroundColor: '#FAFAFA',
    },
    typeChipSelected: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    typeChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
    },
    typeChipTextSelected: {
        color: '#FFFFFF',
    },
});
