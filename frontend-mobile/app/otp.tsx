import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

export default function OTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [secondsRemaining, setSecondsRemaining] = useState(263);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isComplete = otp.every((digit) => digit !== '');

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) {
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (isComplete) {
      router.push('/success');
    }
  };

  const minutes = String(Math.floor(secondsRemaining / 60)).padStart(2, '0');
  const seconds = String(secondsRemaining % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        Please enter the 4 digit code sent to your phone number to continue.
      </Text>

      <View style={styles.codeRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputsRef.current[index] = ref; }}
            style={styles.codeBox}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            placeholder="•"
            placeholderTextColor="#CBD5E1"
          />
        ))}
      </View>

      <Pressable
        style={[styles.primaryButton, !isComplete && styles.primaryButtonDisabled]}
        onPress={handleSubmit}
        disabled={!isComplete}
      >
        <Text style={[styles.primaryText, !isComplete && styles.primaryTextDisabled]}>Submit</Text>
      </Pressable>

      <Text style={styles.footerText}>Resend in {minutes}:{seconds}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: '#F8F9FF',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
    marginBottom: 36,
    lineHeight: 24,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    color: '#101828',
  },
  primaryButton: {
    backgroundColor: '#5D5FEF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  primaryTextDisabled: {
    color: '#F8FAFC',
  },
  footerText: {
    color: '#64748B',
    textAlign: 'center',
    fontSize: 14,
  },
});
