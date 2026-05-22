import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
} from 'react-native';

const BASE_URL = 'http://10.0.2.2:8080';

const EditDeletePath = ({ route, navigation }: { route: any; navigation: any }) => {
    const { courseId, pathId, currentPath } = route.params || {};

    const [level, setLevel] = useState('');
    const [description, setDescription] = useState('');
    const [overview, setOverview] = useState('');
    const [points, setPoints] = useState('');
    const [durationWeeks, setDurationWeeks] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (currentPath) {
            setLevel(currentPath.level || '');
            setDescription(currentPath.description || '');
            setOverview(currentPath.overview || '');
            setPoints(String(currentPath.points ?? ''));
            setDurationWeeks(String(currentPath.durationWeeks ?? ''));
        }
    }, [currentPath]);

    const isSaveDisabled = level.trim() === '' || submitting;

    const handleUpdate = async () => {
        if (isSaveDisabled) return;
        try {
            setSubmitting(true);
            const response = await fetch(
                `${BASE_URL}/api/courses/${courseId}/paths/${pathId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        level: level.trim(),
                        description: description.trim(),
                        overview: overview.trim(),
                        points: points ? parseInt(points, 10) : 0,
                        durationWeeks: durationWeeks ? parseInt(durationWeeks, 10) : 0,
                    }),
                }
            );
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || `Server error: ${response.status}`);
            }
            Alert.alert('Success', 'Learning path updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Failed to update. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete this learning path?',
            'Are you sure you want to delete? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setSubmitting(true);
                            const response = await fetch(
                                `${BASE_URL}/api/courses/${courseId}/paths/${pathId}`,
                                { method: 'DELETE' }
                            );
                            if (!response.ok) {
                                const errText = await response.text();
                                throw new Error(errText || `Server error: ${response.status}`);
                            }
                            Alert.alert('Deleted', 'Learning path deleted successfully.', [
                                { text: 'OK', onPress: () => navigation.goBack() },
                            ]);
                        } catch (err: any) {
                            Alert.alert('Error', err.message ?? 'Failed to delete. Please try again.');
                        } finally {
                            setSubmitting(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} disabled={submitting}>
                        <Text style={[styles.backText, submitting && { opacity: 0.4 }]}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Learning Path</Text>
                    <View style={{ width: 50 }} />
                </View>

                {/* Body Form */}
                <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Level <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Beginner, Intermediate, Advanced"
                            value={level}
                            onChangeText={setLevel}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Overview</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter overview..."
                            value={overview}
                            onChangeText={setOverview}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter description..."
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.rowGroup}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Points</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                value={points}
                                onChangeText={setPoints}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Duration (weeks)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                value={durationWeeks}
                                onChangeText={setDurationWeeks}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.updateButton, isSaveDisabled && styles.disabledButton]}
                        onPress={handleUpdate}
                        disabled={isSaveDisabled}
                    >
                        <Text style={styles.updateButtonText}>
                            {submitting ? 'Updating...' : 'Update Learning Path'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.deleteButton, submitting && { opacity: 0.4 }]}
                        onPress={handleDelete}
                        disabled={submitting}
                    >
                        <Text style={styles.deleteButtonText}>Delete This Path</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 20 },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    backText: { fontSize: 16, color: '#007AFF' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333333' },
    formContainer: { padding: 16 },
    inputGroup: { marginBottom: 20 },
    rowGroup: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    halfInput: {
        flex: 1,
    },
    label: { fontSize: 14, fontWeight: '600', color: '#333333', marginBottom: 8 },
    required: { color: '#E53935' },
    input: {
        borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 8,
        paddingHorizontal: 12, paddingVertical: 10, fontSize: 16,
        color: '#333333', backgroundColor: '#FAFAFA',
    },
    textArea: { height: 100 },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        backgroundColor: '#FFFFFF',
    },
    updateButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    disabledButton: { backgroundColor: '#A0CFFF' },
    updateButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    deleteButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FF3B30',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
});

export default EditDeletePath;
