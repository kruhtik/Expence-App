import React, { useContext, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const { isDark, toggleTheme, currency, setCurrency } = useTheme();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate to SignIn screen after successful sign out
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff',
      padding: 16,
    },
    row: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: 16,
      padding: 16,
      backgroundColor: isDark ? '#1E1E1E' : '#f5f5f5',
      borderRadius: 12,
    },
    label: {
      fontSize: 16,
      color: isDark ? '#fff' : '#333',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 12,
      color: isDark ? '#fff' : '#333',
    },
    signOutButton: {
      backgroundColor: isDark ? '#CF6679' : '#FF6B6B',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 32,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    signOutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={dynamicStyles.sectionTitle}>Appearance</Text>
      <View style={dynamicStyles.row}>
        <Text style={dynamicStyles.label}>Dark Mode</Text>
        <Switch 
          value={isDark} 
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#4CAF50' }}
          thumbColor={isDark ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>

      <Text style={dynamicStyles.sectionTitle}>Currency</Text>
      <View style={[styles.pickerContainer, { 
        backgroundColor: isDark ? '#1E1E1E' : '#f5f5f5',
        borderColor: isDark ? '#333' : '#ddd'
      }]}>
        <Picker
          selectedValue={currency}
          onValueChange={(itemValue) => setCurrency(itemValue)}
          style={[styles.picker, { color: isDark ? '#fff' : '#000' }]}
          dropdownIconColor={isDark ? '#fff' : '#000'}
        >
          <Picker.Item label="USD - US Dollar" value="USD" color={isDark ? '#fff' : '#000'} />
          <Picker.Item label="EUR - Euro" value="EUR" color={isDark ? '#fff' : '#000'} />
          <Picker.Item label="INR - Indian Rupee" value="INR" color={isDark ? '#fff' : '#000'} />
        </Picker>
      </View>

      <TouchableOpacity 
        style={dynamicStyles.signOutButton}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={dynamicStyles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: { 
    width: '100%',
  },
});

export default SettingsScreen;