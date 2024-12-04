import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from "react-native";

const ContactInfo: React.FC = () => {
  const contacts = [
    {
      name: "Contato Mediotec",
      phone: "(81)3233-8999",
      email: "mediotec@edu.senac.com",
      color: "#FFA5A5", // Cor para o círculo
    },
    {
      name: "Coordenação",
      phone: "(81)3233-8999",
      email: "mediotec@edu.senac.com",
      color: "#A5C8FF",
    },
    {
      name: "Diretoria",
      phone: "(81)3233-8999",
      email: "mediotec@edu.senac.com",
      color: "#FFD9A5",
    },
    {
      name: "Atendimento",
      phone: "(81)3233-8999",
      email: "mediotec@edu.senac.com",
      color: "#D8A5FF",
    },
  ];

  const handlePhonePress = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.error("Erro ao tentar abrir o discador", err)
    );
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch((err) =>
      console.error("Erro ao tentar abrir o cliente de e-mail", err)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {contacts.map((contact, index) => (
        <View key={index} style={styles.contactContainer}>
          <View style={styles.headerRow}>
            <View
              style={[styles.circle, { backgroundColor: contact.color }]}
            >
              <Text style={styles.circleText}>
                {contact.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </Text>
            </View>
            <Text style={styles.contactName}>{contact.name}</Text>
          </View>
          <Text style={styles.contactLabel}>Telefone:</Text>
          <TouchableOpacity onPress={() => handlePhonePress(contact.phone)}>
            <Text style={styles.contactText}>{contact.phone}</Text>
          </TouchableOpacity>
          <Text style={styles.contactLabel}>Email:</Text>
          <TouchableOpacity onPress={() => handleEmailPress(contact.email)}>
            <Text style={styles.contactText}>{contact.email}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  contactContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  circleText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginTop: 5,
  },
  contactText: {
    fontSize: 16,
    color: "#007AFF",
    marginTop: 3,
  },
});

export default ContactInfo;
