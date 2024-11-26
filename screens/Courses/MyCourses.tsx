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

export default function MyCourses() {
  const [courses, setCourses] = useState<any[]>([]); // Estado para armazenar as disciplinas
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o carregamento
  const [error, setError] = useState<string | null>(null); // Estado para controlar erros
  const [concepts, setConcepts] = useState<any[]>([]); // Estado para os conceitos
  const [showConcepts, setShowConcepts] = useState<boolean>(false); // Estado para alternar entre detalhes e conceitos

  const fetchUserClass = async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      const userId = await AsyncStorage.getItem('@user_id');
      if (!token || !userId) {
        Alert.alert('Erro', 'Usuário não autenticado ou ID ausente.');
        setLoading(false);
        return null;
      }

      const response = await axios.get(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/relacionamento/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.length === 0) {
        Alert.alert('Erro', 'Usuário não está associado a nenhuma turma.');
        setLoading(false);
        return null;
      }

      return response.data[0]?.classId;
    } catch (error) {
      console.error('Erro ao buscar turma do usuário:', error);
      setError('Erro ao carregar a turma do usuário. Verifique sua conexão.');
      return null;
    }
  };

  const fetchClassCourses = async (classId: string) => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/turmas/classCourse/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const coursesWithDetails = await Promise.all(
        response.data.map(async (course: any) => {
          const courseDetailsResponse = await axios.get(
            `https://api-mediotec-v2-teste.onrender.com/mediotec/disciplinas/id/${course.courseId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          return { ...course, details: courseDetailsResponse.data, showDetails: false }; // Incluindo showDetails
        })
      );

      setCourses(coursesWithDetails);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
      setError('Erro ao carregar as disciplinas. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const fetchConcepts = async (courseId: string) => {
    try {
      setLoading(true);
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
      setShowConcepts(true);
    } catch (error) {
      console.error('Erro ao buscar conceitos:', error);
      Alert.alert('Erro', 'Erro ao carregar os conceitos.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseDetails = (courseId: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.courseId === courseId
          ? { ...course, showDetails: !course.showDetails }
          : course
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const classId = await fetchUserClass();
      if (classId) {
        await fetchClassCourses(classId);
      }
    };

    fetchData();
  }, []);

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

  if (showConcepts) {
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
        <TouchableOpacity onPress={() => setShowConcepts(false)} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => String(item.courseId)}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text style={styles.courseTitle}>{item.details?.courseName || 'Carregando...'}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => toggleCourseDetails(item.courseId)}
              >
                <Text style={styles.buttonText}>
                  {item.showDetails ? 'Esconder Detalhes' : 'Detalhes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.conceptButton}
                onPress={() => fetchConcepts(item.courseId)}
              >
                <Text style={styles.buttonText}>Conceitos</Text>
              </TouchableOpacity>
            </View>

            {item.showDetails && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>Descrição: {item.details?.description}</Text>
                <Text style={styles.detailsText}>
                  Carga Horária: {item.details?.workload} horas
                </Text>
              </View>
            )}
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
