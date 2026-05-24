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
    Alert
} from 'react-native';
import { useUser } from '../../context/UserContext';

const EditItemScreen = ({ route, navigation }: { route: any, navigation: any }) => {
    // Get the item data passed from the previous screen
    const { currentItem } = route.params || {};
    const { token } = useUser();

    // Initialize state with existing data
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Populate form fields when the component mounts
    useEffect(() => {
        if (currentItem) {
            setItemName(currentItem.name || '');
            setDescription(currentItem.description || '');
        }
    }, [currentItem]);

    // Condition to disable the Update button
    const isSaveDisabled = itemName.trim() === '' || submitting;

    // Handler for Update action
    const handleUpdate = async () => {
        if (isSaveDisabled || !token) return;
        try {
            setSubmitting(true);
            const response = await fetch(
                `http://10.0.2.2:8080/api/courses/${currentItem.id}`,
                {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: itemName.trim(),
                        description: description.trim(),
                    }),
                }
            );
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || `Server error: ${response.status}`);
            }
            Alert.alert('Success', 'Course updated successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('my-courses') },
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Failed to update course. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Handler for Delete action with a confirmation dialog
    const handleDelete = () => {
        Alert.alert(
            'Delete this course?',
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
                                `http://10.0.2.2:8080/api/courses/${currentItem.id}`,
                                { 
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                }
                            );
                            if (!response.ok) {
                                const errText = await response.text();
                                throw new Error(errText || `Server error: ${response.status}`);
                            }
                            Alert.alert('Deleted', 'Course deleted successfully.', [
                                { text: 'OK', onPress: () => navigation.navigate('my-courses') },
                            ]);
                        } catch (err: any) {
                            Alert.alert('Error', err.message ?? 'Failed to delete course. Please try again.');
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
                    <Text style={styles.headerTitle}>Edit Information</Text>
                    <View style={{ width: 50 }} />
                </View>

                {/* Body Form */}
                <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Item Name <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter name..."
                            value={itemName}
                            onChangeText={setItemName}
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
                </ScrollView>

                {/* Footer: Contains the Update and Delete buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.updateButton, isSaveDisabled && styles.disabledButton]}
                        onPress={handleUpdate}
                        disabled={isSaveDisabled}
                    >
                        <Text style={styles.updateButtonText}>
                            {submitting ? 'Updating...' : 'Update Information'}
                        </Text>
                    </TouchableOpacity>

                    {/* Delete button is styled separately to avoid accidental taps */}
                    <TouchableOpacity
                        style={[styles.deleteButton, submitting && { opacity: 0.4 }]}
                        onPress={handleDelete}
                        disabled={submitting}
                    >
                        <Text style={styles.deleteButtonText}>Delete This Course</Text>
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
        marginBottom: 12, // Add spacing above the Delete button
    },
    disabledButton: { backgroundColor: '#A0CFFF' },
    updateButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

    // Dedicated style for the Delete button
    deleteButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FF3B30', // Warning red color
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
});

export default EditItemScreen;
