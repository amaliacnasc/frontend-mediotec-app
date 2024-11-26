import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function Payment() {
  const boletos = [
    { valor: 'R$ 500,00', vencimento: '30/03/24', id: '1' },
    { valor: 'R$ 500,00', vencimento: '28/04/24', id: '2' },
    { valor: 'R$ 500,00', vencimento: '30/05/24', id: '3' },
    { valor: 'R$ 500,00', vencimento: '30/06/24', id: '4' },
    { valor: 'R$ 500,00', vencimento: '30/07/24', id: '5' },
    { valor: 'R$ 500,00', vencimento: '30/08/24', id: '6' },
    { valor: 'R$ 500,00', vencimento: '30/09/24', id: '7' },
    { valor: 'R$ 500,00', vencimento: '30/10/24', id: '8' },
    { valor: 'R$ 500,00', vencimento: '30/11/24', id: '9' },
    { valor: 'R$ 500,00', vencimento: '30/12/24', id: '10' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.valor}</Text>
      <Text style={styles.cell}>{item.vencimento}</Text>
      <TouchableOpacity style={styles.iconContainer}>
        <IconButton
          icon="barcode"
          size={24}
          iconColor="#7326BF"
          onPress={() => alert(`Download do boleto: ${item.id}`)}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boletos disponíveis</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Valor</Text>
        <Text style={styles.headerCell}>Vencimento</Text>
        <Text style={styles.headerCell}>Ação</Text>
      </View>
      <FlatList
        data={boletos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    backgroundColor: '#F3F3F3',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    color: '#7326BF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  listContainer: {
    marginTop: 8,
  },
});
