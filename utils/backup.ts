import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
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

export const backupDatabase = async (db: SQLiteDatabase) => {
  try {
    const usuariosResult: Usuario[] = await db.getAllAsync('SELECT * FROM usuarios');
    const categoriasResult: Categoria[] = await db.getAllAsync('SELECT * FROM categorias');
    const senhasResult: Senha[] = await db.getAllAsync('SELECT * FROM senhas');

    const backupData = {
      usuarios: usuariosResult,
      categorias: categoriasResult,
      senhas: senhasResult,
    };

    const json = JSON.stringify(backupData, null, 2);
    const fileUri = `${FileSystem.documentDirectory}backup_${Date.now()}.json`;

    await FileSystem.writeAsStringAsync(fileUri, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    Alert.alert('Sucesso', `Backup salvo em ${fileUri}`);
  } catch (error) {
    Alert.alert('Erro', 'Falha ao realizar backup.');
    console.error(error);
  }
};
