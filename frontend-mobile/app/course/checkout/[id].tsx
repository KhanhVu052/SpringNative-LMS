import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCourseContext } from '../../context/CourseContext';

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getCourseById } = useCourseContext();
  const course = getCourseById(id as string) || { title: 'Ready for class XIII', author: 'By Ranbir Kumar', price: '$7.00' };
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handlePayment = () => {
    router.push(`/course/success/paid?id=${id}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <FontAwesome name="angle-left" size={24} color="#101828" />
        </Pressable>
        <Text style={styles.headerTitle}>Secure Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Order Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.cardBox}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseAuthor}>{course.author}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Course Price</Text>
            <Text style={styles.rowValue}>{course.price}</Text>
          </View>
          <View style={[styles.row, { marginBottom: 16 }]}>
            <Text style={styles.rowLabel}>Tax (10%)</Text>
            <Text style={styles.rowValue}>$0.70</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$7.70</Text>
          </View>
        </View>

        {/* Select Payment Method */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <View style={styles.paymentMethodsRow}>
          <Pressable 
            style={[styles.paymentMethodBtn, paymentMethod === 'credit_card' && styles.paymentMethodActive]}
            onPress={() => setPaymentMethod('credit_card')}
          >
            <View style={[styles.paymentIconCircle, paymentMethod === 'credit_card' ? { backgroundColor: '#3B82F6' } : { backgroundColor: '#A855F7' }]}>
              <FontAwesome name="credit-card" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.paymentMethodText}>Credit Card</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.paymentMethodBtn, paymentMethod === 'ewallet' && styles.paymentMethodActive]}
            onPress={() => setPaymentMethod('ewallet')}
          >
            <View style={[styles.paymentIconCircle, paymentMethod === 'ewallet' ? { backgroundColor: '#3B82F6' } : { backgroundColor: '#A855F7' }]}>
              <FontAwesome name="google-wallet" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.paymentMethodText}>E-Wallet</Text>
          </Pressable>
        </View>

        {/* Card Information */}
        <Text style={styles.sectionTitle}>Card Information</Text>
        
        {/* Credit Card Mock */}
        <View style={styles.creditCardMock}>
          <View style={styles.cardTopRow}>
            <FontAwesome name="credit-card-alt" size={24} color="#FFFFFF" />
            <View style={styles.visaBadge}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
          </View>
          <Text style={styles.cardNumberMock}>**** **** **** ****</Text>
          <View style={styles.cardBottomRow}>
            <View>
              <Text style={styles.cardLabel}>Card Holder</Text>
              <Text style={styles.cardValue}>YOUR NAME</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>Expires</Text>
              <Text style={styles.cardValue}>MM/YY</Text>
            </View>
          </View>
        </View>

        {/* Inputs */}
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput 
          style={styles.input} 
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
        />

        <Text style={styles.inputLabel}>Card Holder Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="John Smith"
          placeholderTextColor="#94A3B8"
        />

        <View style={styles.rowInputs}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <TextInput 
              style={styles.input} 
              placeholder="MM/YY"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={{ width: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput 
              style={styles.input} 
              placeholder="123"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.secureFooter}>
          <FontAwesome name="shield" size={16} color="#10B981" />
          <Text style={styles.secureText}>Secure payment powered by Stripe</Text>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.confirmBtn} onPress={handlePayment}>
          <Text style={styles.confirmBtnText}>Confirm Payment  {course.price}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 16,
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 4,
  },
  courseAuthor: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  rowValue: {
    fontSize: 14,
    color: '#475467',
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5D5FEF',
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  paymentMethodBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentMethodActive: {
    borderColor: '#5D5FEF',
    backgroundColor: '#F8F9FF',
  },
  paymentIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
  },
  creditCardMock: {
    backgroundColor: '#6D28D9',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  visaBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  cardNumberMock: {
    color: '#FFFFFF',
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 32,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: '#C4B5FD',
    fontSize: 10,
    marginBottom: 4,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475467',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
    color: '#101828',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  secureFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  secureText: {
    color: '#64748B',
    fontSize: 13,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  confirmBtn: {
    backgroundColor: '#5D5FEF',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
