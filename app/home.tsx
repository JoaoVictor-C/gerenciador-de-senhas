import React, { useContext } from 'react';
import { Button, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AuthContext } from '@/contexts/AuthContext';
import { Href, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function Home() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const navigateTo = (path: string) => {
    router.push(path as Href<string>);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Gire a chavinha!</ThemedText>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/categories')}>
          <ThemedText style={styles.cardText}>Criar uma categoria</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/passwords')}>
          <ThemedText style={styles.cardText}>Ver senhas</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/createPassword')}>
          <ThemedText style={styles.cardText}>Criar Senha</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/generatePassword')}>
          <ThemedText style={styles.cardText}>Gerar Senha</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/backup')}>
          <ThemedText style={styles.cardText}>Backup</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/restore')}>
          <ThemedText style={styles.cardText}>Restaurar</ThemedText>
        </TouchableOpacity>
      </View>
      <Button title="Logout" onPress={handleLogout} color={Colors.light.tint} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  cardContainer: {
    marginVertical: 20,
    width: '100%',
  },
  card: {
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.25, // For iOS shadow
    shadowRadius: 3.84, // For iOS shadow
  },
  cardText: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center',
  },
});
