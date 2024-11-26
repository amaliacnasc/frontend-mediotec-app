import React from 'react';
import { View, Image, StyleSheet, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Timetable() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Horários</Text>
      <Image
        source={require('../../assets/horario.png')} // Substitua pelo caminho correto da imagem
        style={styles.image}
        resizeMode="contain"
      />
      <Button
        mode="contained"
        buttonColor="#7326BF"
        style={styles.button}
        onPress={() => navigation.goBack()} // Retorna ao perfil
      >
        Voltar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7326BF',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 400, // Ajuste conforme necessário
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    width: '50%',
    borderRadius: 20,
  },
});
