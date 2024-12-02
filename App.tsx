import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';
import NotificationM from './screens/NotificationM/NotificationM';
import HomeM from './screens/HomeM/HomeM';// Adicionado
import Login from './screens/LoginM/Login';
import MyCourses from './screens/Courses/MyCourses';
import MyProfile from './screens/Profile/MyProfile';
import ContactInfo from './screens/ContactInfo/ContactInfo';
import Timetable from './screens/timetable/Timetable';

// Tipagem para as props do TabNavigator
type TabNavigatorProps = {
  route: { name: keyof typeof screenOptions };
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Mapeamento de telas e ícones
const screenOptions = {
  Home: 'home',
  Disciplinas: 'book',
  Conceitos: 'school',
  Notificações: 'notifications',
  Login: 'description',
  Perfil: 'person',
};

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const iconName = screenOptions[route.name as keyof typeof screenOptions];
        return {
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: styles.tabBar, // Aplica o estilo de fundo
        };
      }}
    >
      {/* Tela inicial com "Últimos Avisos" */}
      <Tab.Screen
        name="Home"
        component={HomeM} // Usando LatestNotifications
        options={{
          headerTitle: 'Últimos Avisos', // Título no cabeçalho
          headerStyle: { backgroundColor: '#7326BF' }, // Estilo do cabeçalho
          headerTintColor: '#FFFFFF', // Cor do texto no cabeçalho
        }}
      />
      <Tab.Screen
        name="Disciplinas"
        component={MyCourses}
        options={{
          headerTitle: 'Minhas Disciplinas',
        }}
      />
      <Tab.Screen
        name="Notificações"
        component={NotificationM}
        options={{
          headerTitle: 'Todas as Notificações',
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={MyProfile}
        options={{
          headerTitle: 'Meu Perfil',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* Tela de Login */}
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }} // Oculta o cabeçalho na tela de login
          />
               <Stack.Screen
            name="NotificationM"
            component={NotificationM}
            options={{
              headerTitle: 'Notificações',
              headerStyle: { backgroundColor: '#7326BF' },
              headerTintColor: '#FFFFFF',
            }}
          />
          {/* Abas principais */}
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
         
          {/* Tela de Horários */}
          <Stack.Screen
            name="Timetable"
            component={Timetable}
            options={{ title: 'Horários', headerShown: true }}
          />
          {/* Tela de Horários */}
          <Stack.Screen
            name="ContactInfo"
            component={ContactInfo}
            options={{ title: 'ContactInfo', headerShown: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// Estilos
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#7326BF', // Cor de fundo da tab
  },
  tabBarIcon: {
    color: '#FFFFFF', // Cor dos ícones
  },
});
