import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Simula os boletos em PDF
const mockBoletos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  value: `R$ ${(500).toFixed(2)}`,
  dueDate: new Date(2024, i, 30).toLocaleDateString('pt-BR'),
  url: `https://www.africau.edu/images/default/sample.pdf`,
}));

export default function PaymentsScreen() {
  const [boletos, setBoletos] = useState(mockBoletos);

  const downloadBoleto = async (url: string) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}boleto.pdf`;
      const { uri } = await FileSystem.downloadAsync(url, fileUri);

      // Verifica se o dispositivo suporta o compartilhamento
      if (Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Erro', 'O compartilhamento não é suportado no dispositivo.');
      }
    } catch (error) {
      console.error('Erro ao baixar o boleto:', error);
      Alert.alert('Erro', 'Não foi possível baixar o boleto.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boletos Disponíveis</Text>
      <FlatList
        data={boletos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.boletoItem}>
            <Text style={styles.boletoText}>Valor: {item.value}</Text>
            <Text style={styles.boletoText}>Vencimento: {item.dueDate}</Text>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => downloadBoleto(item.url)}
            >
              <IconButton icon="download" size={20} iconColor="#FFFFFF" />
              <Text style={styles.downloadButtonText}>Baixar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  boletoItem: {
    backgroundColor: '#F3F3F3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boletoText: {
    fontSize: 14,
    color: '#555',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7326BF',
    padding: 8,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 5,
  },
});
