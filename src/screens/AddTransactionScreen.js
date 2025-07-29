import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTransaction, updateTransaction } from '../redux/transactionsSlice';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import TransactionForm from '../components/TransactionForm';

const AddTransactionScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { transaction } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    navigation.setOptions({
      title: transaction ? 'Edit Transaction' : 'Add Transaction',
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        ...FONTS.h3,
      },
    });
  }, [navigation, transaction]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      
      if (transaction) {
        // Editing existing transaction
        await dispatch(updateTransaction({ 
          id: transaction.id, 
          ...values 
        })).unwrap();
        Alert.alert('Success', 'Transaction updated successfully');
      } else {
        // Adding new transaction
        await dispatch(addTransaction(values)).unwrap();
        Alert.alert('Success', 'Transaction added successfully');
        resetForm();
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to save transaction. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.formContainer}>
        <TransactionForm 
          initialValues={transaction} 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => navigation.goBack()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default AddTransactionScreen;