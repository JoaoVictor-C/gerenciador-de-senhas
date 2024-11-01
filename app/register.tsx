import React, { useState, useContext } from 'react';
import { TextInput, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { checkPasswordStrength } from '@/utils/checkPasswordStrength';
import { useColorScheme } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const { register } = useContext(AuthContext);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleRegister = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const strength = checkPasswordStrength(senha);
    if (!strength.isStrong) {
      Alert.alert('Senha Fraca', 'Por favor, escolha uma senha mais forte.');
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

  const handlePasswordChange = (text: string) => {
    setSenha(text);
    const strength = checkPasswordStrength(text);
    setPasswordStrength(strength.feedback[0] || '');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedView style={[styles.content]}>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Registrar</ThemedText>
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
            onChangeText={handlePasswordChange}
            style={[styles.input, { 
              backgroundColor: colors.inputBackground, 
              color: colors.text,
              borderColor: colors.border
            }]}
            secureTextEntry
            placeholderTextColor={colors.text}
          />
          {passwordStrength && (
            <ThemedText style={[styles.passwordStrength, { color: colors.tint }]}>{passwordStrength}</ThemedText>
          )}
        </ThemedView>
        <TouchableOpacity 
          style={[styles.registerButton, { backgroundColor: colors.tint }]} 
          onPress={handleRegister}
        >
          <ThemedText type="button" style={{ color: colors.buttonText }}>Registrar</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
          <ThemedText type="link" style={{ color: colors.link }}>Já tem uma conta? Faça login</ThemedText>
        </TouchableOpacity>
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
  passwordStrength: {
    marginTop: -12,
    marginBottom: 16,
    fontSize: 14,
  },
  registerButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginLink: {
    marginTop: 10,
  },
});
