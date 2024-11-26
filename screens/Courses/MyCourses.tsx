import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Interfaces para tipagem
interface Course {
  courseId: string;
  user_class_courseId: string;
  details: {
    courseName: string;
    description: string;
    workload: number;
  };
  concept: Concept | null;
}

interface Concept {
  conceitoId: string;
  conceito: string;
  unidade: string;
  result: string;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]); // Armazena disciplinas
  const [loading, setLoading] = useState<boolean>(true); // Controla carregamento
  const [error, setError] = useState<string | null>(null); // Armazena mensagens de erro
  const [concepts, setConcepts] = useState<Concept[]>([]); // Armazena conceitos
  const [modalMessage, setModalMessage] = useState<string>(''); // Mensagem do modal
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Controla exibição do modal

  // Função para buscar disciplinas da turma do usuário
  const fetchCoursesAndConcepts = async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      const userId = await AsyncStorage.getItem('@user_id');

      if (!token || !userId) {
        Alert.alert('Erro', 'Usuário não autenticado ou ID ausente.');
        setLoading(false);
        return;
      }

      // Busca a turma associada ao usuário
      const turmaResponse = await axios.get<{ classId: string }[]>(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/relacionamento/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const classId = turmaResponse.data[0]?.classId;

      if (!classId) {
        Alert.alert('Erro', 'Usuário não está associado a nenhuma turma.');
        setLoading(false);
        return;
      }

      // Busca todas as disciplinas da turma
      const coursesResponse = await axios.get<{ courseId: string; user_class_courseId: string }[]>(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/turmas/classCourse/${classId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allCourses = await Promise.all(
        coursesResponse.data.map(async (course) => {
          const courseDetailsResponse = await axios.get<{
            courseName: string;
            description: string;
            workload: number;
          }>(
            `https://api-mediotec-v2-teste.onrender.com/mediotec/disciplinas/id/${course.courseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return { ...course, details: courseDetailsResponse.data };
        })
      );

      // Busca os conceitos do usuário
      const conceptsResponse = await axios.get<Concept[]>(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/conceitos/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userConcepts = conceptsResponse.data;

      // Combina disciplinas da turma com conceitos (se houver)
      const coursesWithConcepts: Course[] = allCourses.map((course) => {
        const concept = userConcepts.find(
          (c) => c.conceitoId === course.user_class_courseId
        );
        return {
          ...course,
          concept: concept || null, // Adiciona o conceito, ou null se não tiver
        };
      });

      setCourses(coursesWithConcepts);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar as disciplinas e conceitos.');
    } finally {
      setLoading(false);
    }
  };

  // Abre o modal para exibir os conceitos de uma disciplina
  const openConceptsModal = (concept: Concept | null) => {
    if (concept) {
      setConcepts([concept]);
      setModalMessage('');
    } else {
      setConcepts([]);
      setModalMessage('Essa disciplina ainda não teve seus conceitos cadastrados.');
    }
    setModalVisible(true);
  };

  useEffect(() => {
    fetchCoursesAndConcepts();
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

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.details.courseId}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text style={styles.courseTitle}>{item.details.courseName}</Text>
            <Text style={styles.detailsText}>Descrição: {item.details.description}</Text>
            <Text style={styles.detailsText}>
              Carga Horária: {item.details.workload} horas
            </Text>
            <TouchableOpacity
              style={styles.conceptButton}
              onPress={() => openConceptsModal(item.concept)}
            >
              <Text style={styles.buttonText}>Ver Conceitos</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal para exibição de conceitos */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Conceitos</Text>
            {modalMessage ? (
              <Text style={styles.modalMessage}>{modalMessage}</Text>
            ) : (
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
            )}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  detailsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  conceptButton: {
    backgroundColor: '#B39DDB',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#673AB7',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  conceptItem: {
    padding: 10,
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    marginBottom: 10,
  },
  conceptText: {
    fontSize: 16,
    color: '#5E35B1',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#673AB7',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  error: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
});
