import React, { useState, useContext } from 'react';
import { TextInput, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, View, Image } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const success = await login(email, senha);
    if (success) {
      Alert.alert('Sucesso', 'Bem-vindo!');
      router.replace('/home' as never);
    } else {
      Alert.alert('Erro', 'Email ou senha incorretos.');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedView style={[styles.content]}>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Login</ThemedText>
        <ThemedView style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { 
              backgroundColor: colors.inputBackground, 
              color: colors.text,
              borderColor: colors.border
            }]}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.text}
          />
          <TextInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            style={[styles.input, { 
              backgroundColor: colors.inputBackground, 
              color: colors.text,
              borderColor: colors.border
            }]}
            secureTextEntry
            placeholderTextColor={colors.text}
          />
        </ThemedView>
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: colors.tint }]} 
            onPress={handleLogin}
          >
            <ThemedText type="button" style={{ color: colors.buttonText }}>Login</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
            <ThemedText type="link" style={{ color: colors.link }}>
              Ainda não tem uma conta? Registre-se
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 10,
  },
});
