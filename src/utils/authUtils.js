import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

// Path for our db.json file
const DB_PATH = `${FileSystem.documentDirectory}db.json`;

// Generate a random salt for password hashing
const generateSalt = async () => {
  const array = new Uint8Array(16);
  const randomBytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Hash password with salt using PBKDF2
const hashPassword = async (password, salt) => {
  try {
    // Using expo-crypto's digestStringAsync for hashing
    const encoder = new TextEncoder();
    const data = `${password}${salt}`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data
    );
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

// Initialize the database file if it doesn't exist
const initDatabase = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(DB_PATH);
    
    if (!fileInfo.exists) {
      await FileSystem.writeAsStringAsync(
        DB_PATH,
        JSON.stringify({ users: [] }),
        { encoding: FileSystem.EncodingType.UTF8 }
      );
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new Error('Failed to initialize database');
  }
};

// Read data from db.json
const readDatabase = async () => {
  try {
    await initDatabase();
    const fileContent = await FileSystem.readAsStringAsync(DB_PATH, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading database:', error);
    throw new Error('Failed to read database');
  }
};

// Write data to db.json
const writeDatabase = async (data) => {
  try {
    await FileSystem.writeAsStringAsync(
      DB_PATH,
      JSON.stringify(data, null, 2),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  } catch (error) {
    console.error('Error writing to database:', error);
    throw new Error('Failed to update database');
  }
};

// Store user session securely
export const storeUserSession = async (userData) => {
  try {
    await SecureStore.setItemAsync('userToken', userData.token);
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user session:', error);
    throw new Error('Failed to store user session');
  }
};

// Get user session
export const getUserSession = async () => {
  try {
    const userData = await SecureStore.getItemAsync('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

// Clear user session
export const clearUserSession = async () => {
  try {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userData');
  } catch (error) {
    console.error('Error clearing user session:', error);
    throw new Error('Failed to clear user session');
  }
};

// Register a new user with additional details
export const registerUser = async (userData) => {
  try {
    const { email, password, name, phone } = userData;
    
    // Input validation
    if (!email || !password || !name) {
      throw new Error('Name, email, and password are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Read existing users
    const db = await readDatabase();
    
    // Check if user already exists
    if (db.users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }

    // Generate salt and hash password
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    // Custom UUID v4 generator
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    // Create new user with additional details
    const newUser = {
      id: generateUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      salt,
      password: hashedPassword,
      isEmailVerified: false,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
      preferences: {},
      profile: {}
    };

    // Save user to database
    db.users = db.users || [];
    db.users.push(newUser);
    await writeDatabase(db);

    // Generate auth token (in a real app, use JWT or similar)
    const token = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${email}:${Date.now()}`
    );

    // Store user session (don't store sensitive data)
    const sessionData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      token,
    };

    await storeUserSession(sessionData);
    return { success: true, user: sessionData };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

// Authenticate user
export const loginUser = async (email, password) => {
  try {
    // Input validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Read users from database
    const db = await readDatabase();
    
    // Find user by email (case insensitive)
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password using the same hashing approach as registration
    const hashedPassword = await hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
      throw new Error('Invalid email or password');
    }

    // Generate auth token
    const token = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${email}:${Date.now()}`
    );

    // Store user session
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token,
    };

    await storeUserSession(userData);
    return { success: true, user: userData };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await clearUserSession();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};
