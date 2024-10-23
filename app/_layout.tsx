import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '@/hooks/useSQLite';
import { AuthProvider, AuthContext } from '@/contexts/AuthContext';
import React, { useContext } from 'react';

const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  await initializeDatabase(db);
};

const AuthStack = () => (
  <Stack>
    <Stack.Screen name="login" options={{ headerShown: false }} />
    <Stack.Screen name="register" options={{ title: 'Registrar' }} />
    <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
  </Stack>
);

const AppStack = () => (
  <Stack>
    <Stack.Screen name="home" options={{ title: 'Home' }} />
    <Stack.Screen name="passwords" options={{ title: 'Minhas Senhas' }} />
    <Stack.Screen name="createPassword" options={{ title: 'Criar Senha' }} />
    <Stack.Screen name="backup" options={{ title: 'Backup' }} />
    <Stack.Screen name="restore" options={{ title: 'Restaurar' }} />
    <Stack.Screen name="categories" options={{ title: 'Categorias' }} />
    <Stack.Screen name="generatePassword" options={{ title: 'Gerar Senha Forte' }} />
    <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
  </Stack>
);

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="gerenciador_senhas.db" onInit={migrateDbIfNeeded}>
      <AuthProvider>
        <ThemedView style={styles.container}>
          <AuthNavigator />
        </ThemedView>
      </AuthProvider>
    </SQLiteProvider>
  );
}

const AuthNavigator = () => {
  const { user } = useContext(AuthContext);

  return user ? <AppStack /> : <AuthStack />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});