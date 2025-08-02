import React, { useState, useContext } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  KeyboardAvoidingView,
  Platform, 
  Alert, 
  Keyboard
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../contexts/AuthContext';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const signUpSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const SignUpScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useContext(AuthContext);

  const handleSignUp = async (values) => {
    try {
      Keyboard.dismiss();
      
      // Validate passwords match
      if (values.password !== values.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      
      setIsLoading(true);
      
      // Prepare user data for registration
      const userData = {
        name: values.name,
        email: values.email.toLowerCase().trim(),
        password: values.password,
        phone: values.phone || ''
      };
      
      console.log('Attempting to register user:', userData.email);
      
      // Call the signUp function from AuthContext with user data
      const result = await signUp(userData);
      console.log('Sign up result:', result);
      
      if (result && result.success) {
        // Show success message and navigate to home
        Alert.alert('Success', 'Account created successfully!', [
          { 
            text: 'OK', 
            onPress: () => {
              // Reset navigation stack and navigate to MainApp
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainApp' }],
              });
            }
          }
        ]);
      } else {
        const errorMessage = result?.error || 'Failed to create account';
        console.error('Sign up failed:', errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', error.message || 'An error occurred during sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
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
                style={[styles.signUpButton, isLoading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleSignIn} disabled={isLoading}>
                  <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
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
    alignItems: 'center',
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
    marginTop: SIZES.padding,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.base,
  },
  inputIcon: {
    marginRight: SIZES.base,
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.black,
    ...FONTS.body4,
  },
  eyeIcon: {
    padding: SIZES.base,
  },
  errorText: {
    color: COLORS.error,
    ...FONTS.body5,
    marginBottom: SIZES.base,
    marginLeft: SIZES.base,
  },
  signUpButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.padding,
  },
  signInText: {
    color: COLORS.gray,
    ...FONTS.body4,
  },
  signInLink: {
    color: COLORS.primary,
    ...FONTS.body4,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
