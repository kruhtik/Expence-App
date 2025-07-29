import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SignInScreen from '../screens/SignInScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main App Tabs
const AppTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    <Tab.Screen name="Goals" component={GoalsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      {/* Show SignIn screen first for demo purposes */}
      <Stack.Screen 
        name="SignIn" 
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MainApp" 
        component={AppTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen}
        options={{ title: 'Add Transaction' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;