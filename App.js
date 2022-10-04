import { StyleSheet, Text, View, FlatList, TextInput, Button } from 'react-native';
import { useEffect, useState } from 'react';
import * as SQLite from'expo-sqlite';

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppinglist, setShoppinglist] = useState([]);
  const db = SQLite.openDatabase('coursedb.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);',  [product, amount]);
    }, null, updateList)
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) =>
      setShoppinglist(rows._array)
      );
    }, null, null);
  }

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
    }, null, updateList)    
  }

  return (
    <View style={styles.container}>
      <Text></Text>
      <Text></Text>
      <TextInput 
        placeholder='Product'
        onChangeText={text => setProduct(text)}
        value={product} />
      <TextInput
        placeholder='Amount'
        onChangeText={text => setAmount(text)}
        value={amount} />
      <Button onPress={saveItem} title='SAVE' />
      <Text></Text>
      <Text>SHOPPING LIST</Text>
      <FlatList
        style={{marginLeft: "5%"}}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
          <View style={styles.listcontainer}>
            <Text>{item.product}, {item.amount} </Text>
            <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>bought</Text>
          </View>}
        data={shoppinglist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});
