import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

const GoalsScreen = () => {
  const { user } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  
  useEffect(() => {
    if (!user) return;
    const unsub = db.collection('goals').where('userId','==',user.uid).onSnapshot(snap => {
      setGoals(snap.docs.map(d=>({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  const addGoal = () => {
    db.collection('goals').add({ userId: user.uid, title, targetAmount: parseFloat(target), currentAmount: 0 });
    setTitle(''); setTarget('');
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Goal Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Target Amount" value={target} onChangeText={setTarget} keyboardType="numeric" style={styles.input} />
      <Button title="Add Goal" onPress={addGoal} />
      <FlatList data={goals} keyExtractor={item=>item.id} renderItem={({item})=>(
        <View style={styles.goalItem}>
          <Text>{item.title}: {item.currentAmount}/{item.targetAmount}</Text>
        </View>
      )} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8 },
  goalItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' }
});

export default GoalsScreen;