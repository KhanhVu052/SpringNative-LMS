import React, { useState } from 'react';
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
import { useUser } from '../../context/UserContext';

const BASE_URL = 'http://10.0.2.2:8080';

const CONTENT_TYPES = ['VIDEO', 'DOCUMENT', 'QUIZ', 'ARTICLE', 'EXERCISE'];

const CreateLesson = ({ route, navigation }: { route: any; navigation: any }) => {
    const { courseId, pathId } = route.params || {};
    const { token } = useUser();

    const [title, setTitle] = useState('');
    const [type, setType] = useState('VIDEO');
    const [description, setDescription] = useState('');
    const [contentUrl, setContentUrl] = useState('');
    const [points, setPoints] = useState('');
    const [orderIndex, setOrderIndex] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isSaveDisabled = title.trim() === '' || submitting;

    const handleCreate = async () => {
        if (isSaveDisabled || !token) return;
        try {
            setSubmitting(true);
            const response = await fetch(
                `${BASE_URL}/api/courses/${courseId}/paths/${pathId}/contents`,
                {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: title.trim(),
                        type: type,
                        description: description.trim(),
                        contentUrl: contentUrl.trim(),
                        points: points ? parseInt(points, 10) : 0,
                        orderIndex: orderIndex ? parseInt(orderIndex, 10) : 0,
                    }),
                }
            );
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || `Server error: ${response.status}`);
            }
            Alert.alert('Success', 'Learning content created successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Failed to create learning content.');
        } finally {
            setSubmitting(false);
        }
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
                    <Text style={styles.headerTitle}>Create Lesson</Text>
                    <View style={{ width: 50 }} />
                </View>

                {/* Form */}
                <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
                    {/* Title */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Title <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter lesson title..."
                            value={title}
                            onChangeText={setTitle}
                            editable={!submitting}
                        />
                    </View>

                    {/* Content Type */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Content Type</Text>
                        <View style={styles.typeContainer}>
                            {CONTENT_TYPES.map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={[
                                        styles.typeChip,
                                        type === t && styles.typeChipSelected,
                                    ]}
                                    onPress={() => setType(t)}
                                    disabled={submitting}
                                >
                                    <Text
                                        style={[
                                            styles.typeChipText,
                                            type === t && styles.typeChipTextSelected,
                                        ]}
                                    >
                                        {t}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Description */}
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
                            editable={!submitting}
                        />
                    </View>

                    {/* Content URL */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Content URL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://example.com/video"
                            value={contentUrl}
                            onChangeText={setContentUrl}
                            autoCapitalize="none"
                            keyboardType="url"
                            editable={!submitting}
                        />
                    </View>

                    {/* Points & Order Index */}
                    <View style={styles.rowGroup}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Points</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                value={points}
                                onChangeText={setPoints}
                                keyboardType="numeric"
                                editable={!submitting}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Order Index</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                value={orderIndex}
                                onChangeText={setOrderIndex}
                                keyboardType="numeric"
                                editable={!submitting}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.createButton, isSaveDisabled && styles.disabledButton]}
                        onPress={handleCreate}
                        disabled={isSaveDisabled}
                    >
                        <Text style={styles.createButtonText}>
                            {submitting ? 'Creating...' : 'Create Lesson'}
                        </Text>
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
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    typeChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
    },
    typeChipTextSelected: {
        color: '#FFFFFF',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        backgroundColor: '#FFFFFF',
    },
    createButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: { backgroundColor: '#A0CFFF' },
    createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default CreateLesson;
