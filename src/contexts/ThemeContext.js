import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(false);
  const [currency, setCurrency] = useState('USD');

  // Load saved theme and currency preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedCurrency = await AsyncStorage.getItem('currency');
        
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          setIsDark(systemScheme === 'dark');
        }
        
        if (savedCurrency) {
          setCurrency(savedCurrency);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    
    loadPreferences();
  }, [systemScheme]);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const updateCurrency = async (newCurrency) => {
    setCurrency(newCurrency);
    try {
      await AsyncStorage.setItem('currency', newCurrency);
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  const getCurrencySymbol = () => {
    switch(currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'INR': return '₹';
      default: return '$';
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        currency,
        setCurrency: updateCurrency,
        currencySymbol: getCurrencySymbol(),
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
