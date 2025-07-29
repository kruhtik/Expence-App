import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, updateTransaction, makeSelectCategoriesByType } from '../redux/transactionsSlice';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a number'),
  category: Yup.string().required('Category is required'),
  note: Yup.string(),
  date: Yup.date().required('Date is required'),
  type: Yup.string().required('Type is required'),
});

const TransactionForm = ({ navigation, route = {} }) => {
  const dispatch = useDispatch();
  const { transaction } = route.params || {};
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const selectCategoriesByType = React.useMemo(
    () => makeSelectCategoriesByType(),
    []
  );
  
  const categories = useSelector(state => 
    selectCategoriesByType(state, transaction?.type || 'expense')
  );

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera roll permissions to upload receipts.');
      }
    })();
  }, []);

  const pickImage = async (setFieldValue) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        // In a real app, you would upload the image to Firebase Storage here
        // and save the download URL to the transaction
        // For now, we'll just store the local URI
        setFieldValue('receipt', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const transactionData = {
        ...values,
        amount: parseFloat(values.amount),
        date: values.date.toISOString(),
        receipt: image || null,
      };

      if (transaction) {
        await dispatch(updateTransaction({ id: transaction.id, ...transactionData })).unwrap();
      } else {
        await dispatch(addTransaction(transactionData)).unwrap();
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          type: transaction?.type || 'expense',
          amount: transaction?.amount?.toString() || '',
          category: transaction?.category || '',
          note: transaction?.note || '',
          date: transaction?.date ? new Date(transaction.date) : new Date(),
          userId: transaction?.userId || '',
          receipt: transaction?.receipt || null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
          <View style={styles.form}>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, values.type === 'expense' && styles.typeButtonActive]}
                onPress={() => setFieldValue('type', 'expense')}
              >
                <Text style={[styles.typeButtonText, values.type === 'expense' && styles.typeButtonTextActive]}>
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, values.type === 'income' && styles.typeButtonActive]}
                onPress={() => setFieldValue('type', 'income')}
              >
                <Text style={[styles.typeButtonText, values.type === 'income' && styles.typeButtonTextActive]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={[styles.input, errors.amount && touched.amount && styles.inputError]}
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                value={values.amount}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
              {errors.amount && touched.amount && (
                <Text style={styles.errorText}>{errors.amount}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={[styles.pickerContainer, errors.category && touched.category && styles.inputError]}>
                <Picker
                  selectedValue={values.category}
                  onValueChange={handleChange('category')}
                  onBlur={handleBlur('category')}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a category" value="" />
                  {categories.map((category) => (
                    <Picker.Item key={category} label={category} value={category} />
                  ))}
                </Picker>
              </View>
              {errors.category && touched.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {values.date.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar" size={20} color="#666" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={values.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFieldValue('date', selectedDate);
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Note (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                onChangeText={handleChange('note')}
                onBlur={handleBlur('note')}
                value={values.note}
                placeholder="Add a note"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Receipt (Optional)</Text>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => pickImage(setFieldValue)}
                disabled={uploading}
              >
                <Ionicons 
                  name={image ? "document-attach" : "cloud-upload"} 
                  size={24} 
                  color={image ? "#4CAF50" : "#666"} 
                />
                <Text style={styles.uploadButtonText}>
                  {uploading ? 'Uploading...' : image ? 'Receipt Attached' : 'Upload Receipt'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title={transaction ? 'Update' : 'Add Transaction'}
                onPress={handleSubmit}
                disabled={isSubmitting || uploading}
                color="#4CAF50"
              />
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  typeButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  uploadButtonText: {
    marginLeft: 8,
    color: '#666',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
});

export default TransactionForm;
