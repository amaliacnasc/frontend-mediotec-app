import { ScrollView, Text, View, StyleSheet, Alert } from 'react-native';
import * as React from 'react';
import { Avatar, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function MyProfile() {
  const [userData, setUserData] = React.useState({
    name: '',
    email: '',
    className: '',
    avatarUrl: '',
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Função para buscar os dados do usuário
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      const userId = await AsyncStorage.getItem('@user_id');
      
      if (!token || !userId) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }

      // Faz a requisição para pegar os dados do usuário
      const response = await axios.get(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/usuarios/id/${userId}`, // Ajuste a URL conforme o seu backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = response.data;

      // Supondo que a resposta tenha os campos name, email, turma (className) e avatarUrl
      setUserData({
        name: user.userName,
        email: user.email,
        className: user.className,
        avatarUrl: user.avatarUrl || '', // Caso o avatar esteja em URL, senão utilize a imagem padrão
      });
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setError('Erro ao carregar os dados do usuário.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o componente monta
  React.useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
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
    <ScrollView contentContainerStyle={styles.container}>
      <IconButton
        icon="cog"
        size={28}
        onPress={() => {
          // Ação ao clicar no ícone de configurações
        }}
        style={styles.iconSettings}
        iconColor="#7326BF"
      />
      <View style={styles.profileContainer}>
        {/* Avatar com fallback para imagem padrão */}
        <Avatar.Image
          size={250}
          source={userData.avatarUrl ? { uri: userData.avatarUrl } : require('../../assets/student1.jpg')}
          style={styles.avatar}
        />
        <Text style={styles.nameText}>{userData.name || 'Nome não disponível'}</Text>
        <Text style={styles.emailText}>{userData.email || 'Email não disponível'}</Text>
   
        <View style={styles.buttonContainer}>
          <Button icon="calendar-month" mode="contained" buttonColor="#7326BF" style={styles.button}>
            Horários
          </Button>
          <Button icon="credit-card-outline" mode="contained" buttonColor="#7326BF" style={styles.button}>
            Pagamentos
          </Button>
          <Button mode="contained" buttonColor='#7326BF' style={styles.button}>Contatos</Button>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9F9F9', // Fundo claro e agradável
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF', // Fundo branco para destaque
    borderRadius: 10,
    elevation: 5, // Sombra para realce
    padding: 20,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#7326BF', // Borda roxa para destaque
  },
  nameText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333333', // Cor de texto sutil e moderna
  },
  emailText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888888',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column', // Botões em coluna
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    width: '90%',
    marginVertical: 10,
    borderRadius: 20,
    paddingVertical: 10,
    marginTop:5,
  },
  iconSettings: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 30,
    elevation: 5, // Sombra para o ícone
  },
  error: {
    fontSize: 16,
    color: '#FF3B30', // Cor vermelha marcante para erros
    textAlign: 'center',
  },
});