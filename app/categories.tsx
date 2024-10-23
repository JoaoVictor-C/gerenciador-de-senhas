import React, { useEffect, useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSQLiteContext } from 'expo-sqlite';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';

type Categoria = {
  id: number;
  nome: string;
  descricao: string;
  usuario_id: number;
};

export default function CategoriesScreen() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const db = useSQLiteContext();

  const fetchCategorias = async () => {
    try {
      const results: Categoria[] = await db.getAllAsync(
        'SELECT * FROM categorias WHERE usuario_id = ?',
        [userId as number]
      );
      setCategorias(results);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar categorias.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCategorias();
    }
  }, [userId]);

  const handleCreate = async () => {
    if (!nome) {
      Alert.alert('Erro', 'Por favor, preencha o nome da categoria.');
      return;
    }

    try {
      await db.runAsync(
        'INSERT INTO categorias (nome, descricao, usuario_id) VALUES (?, ?, ?)',
        [nome, descricao, userId as number]
      );
      Alert.alert('Sucesso', 'Categoria criada com sucesso!');
      setNome('');
      setDescricao('');
      fetchCategorias();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar categoria.');
      console.error(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        placeholder="Nome da Categoria"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholderTextColor={Colors.light.text}
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
        placeholderTextColor={Colors.light.text}
      />
      <Button title="Criar Categoria" onPress={handleCreate} color={Colors.light.tint} />
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.categoriaItem}>
            <ThemedText>{item.nome}</ThemedText>
            <ThemedText>{item.descricao}</ThemedText>
            {/* Implementar edição e exclusão */}
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  categoriaItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
});
