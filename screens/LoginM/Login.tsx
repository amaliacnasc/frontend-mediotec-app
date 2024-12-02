import React, { useState } from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewBase,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import logo from "../../assets/logo-mediotec.png";

// Tipagem específica para o Stack Navigator
type RootStackParamList = {
  Register: undefined;
  Tabs: { token: string };
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

function Login() {
  const [email, setEmail] = useState("ana.costa@teacher.com");
  const [password, setPassword] = useState("senha123");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Função para lidar com o login
  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Etapa 1: Requisição para autenticar o usuário
      const loginResponse = await axios.post(
        "https://api-mediotec-v2-teste.onrender.com/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = loginResponse.data;

      // Salvar o token no AsyncStorage
      await AsyncStorage.setItem("@user_token", token);

      // Etapa 2: Obter os dados do usuário com base no email
      const userResponse = await axios.get(
        `https://api-mediotec-v2-teste.onrender.com/mediotec/usuarios/email/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Resposta da API para o usuário:", userResponse.data);

      // Corrigindo para acessar o campo correto
      const { userId, userName } = userResponse.data;

      if (!userId) {
        throw new Error("ID do usuário não foi retornado pela API.");
      }

      // Salvar o ID no AsyncStorage
      await AsyncStorage.setItem("@user_id", userId);

      // Exibir mensagem de boas-vindas
      Alert.alert("Sucesso", `Bem-vindo, ${userName || "Usuário"}!`);

      // Navegar para a tela de Tabs com o token
      navigation.replace("Tabs", { token });
    } catch (error) {
      console.error("Erro no login:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          Alert.alert(
            "Erro",
            error.response.data.message || "Erro ao realizar login."
          );
        } else if (error.request) {
          Alert.alert("Erro", "Servidor não respondeu. Verifique sua conexão.");
        } else {
          Alert.alert("Erro", "Erro inesperado. Tente novamente.");
        }
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          outlineColor="#A4A4A4"
          style={styles.input}
        />
        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          outlineColor="#A4A4A4"
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.cta}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Button
          mode="contained"
          buttonColor="#9747FF"
          style={styles.button}
          onPress={handleLogin}
        >
          Login
        </Button>
      </View>
    </ScrollView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    bottom: 450,
  },
  logo: {
    width: 140,
    height: 61,
    marginBottom: 100
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "90%",
    marginBottom: 25,
  },
  button: {
    width: "90%",
    marginBottom: 25,
  },
  cta: {
    color: "#A4A4A4",
    fontSize: 14,
    marginTop: 0,
    marginBottom: 25,
  },
});
