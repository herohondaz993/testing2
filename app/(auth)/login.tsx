import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await login({ email, password });
      
      if (result.success) {
        // Login successful, navigation will be handled by the protected route hook
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop' }}
              style={styles.logo}
            />
            <Text style={styles.title}>Welcome to MindJournal</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your mental wellness journey
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={<Mail size={20} color={colors.gray[400]} />}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              leftIcon={<Lock size={20} color={colors.gray[400]} />}
            />
            
            <Button
              title="Sign In"
              onPress={handleLogin}
              variant="primary"
              isLoading={isLoading}
              style={styles.loginButton}
              rightIcon={<ArrowRight size={18} color="white" />}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.signupLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.adminNote}>
            <Text style={styles.adminNoteText}>
              Admin login: admin@mindjournal.com / admin123
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.gray[600],
    marginRight: 4,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  adminNote: {
    marginTop: 40,
    alignItems: 'center',
  },
  adminNoteText: {
    fontSize: 12,
    color: colors.gray[500],
    textAlign: 'center',
  },
});