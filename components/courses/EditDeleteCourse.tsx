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

const EditItemScreen = ({ route, navigation }: { route: any, navigation: any }) => {
    // Get the item data passed from the previous screen
    const { currentItem } = route.params || {};

    // Initialize state with existing data
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');

    // Populate form fields when the component mounts
    useEffect(() => {
        if (currentItem) {
            setItemName(currentItem.name || '');
            setDescription(currentItem.description || '');
        }
    }, [currentItem]);

    // Condition to disable the Update button
    const isSaveDisabled = itemName.trim() === '';

    // Handler for Update action
    const handleUpdate = () => {
        if (isSaveDisabled) return;

        // Call PUT/PATCH API to update data on the backend
        console.log('Updated data:', { id: currentItem.id, itemName, description });
        Alert.alert('Success', 'Information has been updated.');
        // navigation.goBack();
    };

    // Handler for Delete action with a confirmation dialog
    const handleDelete = () => {
        Alert.alert(
            'Delete this item?',
            'Are you sure you want to delete? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel', // Cancel button (default color)
                },
                {
                    text: 'Delete',
                    style: 'destructive', // Delete button (iOS will automatically color it red)
                    onPress: () => {
                        // Call DELETE API to remove data from the backend
                        console.log('Deleted item with ID:', currentItem.id);
                        Alert.alert('Deleted', 'This item has been deleted successfully.');
                        // navigation.goBack();
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
                    <TouchableOpacity onPress={() => {/* navigation.goBack() */ }}>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Information</Text>
                    <View style={{ width: 50 }} /> {/* Spacer */}
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
                        <Text style={styles.updateButtonText}>Update Information</Text>
                    </TouchableOpacity>

                    {/* Delete button is styled separately to avoid accidental taps */}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Text style={styles.deleteButtonText}>Delete This Item</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
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
