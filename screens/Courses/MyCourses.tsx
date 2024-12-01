import React, { useEffect, useState } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface Course {
  courseId: string;
  user_class_courseId: string;
  details: {
    courseName: string;
    description: string;
    workload: number;
  };
  concept: Concept[]; // Alterado para um array de conceitos
}

interface Concept {
  conceitoId: string;
  conceito: string;
  unidade: string;
  result: string;
  user_class_courseId: string;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [className, setClassName] = useState<string>(""); // Estado para o nome da turma

  // Função para buscar disciplinas e conceitos
  const fetchCoursesAndConcepts = async () => {
    try {
      const token = await AsyncStorage.getItem("@user_token");
      const userId = await AsyncStorage.getItem("@user_id");

      if (!token || !userId) {
        Alert.alert("Erro", "Usuário não autenticado ou ID ausente.");
        setLoading(false);
        return;
      }

      // Busca a turma associada ao usuário
      const turmaResponse = await axios.get<
        { classId: string; className: string }[]
      >(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/relacionamento/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const turma = turmaResponse.data[0];
      if (!turma) {
        Alert.alert("Erro", "Usuário não está associado a nenhuma turma.");
        setLoading(false);
        return;
      }

      setClassName(turma.className); // Define o nome da turma no estado

      const coursesResponse = await axios.get<
        { courseId: string; user_class_courseId: string }[]
      >(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/turmas/classCourse/${turma.classId}`,
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

      const conceptsResponse = await axios.get<Concept[]>(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/conceitos/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userConcepts = conceptsResponse.data;

      const coursesWithConcepts: Course[] = allCourses.map((course) => {
        const associatedConcepts = userConcepts.filter(
          (c) => c.user_class_courseId === course.user_class_courseId
        );
        return {
          ...course,
          concept: associatedConcepts, // Armazena todos os conceitos associados à disciplina
        };
      });

      setCourses(coursesWithConcepts);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError("Erro ao carregar as disciplinas e conceitos.");
    } finally {
      setLoading(false);
    }
  };

  // Abre o modal para exibir os conceitos de uma disciplina
  const openConceptsModal = (concepts: Concept[]) => {
    if (concepts.length > 0) {
      setConcepts(concepts);
      setModalMessage("");
    } else {
      setConcepts([]);
      setModalMessage(
        "Essa disciplina ainda não teve seus conceitos cadastrados."
      );
    }
    setModalVisible(true);
  };

  // Função para traduzir unidade e resultado
  const translateConcept = (concept: Concept) => ({
    ...concept,
    unidade: concept.unidade === "UNIT1" ? "Unidade 1" : concept.unidade,
    result: concept.result === "APPROVED" ? "Aprovado" : "Reprovado",
  });

  useEffect(() => {
    fetchCoursesAndConcepts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#673AB7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mostra o nome da turma */}
      <Text style={styles.className}>Turma: {className}</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.user_class_courseId}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text style={styles.courseTitle}>{item.details.courseName}</Text>
            <Text style={styles.detailsText}>
              Descrição: {item.details.description}
            </Text>
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
                data={concepts.map(translateConcept)}
                keyExtractor={(item) => item.conceitoId}
                renderItem={({ item }) => (
                  <View style={styles.conceptItem}>
                    <Text style={styles.conceptText}>
                      Conceito: {item.conceito}
                    </Text>
                    <Text style={styles.conceptText}>
                      Unidade: {item.unidade}
                    </Text>
                    <Text style={styles.conceptText}>
                      Resultado: {item.result}
                    </Text>
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
    backgroundColor: "#FFF", 
    padding: 20 },

  className: {      /* TURMA */
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },

  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  
  courseItem: {
    backgroundColor: "#EDE7F6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  
  courseTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#673AB7" 
  },

  detailsText: { 
    fontSize: 14, 
    color: "#333" 
  },

  conceptButton: {
    backgroundColor: "#9747FF",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  buttonText: { 
    color: "#FFF", 
    textAlign: "center" 
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    width: "90%",
    backgroundColor: "#EBE1F7",
    padding: 16,
    borderRadius: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#292F47",
  },
  
  modalMessage: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    marginVertical: 10,
  },
  conceptItem: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  conceptText: { 
    fontSize: 14, 
    color: "#292F47" 
  },

  closeButton: {
    backgroundColor: "#9747FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: { 
    color: "#FFF", 
    fontWeight: "bold" 
  },

  error: { 
    fontSize: 16, 
    color: "#FF3B30" 
  },
});
