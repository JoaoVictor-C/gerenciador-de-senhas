import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { PasswordGenerator } from '@/components/PasswordGenerator';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export default function GeneratePasswordScreen() {
  const [password, setPassword] = useState('');

  const handleGenerate = (generatedPassword: string) => {
    setPassword(generatedPassword);
  };

  const handleCopy = () => {
    // Implement copy to clipboard functionality
    // You can use 'expo-clipboard' for this purpose
    Alert.alert('Sucesso', 'Senha copiada para a área de transferência.');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Gerador de Senha Forte</ThemedText>
      <PasswordGenerator onGenerate={handleGenerate} />
      {password !== '' && (
        <>
          <ThemedText style={styles.passwordLabel}>Sua Senha:</ThemedText>
          <ThemedText style={styles.password}>{password}</ThemedText>
          <Button title="Copiar" onPress={handleCopy} color={Colors.light.tint} />
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  passwordLabel: {
    marginTop: 20,
    fontSize: 18,
    color: Colors.light.text,
  },
  password: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
    width: '80%',
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: Colors.light.card,
    color: Colors.light.text,
  },
});
