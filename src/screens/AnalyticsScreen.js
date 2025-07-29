import React from 'react';
import { View, Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const transactions = useSelector(state => state.transactions?.items || []);
  
  // Process data only if there are transactions
  const chartData = React.useMemo(() => {
    if (!transactions.length) return [];
    
    const data = transactions.reduce((acc, t) => {
      if (!t || !t.category) return acc;
      const cat = t.category;
      acc[cat] = (acc[cat] || 0) + (parseFloat(t.amount) || 0);
      return acc;
    }, {});
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B5DE5', '#F15BB5'];
    
    return Object.entries(data).map(([name, amount], index) => ({
      name,
      amount,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  }, [transactions]);

  if (!transactions.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transaction data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data to display</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AnalyticsScreen;