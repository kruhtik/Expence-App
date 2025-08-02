import React, { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import * as AuthUtils from '../utils/authUtils';

// This context manages authentication state and methods
export const AuthContext = React.createContext({
  user: null,
  loading: true, // Start with loading true to wait for initial auth check
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userSession = await AuthUtils.getUserSession();
        if (userSession) {
          setUser(userSession);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const result = await AuthUtils.loginUser(email, password);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', error.message || 'Failed to sign in');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setLoading(true);
      // Pass the complete user data to registerUser
      const result = await AuthUtils.registerUser(userData);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error || 'Failed to sign up');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', error.message || 'Failed to sign up');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const result = await AuthUtils.logoutUser();
      
      if (result.success) {
        setUser(null);
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to sign out');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
