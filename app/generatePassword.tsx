import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { PasswordGenerator } from '@/components/PasswordGenerator';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function GeneratePasswordScreen() {
  const [password, setPassword] = useState('');

  const handleGenerate = (generatedPassword: string) => {
    setPassword(generatedPassword);
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(password);
      Alert.alert('Sucesso', 'Senha copiada para a área de transferência.');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao copiar a senha.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Gerador de Senha Forte
        </ThemedText>
        <PasswordGenerator onGenerate={handleGenerate} />
        {password !== '' && (
          <View style={styles.passwordContainer}>
            <ThemedText style={styles.passwordLabel}>Sua Senha:</ThemedText>
            <View style={styles.passwordBox}>
              <ThemedText style={styles.password}>{password}</ThemedText>
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <Ionicons 
                name="copy-outline" 
                size={20} 
                color={Colors.light.background} 
              />
              <ThemedText style={styles.copyButtonText}>Copiar</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
  },
  passwordLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 20,
  },
  passwordBox: {
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  password: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
  },
  copyButtonText: {
    color: Colors.light.background,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
