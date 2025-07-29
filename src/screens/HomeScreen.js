import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTransactions,
  selectExpenses,
  selectIncomes,
  selectLoading,
} from '../redux/transactionsSlice';
import { AuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useContext(AuthContext);
  const { isDark, currencySymbol } = useTheme();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const expenses = useSelector(selectExpenses);
  const incomes = useSelector(selectIncomes);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const loadTransactions = useCallback(async () => {
    if (!user) return;
    try {
      await dispatch(fetchTransactions(user.uid)).unwrap();
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, [user, dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const getTotal = items => {
    if (!items || !Array.isArray(items) || items.length === 0) return '0.00';
    const total = items.reduce((sum, i) => {
      const amount = parseFloat(i?.amount) || 0;
      return sum + amount;
    }, 0);
    return total.toFixed(2);
  };

  const renderTransaction = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.transactionItem,
        isDark && { backgroundColor: '#1E1E1E' },
      ]}
      onPress={() =>
        navigation.navigate('AddTransaction', { transaction: item })
      }
    >
      <View style={styles.transactionIcon}>
        <Ionicons
          name={
            item.type === 'expense'
              ? 'arrow-up-circle'
              : 'arrow-down-circle'
          }
          size={24}
          color={item.type === 'expense' ? '#FF6B6B' : '#4CAF50'}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text
          style={[
            styles.transactionCategory,
            isDark && { color: '#fff' },
          ]}
        >
          {item.category}
        </Text>
        <Text
          style={[styles.transactionNote, isDark && { color: '#aaa' }]}
          numberOfLines={1}
        >
          {item.note || 'No description'}
        </Text>
        <Text style={[styles.transactionDate, isDark && { color: '#888' }]}>
          {format(new Date(item.date), 'MMM d, yyyy')}
        </Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          {
            color: item.type === 'expense' ? '#FF6B6B' : '#4CAF50',
            fontWeight: '600',
          },
        ]}
      >
        {item.type === 'expense' ? '-' : '+'}
        {currencySymbol}
        {parseFloat(item.amount).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  const transactions = activeTab === 'expenses' ? expenses : incomes;
  const totalExpenses = getTotal(expenses);
  const totalIncomes = getTotal(incomes);
  const balance = (totalIncomes - totalExpenses).toFixed(2);

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#F5F7FA',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingTop: 50,
      backgroundColor: isDark ? '#1E1E1E' : '#FFF',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFF' : '#333',
    },
  };

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Welcome Back</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color={isDark ? '#fff' : '#333'}
          />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View
        style={[
          styles.balanceCard,
          {
            backgroundColor: isDark ? '#2D2D2D' : '#4CAF50',
            shadowColor: isDark ? '#000' : '#4CAF50',
          },
        ]}
      >
        <Text
          style={[
            styles.balanceLabel,
            { color: isDark ? '#BBB' : 'rgba(255, 255, 255, 0.8)' },
          ]}
        >
          Current Balance
        </Text>
        <Text style={[styles.balanceAmount, { color: '#FFF' }]}>
          {currencySymbol}
          {balance}
        </Text>
        <View style={styles.balanceDetails}>
          <View style={styles.incomeExpense}>
            <Ionicons
              name="arrow-down-circle"
              size={20}
              color={isDark ? '#4CAF50' : '#E8F5E9'}
            />
            <Text
              style={[
                styles.incomeText,
                { color: isDark ? '#4CAF50' : '#E8F5E9' },
              ]}
            >
              {currencySymbol}
              {totalIncomes}
            </Text>
          </View>
          <View style={styles.incomeExpense}>
            <Ionicons
              name="arrow-up-circle"
              size={20}
              color={isDark ? '#FF6B6B' : '#FFEBEE'}
            />
            <Text
              style={[
                styles.expenseText,
                { color: isDark ? '#FF6B6B' : '#FFEBEE' },
              ]}
            >
              {currencySymbol}
              {totalExpenses}
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View
        style={[
          styles.tabs,
          {
            backgroundColor: isDark ? '#2D2D2D' : '#F0F0F0',
            shadowColor: isDark ? '#000' : '#000',
          },
        ]}
      >
        {['expenses', 'incomes'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && [
                styles.activeTab,
                {
                  backgroundColor: isDark ? '#3D3D3D' : '#FFF',
                  shadowColor: isDark ? '#000' : '#000',
                },
              ],
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: isDark ? '#AAA' : '#666' },
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <>
          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={renderTransaction}
            contentContainerStyle={
              transactions.length === 0
                ? styles.emptyContainer
                : styles.transactionList
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#4CAF50"
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No transactions yet. Add your first one!
              </Text>
            }
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate('AddTransaction', { transaction: null })
            }
          >
            <Ionicons name="add" size={30} color="#FFF" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: { fontSize: 14, marginBottom: 8 },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  balanceDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  incomeExpense: { flexDirection: 'row', alignItems: 'center' },
  incomeText: { marginLeft: 8, fontWeight: '600' },
  expenseText: { marginLeft: 8, fontWeight: '600' },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeTab: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: { fontWeight: '600' },
  activeTabText: { color: '#4CAF50' },
  transactionList: { padding: 16, paddingBottom: 80 },
  transactionItem: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: { flex: 1, marginRight: 8 },
  transactionCategory: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  transactionNote: { fontSize: 14, marginBottom: 4 },
  transactionDate: { fontSize: 12 },
  transactionAmount: { fontSize: 16, fontWeight: '600' },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor:'#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 16, textAlign: 'center', fontSize: 16 },
});

export default HomeScreen;
