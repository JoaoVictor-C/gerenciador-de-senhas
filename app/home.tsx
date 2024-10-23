import React, { useContext } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter, Link } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function Home() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Bem-vindo ao Gerenciador de Senhas!</ThemedText>
      <View style={styles.buttonContainer}>
        <Link href="/categories" style={styles.link}>
          <ThemedText>Categorias</ThemedText>
        </Link>
        <Link href="/backup" style={styles.link}>
          <ThemedText>Backup</ThemedText>
        </Link>
        <Link href="/createPassword" style={styles.link}>
          <ThemedText>Criar Senha</ThemedText>
        </Link>
        <Link href="/generatePassword" style={styles.link}>
          <ThemedText>Gerar Senha</ThemedText>
        </Link>
        <Link href="/passwords" style={styles.link}>
          <ThemedText>Senhas</ThemedText>
        </Link>
        <Link href="/restore" style={styles.link}>
          <ThemedText>Restaurar</ThemedText>
        </Link>
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
  buttonContainer: {
    marginVertical: 20,
  },
  link: {
    marginVertical: 5,
  },
});
