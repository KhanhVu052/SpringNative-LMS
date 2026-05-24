import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.checkmark}>
        <Text style={styles.checkIcon}>✓</Text>
      </View>
      <Text style={styles.title}>Congratulations!</Text>
      <Text style={styles.subtitle}>Your account has been registered successfully.</Text>
      <Pressable style={styles.primaryButton} onPress={() => router.push('/login')}>
        <Text style={styles.primaryText}>Go to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
  },
  checkmark: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  checkIcon: {
    fontSize: 48,
    color: '#22C55E',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#5D5FEF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
