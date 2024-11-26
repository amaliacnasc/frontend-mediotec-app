import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';
import NotificationM from './screens/NotificationM/NotificationM';
import Login from './screens/LoginM/Login';
import MyCourses from './screens/Courses/MyCourses';
import MyProfile from './screens/Profile/MyProfile';


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
  Perfil: 'person'
};



function TabNavigator() {
  return (

    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const iconName = screenOptions[route.name as keyof typeof screenOptions];
        return {
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={iconName} size={size} color="#FFFFFF" />
          ),
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: styles.tabBar, // Aplica o estilo de fundo
        };
      }}
    >
      <Tab.Screen name="Home" component={() => null} />
 
      <Tab.Screen name="Disciplinas" component={MyCourses} />
      <Tab.Screen name="Notificações" component={NotificationM} />
      <Tab.Screen name="Login" component={Login} />
      <Tab.Screen name="Perfil" component={ MyProfile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
       
        <Stack.Navigator>
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
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