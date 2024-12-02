import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NotificationM from "./screens/NotificationM/NotificationM";
import HomeM from "./screens/HomeM/HomeM"; // Adicionado
import Login from "./screens/LoginM/Login";
import MyCourses from "./screens/Courses/MyCourses";
import MyProfile from "./screens/Profile/MyProfile";
import Payments from "./screens/Payments/PaymentsScreen";
import ContactInfo from "./screens/ContactInfo/ContactInfo";
import Timetable from "./screens/timetable/Timetable";

// Tipagem para as props do TabNavigator
type TabNavigatorProps = {
  route: { name: keyof typeof screenOptions };
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Mapeamento de telas e ícones
const screenOptions = {
  Home: "home",
  Disciplinas: "book",
  Conceitos: "school",
  Notificações: "notifications",
  Login: "description",
  Perfil: "person",
};

function TabNavigator() {
  const [userData, setUserData] = useState({ name: "" });

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("@user_token");
      const userId = await AsyncStorage.getItem("@user_id");

      if (token && userId) {
        const response = await axios.get(
          `https://api-mediotec-v2-teste.onrender.com/mediotec/usuarios/id/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData({ name: response.data.userName });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const iconName =
          screenOptions[route.name as keyof typeof screenOptions];
        return {
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: "#9747FF",
          tabBarInactiveTintColor: "#AEB3BE",
          tabBarStyle: styles.tabBar,
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeM}
        options={{
          headerTitle: () => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("./assets/logo-mediotec.png")}
                style={{
                  width: 150,
                  height: 60,
                  resizeMode: "contain",
                  marginTop: 8,
                }}
              />
              <Text
                style={{
                  marginTop: 40,
                  fontSize: 18,
                  color: "#FFF",
                }}
              >
                Bem-vindo(a), {userData.name || "Usuário"}
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: "#9747FF",
            height: 200,
            borderBottomRightRadius: 60,
            borderBottomLeftRadius: 60,
          },
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen name="Disciplinas" component={MyCourses} />
      <Tab.Screen name="Notificações" component={NotificationM} />
      <Tab.Screen name="Perfil" component={MyProfile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationM" component={NotificationM} options={{ headerTitle: "Notificações" }} />
          <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="PaymentsScreen" component={Payments} options={{ title: "Pagamentos" }} />
          <Stack.Screen name="Timetable" component={Timetable} options={{ title: "Horários" }} />
          <Stack.Screen name="ContactInfo" component={ContactInfo} options={{ title: "Contatos" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    height: 90,
    paddingTop: 18,
  },
});
