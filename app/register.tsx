import React, { useState, useContext } from 'react';
import { TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { register } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const success = await register(email, senha);
    if (success) {
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      router.replace('/home' as never);
    } else {
      Alert.alert('Erro', 'Falha no cadastro. Tente novamente.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Registrar</ThemedText>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={Colors.light.text}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
        placeholderTextColor={Colors.light.text}
      />
      <Button title="Registrar" onPress={handleRegister} color={Colors.light.tint} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  input: {
    height: 50,
    borderColor: Colors.light.border,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: Colors.light.text,
    backgroundColor: Colors.light.card,
  },
});
