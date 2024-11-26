import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Importação corrigida

type Notification = {
  announcementId: string;
  title: string;
  content: string;
  announcementType: 'EVENT' | 'NEWS';
  createdAt: string;
};

export default function NotificationM() {
  const [data, setData] = useState<Notification[]>([]); // Estado para armazenar a lista
  const [filteredData, setFilteredData] = useState<Notification[]>([]); // Estado para armazenar os dados filtrados
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o carregamento
  const [error, setError] = useState<string | null>(null); // Estado para controlar erros
  const [searchText, setSearchText] = useState<string>(''); // Estado para o filtro de texto
  const [filterType, setFilterType] = useState<string>('todos'); // Estado para o filtro de tipo (Evento ou Comunicado)

  // Função para buscar dados do backend
  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        setLoading(false);
        return;
      }

      const response = await axios.get('https://api-mediotec-v2-teste.onrender.com/mediotec/notificacoes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data); // Armazena os dados no estado
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setError('Erro ao carregar as notificações. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Função para filtrar as notificações com base no texto e no tipo
  const filterNotifications = () => {
    let filtered = data;

    // Filtro por texto
    if (searchText) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filterType !== 'todos') {
      filtered = filtered.filter((item) => item.announcementType === filterType.toUpperCase());
    }

    setFilteredData(filtered);
  };

  // Chama a função fetchNotifications quando o componente é montado
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Chama o filtro sempre que o texto ou tipo de filtro mudar
  useEffect(() => {
    filterNotifications();
  }, [searchText, filterType, data]);

  // Exibição de loading
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  // Exibição de erro
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  // Exibição da lista
  return (
    <View style={styles.container}>
      {/* Filtro de texto */}
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
          keyExtractor={(item) => String(item.announcementId)}
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  filterLabel: {
    fontSize: 16,
    color: '#333333',
  },
  picker: {
    height: 40,
    width: 150,
    borderColor: '#9747FF',
    borderWidth: 1,
    borderRadius: 5,
  },
  item: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    
  },
  event: {
    backgroundColor: '#F3E5F5', // Lilás para eventos
    borderColor: '#9C4D97',
  },
  news: {
    backgroundColor: '#FFEBEE', // Rosa claro para notícias
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
    backgroundColor:'#7326BF',
    width:95, 
    padding:2,
    textAlign:'center',
    borderRadius:8,
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
