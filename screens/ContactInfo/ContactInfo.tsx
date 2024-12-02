import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { IconButton } from 'react-native-paper';

// Tipagem para o componente
interface ContactInfoProps {}

const ContactInfo: React.FC<ContactInfoProps> = () => {
  // Função para chamar o número de telefone
  const handlePhonePress = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch((err) => console.error('Erro ao tentar abrir o discador', err));
  };

  // Função para abrir o e-mail no cliente de e-mail
  const handleEmailPress = (email: string) => {
    const emailUrl = `mailto:${email}`;
    Linking.openURL(emailUrl).catch((err) => console.error('Erro ao tentar abrir o cliente de e-mail', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          onPress={() => {}}
          style={styles.iconBack}
          iconColor="#7326BF"
        />
        <Text style={styles.title}>Contatos</Text>
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Telefone</Text>
        <TouchableOpacity onPress={() => handlePhonePress('81999999999')}>
          <Text style={styles.contactText}>+55 (81) 99999-9999</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>E-mail</Text>
        <TouchableOpacity onPress={() => handleEmailPress('contato@senac.com')}>
          <Text style={styles.contactText}>contato@senac.com</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBack: {
    backgroundColor: '#F2F2F2',
    borderRadius: 30,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#7326BF',
    marginLeft: 10,
  },
  contactContainer: {
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  contactText: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
  },
});

export default ContactInfo;
