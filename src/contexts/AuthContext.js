import React, { useState, useMemo } from 'react';
import { Alert } from 'react-native';

// This context manages authentication state and methods
export const AuthContext = React.createContext({
  user: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      // TODO: Implement actual sign in logic with your authentication service
      // For now, we'll just set a dummy user
      const dummyUser = { uid: '1', email };
      setUser(dummyUser);
      return { success: true, user: dummyUser };
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', error.message || 'Failed to sign in');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      // TODO: Implement actual sign up logic with your authentication service
      // For now, we'll just set a dummy user
      const dummyUser = { uid: '1', email };
      setUser(dummyUser);
      return { success: true, user: dummyUser };
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
      // TODO: Implement actual sign out logic with your authentication service
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
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
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
