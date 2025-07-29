import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const SignInScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('kruthikbr2@gmail.com'); // Pre-filled with dummy email
  const [password, setPassword] = useState('123456789'); // Pre-filled with dummy password
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dummy credentials
  const DUMMY_CREDENTIALS = {
    email: 'kruthikbr2@gmail.com',
    password: '123456789'
  };

  const handleSignIn = () => {
    // Simple validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Simulate loading
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Check against dummy credentials
      if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
        // Navigate to main app on success
        navigation.replace('MainApp');
      } else {
        Alert.alert('Error', 'Invalid email or password.\n\nUse:\nEmail: kruthikbr2@gmail.com\nPassword: 123456789');
      }
    }, 1000);
  };

  // Simplified forgot password function
  const handleForgotPassword = () => {
    Alert.alert(
      'Dummy Authentication', 
      'This is a demo login screen.\n\n' +
      'Use these credentials to log in:\n' +
      `Email: ${DUMMY_CREDENTIALS.email}\n` +
      `Password: ${DUMMY_CREDENTIALS.password}`
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              placeholder="Email address"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              autoComplete="password"
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                size={20} 
                color={COLORS.gray} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={handleForgotPassword}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signInButton}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              This is a dummy login screen.
            </Text>
            <Text style={styles.noteText}>
              Email: kruthikbr2@gmail.com
            </Text>
            <Text style={styles.noteText}>
              Password: 123456789
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Dummy Authentication System</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.padding * 2,
  },
  header: {
    marginBottom: SIZES.padding * 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray,
  },
  form: {
    flex: 1,
    marginTop: SIZES.padding,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.base,
    height: 50,
  },
  inputIcon: {
    marginRight: SIZES.base,
  },
  input: {
    flex: 1,
    height: '100%',
    ...FONTS.body4,
    color: COLORS.dark,
  },
  eyeIcon: {
    padding: SIZES.base,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.padding,
  },
  forgotPasswordText: {
    ...FONTS.body5,
    color: COLORS.primary,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  signInButtonText: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.padding,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray2,
  },
  dividerText: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginHorizontal: SIZES.base,
  },
  noteContainer: {
    marginTop: SIZES.padding,
    backgroundColor: COLORS.lightGray,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  noteText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    marginBottom: SIZES.padding,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    paddingHorizontal: SIZES.padding,
  },
  googleButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray2,
  },
  appleButton: {
    backgroundColor: COLORS.dark,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: SIZES.base,
  },
  socialButtonText: {
    ...FONTS.h4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: SIZES.padding,
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  signUpText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default SignInScreen;