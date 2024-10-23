import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';

type Senha = {
  id: number;
  titulo: string;
  usuario: string;
  senha: string;
  url: string;
  categoria_id: number;
  nota: string;
  criado_em: string;
  atualizado_em: string;
  usuario_id: number;
};

export default function PasswordListScreen() {
  const db = useSQLiteContext();
  const [senhas, setSenhas] = useState<Senha[]>([]);
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const fetchSenhas = async () => {
    if (!userId) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      const results: Senha[] = await db.getAllAsync('SELECT * FROM senhas WHERE usuario_id = ?', [userId]);
      setSenhas(results);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar senhas.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSenhas();
  }, [userId]);

  const handleDelete = async (id: number) => {
    try {
      await db.runAsync('DELETE FROM senhas WHERE id = ? AND usuario_id = ?', [id, userId as number]);
      Alert.alert('Sucesso', 'Senha deletada com sucesso!');
      fetchSenhas();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao deletar senha.');
      console.error(error);
    }
  };

  return (
    <ParallaxScrollView
      headerImage={<ThemedText type="title">Minhas Senhas</ThemedText>}
      headerBackgroundColor={{ light: Colors.light.background, dark: Colors.dark.background }}
    >
      <FlatList
        data={senhas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.senhaItem}>
            <ThemedText style={styles.titulo}>{item.titulo}</ThemedText>
            <ThemedText>Usuário: {item.usuario}</ThemedText>
            <ThemedText>Senha: {item.senha}</ThemedText>
            <ThemedText>URL: {item.url}</ThemedText>
            <ThemedText>Nota: {item.nota}</ThemedText>
            <Button title="Deletar" onPress={() => handleDelete(item.id)} color={Colors.light.tint} />
          </ThemedView>
        )}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  senhaItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
});
