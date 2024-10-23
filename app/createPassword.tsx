import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { checkPasswordStrength } from '@/utils/checkPasswordStrength';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';

export default function CreatePasswordScreen() {
  const [titulo, setTitulo] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [url, setURL] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [nota, setNota] = useState('');

  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const db = useSQLiteContext();

  const handleCreate = async () => {
    if (!titulo || !usuario || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!checkPasswordStrength(senha).isStrong) {
      Alert.alert('Senha Fraca', 'Por favor, utilize uma senha mais forte.');
      return;
    }

    try {
      const results = await db.getAllAsync('SELECT * FROM senhas WHERE senha = ?', [senha]);

      if (results.length > 0) {
        Alert.alert('Aviso', 'Esta senha já está sendo usada em outra entrada.');
        return;
      }

      const result = await db.runAsync(
        `INSERT INTO senhas 
        (titulo, usuario, senha, url, categoria_id, nota, usuario_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [titulo, usuario, senha, url, categoriaId, nota, userId as number]
      );

      if (result.changes > 0) {
        Alert.alert('Sucesso', 'Senha criada com sucesso!');
        // Redirecionar ou limpar campos
        setTitulo('');
        setUsuario('');
        setSenha('');
        setURL('');
        setCategoriaId(null);
        setNota('');
      } else {
        Alert.alert('Erro', 'Falha ao criar a senha.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar a senha.');
      console.error(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Criar Senha</ThemedText>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
        placeholderTextColor={Colors.light.text} // Updated placeholder color
      />
      <TextInput
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
        style={styles.input}
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
      <TextInput
        placeholder="URL"
        value={url}
        onChangeText={setURL}
        style={styles.input}
        placeholderTextColor={Colors.light.text}
      />
      <TextInput
        placeholder="Nota"
        value={nota}
        onChangeText={setNota}
        style={styles.input}
        placeholderTextColor={Colors.light.text}
      />
      <ThemedView style={styles.buttonContainer}>
        <Button title="Criar Senha" onPress={handleCreate} color={Colors.light.tint} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background, // Use themed background
  },
  input: {
    height: 50,
    borderColor: Colors.light.border, // Use themed border color
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: Colors.light.text, // Use themed text color
    backgroundColor: Colors.light.card, // Use themed card background
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
});
