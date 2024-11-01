import React, { useEffect, useState, useContext } from 'react';
import { View, TextInput, StyleSheet, FlatList, Alert, TouchableOpacity, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSQLiteContext } from 'expo-sqlite';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

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
    if (!nome.trim()) {
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

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmar Deleção',
      'Você tem certeza que deseja deletar esta categoria?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Deletar', style: 'destructive', onPress: () => confirmDelete(id) },
      ]
    );
  };

  const confirmDelete = async (id: number) => {
    try {
      await db.runAsync('DELETE FROM categorias WHERE id = ?', [id]);
      Alert.alert('Sucesso', 'Categoria deletada com sucesso!');
      fetchCategorias();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao deletar categoria.');
      console.error(error);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCategoria) return;

    try {
      await db.runAsync(
        'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ? AND usuario_id = ?',
        [editingCategoria.nome, editingCategoria.descricao, editingCategoria.id, userId as number]
      );
      Alert.alert('Sucesso', 'Categoria atualizada com sucesso!');
      setModalVisible(false);
      fetchCategorias();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar categoria.');
      console.error(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Gerenciar Categorias</ThemedText>
      <View style={styles.form}>
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
          style={[styles.input, styles.textArea]}
          placeholderTextColor={Colors.light.text}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Ionicons name="add-circle" size={24} color={Colors.light.background} />
          <ThemedText style={styles.buttonText}>Criar Categoria</ThemedText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.categoriaItem}>
            <View style={styles.categoriaInfo}>
              <ThemedText style={styles.categoriaNome}>{item.nome}</ThemedText>
              <ThemedText style={styles.categoriaDescricao}>{item.descricao}</ThemedText>
            </View>
            <View style={styles.categoriaActions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Ionicons name="pencil" size={20} color={Colors.light.tint} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash" size={20} color={Colors.light.tint} />
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>Nenhuma categoria encontrada.</ThemedText>
        }
        contentContainerStyle={categorias.length === 0 && styles.emptyContainer}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <ThemedText style={styles.modalTitle}>Editar Categoria</ThemedText>
            <TextInput
              style={styles.input}
              value={editingCategoria?.nome}
              onChangeText={(text) => setEditingCategoria(prev => ({ ...prev!, nome: text }))}
              placeholder="Nome da Categoria"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editingCategoria?.descricao}
              onChangeText={(text) => setEditingCategoria(prev => ({ ...prev!, descricao: text }))}
              placeholder="Descrição"
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
                <ThemedText style={styles.buttonText}>Salvar</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderColor: Colors.light.border,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: Colors.light.text,
    backgroundColor: Colors.light.card,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.light.background,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  categoriaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.card,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriaInfo: {
    flex: 1,
    paddingRight: 8,
  },
  categoriaNome: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  categoriaDescricao: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 4,
  },
  categoriaActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.light.text,
    fontSize: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 20,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.light.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: Colors.light.error,
  },
});