import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert
} from 'react-native';

const EditItemScreen = ({ route, navigation }: { route: any, navigation: any }) => {
    // Lấy dữ liệu item được truyền từ màn hình trước đó
    const { currentItem } = route.params || {};

    // Khởi tạo state với dữ liệu có sẵn
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');

    // Đổ dữ liệu vào form khi Component mount
    useEffect(() => {
        if (currentItem) {
            setItemName(currentItem.name || '');
            setDescription(currentItem.description || '');
        }
    }, [currentItem]);

    // Điều kiện để vô hiệu hóa nút Cập nhật
    const isSaveDisabled = itemName.trim() === '';

    // Hàm xử lý Cập nhật
    const handleUpdate = () => {
        if (isSaveDisabled) return;

        // Gọi API PUT/PATCH để cập nhật dữ liệu về backend
        console.log('Dữ liệu cập nhật:', { id: currentItem.id, itemName, description });
        Alert.alert('Thành công', 'Thông tin đã được cập nhật.');
        // navigation.goBack();
    };

    // Hàm xử lý Xóa với hộp thoại xác nhận (Confirmation Dialog)
    const handleDelete = () => {
        Alert.alert(
            'Xóa mục này?',
            'Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác.',
            [
                {
                    text: 'Hủy',
                    style: 'cancel', // Nút Hủy (màu mặc định)
                },
                {
                    text: 'Xóa',
                    style: 'destructive', // Nút Xóa (iOS sẽ tự động tô màu đỏ)
                    onPress: () => {
                        // Gọi API DELETE để xóa dữ liệu trên backend
                        console.log('Đã xóa item có ID:', currentItem.id);
                        Alert.alert('Đã xóa', 'Mục này đã được xóa thành công.');
                        // navigation.goBack();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {/* navigation.goBack() */ }}>
                        <Text style={styles.backText}>Trở về</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sửa thông tin</Text>
                    <View style={{ width: 50 }} /> {/* Spacer */}
                </View>

                {/* Body Form */}
                <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên mục <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tên..."
                            value={itemName}
                            onChangeText={setItemName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mô tả</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Nhập mô tả..."
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </ScrollView>

                {/* Footer: Chứa nút Cập nhật và nút Xóa */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.updateButton, isSaveDisabled && styles.disabledButton]}
                        onPress={handleUpdate}
                        disabled={isSaveDisabled}
                    >
                        <Text style={styles.updateButtonText}>Cập nhật thông tin</Text>
                    </TouchableOpacity>

                    {/* Nút Xóa được thiết kế riêng biệt để tránh bấm nhầm */}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Text style={styles.deleteButtonText}>Xóa mục này</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
        marginBottom: 12, // Tạo khoảng cách với nút Xóa
    },
    disabledButton: { backgroundColor: '#A0CFFF' },
    updateButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

    // Style riêng cho nút Xóa
    deleteButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FF3B30', // Màu đỏ cảnh báo
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
});

export default EditItemScreen;

