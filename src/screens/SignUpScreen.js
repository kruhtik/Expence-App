import React, { useState, useContext } from 'react';
import { 
  View, TextInput, StyleSheet, Text, TouchableOpacity, 
  Image, ScrollView, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert, Keyboard
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext';
import { COLORS, SIZES, FONTS } from '../constants/theme';
// Google logo import removed - using relative path

const signUpSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Too short!').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const SignUpScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, signInWithGoogle, signInWithApple } = useContext(AuthContext);

  const handleSignUp = async (values) => {
    try {
      Keyboard.dismiss();
      setIsLoading(true);
      await signUp(values.email, values.password, values.name);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch (error) {
      if (error.code !== 'ERR_CANCELED') {
        Alert.alert('Error', 'Failed to sign up with Apple');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={signUpSchema}
          onSubmit={handleSignUp}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.gray}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  style={styles.input}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor={COLORS.gray}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isLoading}
                />
              </View>
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={COLORS.gray}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  autoComplete="password-new"
                  editable={!isLoading}
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
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.gray}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  autoComplete="password-new"
                  editable={!isLoading}
                />
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity 
                style={styles.signUpButton}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={handleGoogleSignUp}
                  disabled={isLoading}
                >
                  <Image 
                    source={require('../../assets/images/google.png')} 
                    style={styles.socialIcon} 
                  />
                  <Text style={[styles.socialButtonText, { color: COLORS.dark }]}>
                    {isLoading ? 'Signing up...' : 'Continue with Google'}
                  </Text>
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.appleButton]}
                    onPress={handleAppleSignUp}
                    disabled={isLoading}
                  >
                    <Ionicons name="logo-apple" size={20} color="#fff" />
                    <Text style={[styles.socialButtonText, { color: '#fff' }]}>
                      {isLoading ? 'Signing up...' : 'Continue with Apple'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
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
  errorText: {
    ...FONTS.body5,
    color: COLORS.error,
    marginTop: -SIZES.base / 2,
    marginBottom: SIZES.base / 2,
    marginLeft: SIZES.base,
  },
  signUpButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  signUpButtonText: {
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
  signInText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;