import React, { useState, useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

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
  const [selectedSenha, setSelectedSenha] = useState<Senha | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedSenha, setEditedSenha] = useState<Senha | null>(null);

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

  useFocusEffect(
    React.useCallback(() => {
      fetchSenhas();
    }, [userId])
  );

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta senha?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.runAsync('DELETE FROM senhas WHERE id = ? AND usuario_id = ?', [id, userId as number]);
              Alert.alert('Sucesso', 'Senha excluída com sucesso!');
              fetchSenhas();
              setModalVisible(false);
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir senha.');
              console.error(error);
            }
          }
        },
      ]
    );
  };

  const handleSenhaPress = (senha: Senha) => {
    setSelectedSenha(senha);
    setEditedSenha(senha);
    setModalVisible(true);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!editedSenha) return;

    try {
      await db.runAsync(
        'UPDATE senhas SET titulo = ?, usuario = ?, senha = ?, url = ?, nota = ? WHERE id = ? AND usuario_id = ?',
        [editedSenha.titulo, editedSenha.usuario, editedSenha.senha, editedSenha.url, editedSenha.nota, editedSenha.id, userId as number]
      );
      Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
      fetchSenhas();
      setEditMode(false);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar senha.');
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: Senha }) => (
    <TouchableOpacity onPress={() => handleSenhaPress(item)}>
      <ThemedView style={styles.senhaItem}>
        <View style={styles.senhaHeader}>
          <ThemedText style={styles.titulo}>{item.titulo}</ThemedText>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={24} color={Colors.light.tint} />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.senhaInfo}>Clique para ver detalhes</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  const renderModalContent = () => (
    <FlatList
      data={[selectedSenha]}
      keyExtractor={(item) => item?.id.toString() || ''}
      renderItem={({ item }) => (
        <>
          {editMode ? (
            <>
              <TextInput
                style={styles.input}
                value={editedSenha?.titulo}
                onChangeText={(text) => setEditedSenha(prev => ({ ...prev!, titulo: text }))}
                placeholder="Título"
              />
              <TextInput
                style={styles.input}
                value={editedSenha?.senha}
                onChangeText={(text) => setEditedSenha(prev => ({ ...prev!, senha: text }))}
                placeholder="Senha"
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                value={editedSenha?.url}
                onChangeText={(text) => setEditedSenha(prev => ({ ...prev!, url: text }))}
                placeholder="URL"
              />
            </>
          ) : (
            <>
              <ThemedText style={styles.modalTitle}>{item?.titulo}</ThemedText>
              <View style={styles.modalField}>
                <ThemedText style={styles.modalLabel}>Senha:</ThemedText>
                <ThemedText style={styles.modalText}>{item?.senha}</ThemedText>
              </View>
              {item?.url && (
                <View style={styles.modalField}>
                  <ThemedText style={styles.modalLabel}>URL:</ThemedText>
                  <ThemedText style={styles.modalText}>{item.url}</ThemedText>
                </View>
              )}
            </>
          )}
        </>
      )}
      ListFooterComponent={
        <View style={styles.buttonContainer}>
          {editMode ? (
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <ThemedText style={styles.buttonText}>Salvar</ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <ThemedText style={styles.buttonText}>Editar</ThemedText>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(selectedSenha!.id)}>
            <ThemedText style={styles.buttonText}>Excluir</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
            <ThemedText style={styles.buttonText}>Fechar</ThemedText>
          </TouchableOpacity>
        </View>
      }
    />
  );

  return (
    <>
      <FlatList
        ListHeaderComponent={<ThemedText type="title" style={styles.headerTitle}>Minhas Senhas</ThemedText>}
        data={senhas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            {renderModalContent()}
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  senhaItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.light.card,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  senhaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  senhaInfo: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
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
  modalField: {
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.light.text,
  },
  modalText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  input: {
    height: 40,
    borderColor: Colors.light.border,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: Colors.light.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: Colors.light.error,
  },
  buttonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
