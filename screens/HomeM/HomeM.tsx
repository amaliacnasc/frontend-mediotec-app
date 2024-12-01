import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import fotoAlunos from '../../assets/foto-mediotec.png';

type Notification = {
  announcementId: string;
  title: string;
  content: string;
  announcementType: 'EVENT' | 'NEWS';
  createdAt: string;
};

export default function HomeM() {
  const [data, setData] = useState<Notification[]>([]);
  const [userData, setUserData] = useState({ name: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  // Função para buscar notificações
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.slice(0, 2)); // Exibir apenas as 2 notificações mais recentes
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setError('Erro ao carregar as notificações. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar dados do usuário
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      const userId = await AsyncStorage.getItem('@user_id');

      if (!token || !userId) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }

      const response = await axios.get(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/usuarios/id/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserData({ name: response.data.userName });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setError('Erro ao carregar os dados do usuário.');
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      {/*  
      <Text style={styles.welcomeText}>Bem-vindo, {userData.name || 'Usuário'}</Text> */}

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Últimos avisos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NotificationM')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.announcementId}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                item.announcementType === 'EVENT' ? styles.event : styles.news,
              ]}
            >
              <Text style={styles.cardType}>
                {item.announcementType === 'EVENT' ? 'Evento' : 'Comunicado'}
              </Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardContent}>{item.content}</Text>
            </View>
          )}
        />
      </View>

      {/* Imagem dos alunos */}
      <Image source={fotoAlunos} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#9747FF',
    textDecorationLine: 'underline',
  },
  card: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  event: {
    backgroundColor: '#F3E5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#9C4D97',
  },
  news: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#EF5350',
  },
  cardType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#7326BF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 16,
  },
});
