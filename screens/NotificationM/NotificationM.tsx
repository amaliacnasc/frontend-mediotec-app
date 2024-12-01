import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Notification = {
  announcementId: string;
  title: string;
  content: string;
  announcementType: 'EVENT' | 'NEWS';
  createdAt: string;
};

export default function NotificationM() {
  const [data, setData] = useState<Notification[]>([]);
  const [filteredData, setFilteredData] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('todos');

  // Busca notificações do backend
  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        setLoading(false);
        return;
      }
      const response = await axios.get(
        'https://api-mediotec-v2-teste.onrender.com/mediotec/notificacoes',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data);
    } catch {
      setError('Erro ao carregar as notificações. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Filtra notificações com base em texto e tipo
  const filterNotifications = () => {
    let filtered = data;
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (filterType !== 'todos') {
      filtered = filtered.filter((item) => item.announcementType === filterType.toUpperCase());
    }
    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [searchText, filterType, data]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar por título ou conteúdo"
        value={searchText}
        onChangeText={setSearchText}
      />
      {filteredData.length === 0 ? (
        <Text style={styles.empty}>Nenhuma notificação disponível.</Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.announcementId}
          renderItem={({ item }) => (
            <View
              style={[
                styles.item,
                item.announcementType === 'EVENT' ? styles.event : styles.news,
              ]}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.type}>
                {item.announcementType === 'EVENT' ? 'Evento' : 'Comunicado'}
              </Text>
              <Text style={styles.content}>{item.content}</Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString('pt-BR')} {new Date(item.createdAt).toLocaleTimeString('pt-BR')}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#9747FF',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  item: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  event: {
    backgroundColor: '#F3E5F5',
    borderColor: '#9C4D97',
  },
  news: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF5350',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    fontSize: 14,
    color: '#555555',
    marginVertical: 5,
  },
  type: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    backgroundColor: '#7326BF',
    width: 95,
    padding: 2,
    textAlign: 'center',
    borderRadius: 8,
  },
  date: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'right',
  },
  error: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  empty: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginTop: 20,
  },
});
