import React, { useState, useEffect } from 'react';
import * as Network from 'expo-network';
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
    ActivityIndicator,
} from 'react-native';

const AddNewItemScreen = ({ navigation }: { navigation: any }) => {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // useEffect(() => {
    //     Network.getIpAddressAsync().then(ip => {
    //         if (ip !== null) setDeviceIp(ip);
    //         console.log('deviceIp', deviceIp);
    //     });
    // }, []);

    const isSaveDisabled = itemName.trim() === '' || submitting;

    const handleSave = async () => {
        if (isSaveDisabled) return;

        try {
            setSubmitting(true);
            const response = await fetch(`http://10.0.2.2:8080/api/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: itemName.trim(),
                    description: description.trim(),
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || `Server error: ${response.status}`);
            }

            Alert.alert('Success', 'Course created successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('my-courses') },
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.message ?? 'Failed to create course. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} disabled={submitting}>
                        <Text style={[styles.cancelText, submitting && styles.disabledText]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add new course</Text>
                    <TouchableOpacity onPress={handleSave} disabled={isSaveDisabled}>
                        {submitting ? (
                            <ActivityIndicator size="small" color="#6366F1" />
                        ) : (
                            <Text style={[styles.saveText, isSaveDisabled && styles.disabledText]}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Body */}
                <ScrollView
                    contentContainerStyle={styles.formContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Course Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Course name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter course name..."
                            value={itemName}
                            onChangeText={setItemName}
                            autoFocus={true}
                            editable={!submitting}
                        />
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
                </ScrollView>
            </KeyboardAvoidingView>
        </KeyboardAvoidingView>
    );
};

// Khai báo StyleSheet
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    cancelText: {
        fontSize: 16,
        color: '#666666',
    },
    saveText: {
        fontSize: 16,
        color: '#6366F1',
        fontWeight: '600',
    },
    disabledText: {
        opacity: 0.4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    formContainer: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    required: {
        color: '#E53935',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#333333',
        backgroundColor: '#FAFAFA',
    },
    textArea: {
        height: 100,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        backgroundColor: '#FFFFFF',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#A0CFFF',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddNewItemScreen;

