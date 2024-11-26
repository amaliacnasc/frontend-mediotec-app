import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function Conceitos() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const route = useRoute();
  const navigation = useNavigation();
  const { courseId } = route.params as { courseId: string };

  const fetchConcepts = async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      const userId = await AsyncStorage.getItem('@user_id');
      if (!token || !userId) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/conceitos/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredConcepts = response.data.filter(
        (concept: any) => concept.user_class_courseId === courseId
      );

      setConcepts(filteredConcepts);
    } catch (error) {
      console.error('Erro ao buscar conceitos:', error);
      Alert.alert('Erro', 'Erro ao carregar os conceitos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcepts();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={concepts}
        keyExtractor={(item) => item.conceitoId}
        renderItem={({ item }) => (
          <View style={styles.conceptItem}>
            <Text style={styles.conceptText}>Conceito: {item.conceito}</Text>
            <Text style={styles.conceptText}>Unidade: {item.unidade}</Text>
            <Text style={styles.conceptText}>Resultado: {item.result}</Text>
          </View>
        )}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#FFFFFF',
    },
    courseItem: {
      backgroundColor: '#EDE7F6',
      padding: 16,
      marginBottom: 12,
      borderRadius: 8,
    },
    courseTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#673AB7',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    detailsButton: {
      backgroundColor: '#D1C4E9',
      padding: 10,
      borderRadius: 8,
    },
    conceptButton: {
      backgroundColor: '#B39DDB',
      padding: 10,
      borderRadius: 8,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    conceptItem: {
      marginBottom: 12,
      padding: 16,
      backgroundColor: '#F3E5F5',
      borderRadius: 8,
    },
    conceptText: {
      fontSize: 16,
      color: '#5E35B1',
    },
    backButton: {
      marginTop: 20,
      alignSelf: 'center',
      padding: 10,
      backgroundColor: '#673AB7',
      borderRadius: 8,
    },
    backButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    error: {
      fontSize: 16,
      color: '#FF0000',
      textAlign: 'center',
    },
    detailsContainer:{
  
    }, 
    detailsText:{
  
    }
  });
  