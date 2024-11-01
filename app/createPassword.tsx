import React, { useState, useContext, useCallback } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Alert, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { checkPasswordStrength } from '@/utils/checkPasswordStrength';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/contexts/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

type Categoria = {
  id: number;
  nome: string;
  descricao: string;
  usuario_id: number;
};

export default function CreatePasswordScreen() {
  const [titulo, setTitulo] = useState('');
  const [senha, setSenha] = useState('');
  const [url, setURL] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [passwordStrength, setPasswordStrength] = useState<string>('');

  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const db = useSQLiteContext();

  const fetchCategories = async () => {
    if (!userId) return;
    try {
      const results: Categoria[] = await db.getAllAsync(
        'SELECT * FROM categorias WHERE usuario_id = ?',
        [userId]
      );
      setCategories(results);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar categorias.');
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [userId])
  );

  useFocusEffect(
    useCallback(() => {
      const strength = checkPasswordStrength(senha);
      setPasswordStrength(strength.feedback[0]);
    }, [senha])
  );

  const handleCreate = async () => {
    if (!userId) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    if (!titulo || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (passwordStrength === 'Fraca') {
      Alert.alert('Aviso', 'A senha é muito fraca. Considere torná-la mais forte.');
      return;
    }

    try {
      const results = await db.getAllAsync('SELECT * FROM senhas WHERE senha = ?', [senha]);

      if (results.length > 0) {
        Alert.alert('Aviso', 'Esta senha já está sendo usada em outra entrada.');
        return;
      }

      const selectedCategoryId = categoriaId;

      const result = await db.runAsync(
        `INSERT INTO senhas 
                    (titulo, senha, url, categoria_id, usuario_id) 
                    VALUES (?, ?, ?, ?, ?)`,
        [titulo, senha, url, selectedCategoryId, userId]
      );

      if (result.changes > 0) {
        Alert.alert('Sucesso', 'Senha criada com sucesso!');
        // Redirecionar ou limpar campos
        setTitulo('');
        setSenha('');
        setURL('');
        setCategoriaId(null);
        setPasswordStrength('');
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
      <ThemedText type="title" style={styles.title}>Criar Senha</ThemedText>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
        placeholderTextColor={Colors.light.text}
        returnKeyType="next"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
        placeholderTextColor={Colors.light.text}
        returnKeyType="next"
      />
      {senha.length > 0 && (
        <ThemedText style={[styles.passwordStrength, 
          passwordStrength === 'Forte' ? styles.strong :
          passwordStrength === 'Média' ? styles.medium : styles.weak
        ]}>
          Força da Senha: {passwordStrength}
        </ThemedText>
      )}
      <TextInput
        placeholder="URL"
        value={url}
        onChangeText={setURL}
        style={styles.input}
        placeholderTextColor={Colors.light.text}
        returnKeyType="next"
      />
      <View style={styles.categoryContainer}>
        <ThemedText style={styles.categoryLabel}>
          Categoria: {categoriaId ? categories.find(c => c.id === categoriaId)?.nome || 'Nenhuma' : 'Nenhuma'}
        </ThemedText>
        <Picker
          selectedValue={categoriaId}
          onValueChange={(itemValue) => setCategoriaId(itemValue)}
          style={styles.picker}
          dropdownIconColor={Colors.light.text}
          mode="dropdown"
        >
          <Picker.Item label="Nenhuma" value={null} />
          {categories.map(category => (
            <Picker.Item key={category.id} label={category.nome} value={category.id} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Ionicons name="lock-closed-outline" size={24} color={Colors.light.background} />
        <ThemedText style={styles.buttonText}>Criar Senha</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
    color: Colors.light.text,
  },
  input: {
    height: 50,
    borderColor: Colors.light.border,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    color: Colors.light.text,
    backgroundColor: Colors.light.card,
    fontSize: 16,
  },
  passwordStrength: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  weak: {
    color: '#FF4D4D',
  },
  medium: {
    color: '#FFA500',
  },
  strong: {
    color: '#4CAF50',
  },
  categoryContainer: {
    marginTop: 16,
  },
  categoryLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.text,
  },
  picker: {
    height: 50,
    width: '100%',
    color: Colors.light.text,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 30,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
