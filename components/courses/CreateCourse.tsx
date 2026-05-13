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
    Alert
} from 'react-native';

const AddNewItemScreen = ({ navigation }: { navigation: any }) => {
    // Quản lý state cho các trường nhập liệu
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');

    // Kiểm tra điều kiện disable nút Lưu
    const isSaveDisabled = itemName.trim() === '';

    const handleSave = () => {
        if (isSaveDisabled) return;

        // Xử lý logic gọi API gửi dữ liệu về backend (ví dụ: Spring Boot) ở đây
        Alert.alert('Thành công', `Đã thêm: ${itemName}`);

        // navigation.goBack(); // Quay lại màn hình trước đó
    };

    return (
        <KeyboardAvoidingView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                {/* Phần Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {/* navigation.goBack() */ }}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add new course</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={isSaveDisabled}>
                        <Text style={styles.cancelText}>Save</Text>
                    </TouchableOpacity>
                </View>

                {/* Phần Body: ScrollView giúp cuộn khi nhập liệu nhiều */}
                <ScrollView
                    contentContainerStyle={styles.formContainer}
                    keyboardShouldPersistTaps="handled" // Cho phép bấm ra ngoài để ẩn bàn phím
                >
                    {/* Trường nhập Tên mục */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Course name<Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter course name..."
                            value={itemName}
                            onChangeText={setItemName}
                            autoFocus={true} // Tự động mở bàn phím khi vào màn hình
                        />
                    </View>

                    {/* Trường nhập Mô tả */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter description..."
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top" // Đẩy text lên top trên Android
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

