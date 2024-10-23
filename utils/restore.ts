import { SQLiteDatabase } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';

type Usuario = {
  id: number;
  email: string;
  senha: string;
  criado_em: string;
};

type Categoria = {
  id: number;
  nome: string;
  descricao: string;
  usuario_id: number;
};

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
};

export const restoreDatabase = async (db: SQLiteDatabase) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
    });

    if (result.type === 'success') {
      const json = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const data = JSON.parse(json);

      // Backup current data before restoring
      await backupDatabase();

      // Clear existing data
      await db.runAsync('DELETE FROM senhas');
      await db.runAsync('DELETE FROM categorias');
      await db.runAsync('DELETE FROM usuarios');

      // Restore usuarios
      for (const usuario of data.usuarios) {
        await db.runAsync(
          'INSERT INTO usuarios (id, email, senha, criado_em) VALUES (?, ?, ?, ?)',
          [usuario.id, usuario.email, usuario.senha, usuario.criado_em]
        );
      }

      // Restore categorias
      for (const categoria of data.categorias) {
        await db.runAsync(
          'INSERT INTO categorias (id, nome, descricao, usuario_id) VALUES (?, ?, ?, ?)',
          [categoria.id, categoria.nome, categoria.descricao, categoria.usuario_id]
        );
      }

      // Restore senhas
      for (const senha of data.senhas) {
        await db.runAsync(
          `INSERT INTO senhas 
          (id, titulo, usuario, senha, url, categoria_id, nota, criado_em, atualizado_em) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            senha.id,
            senha.titulo,
            senha.usuario,
            senha.senha,
            senha.url,
            senha.categoria_id,
            senha.nota,
            senha.criado_em,
            senha.atualizado_em,
          ]
        );
      }

      Alert.alert('Sucesso', 'Dados restaurados com sucesso!');
    } else {
      Alert.alert('Cancelado', 'Operação de restauração cancelada.');
    }
  } catch (error) {
    Alert.alert('Erro', 'Falha ao realizar restauração.');
    console.error(error);
  }
};
