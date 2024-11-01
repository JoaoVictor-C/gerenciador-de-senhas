import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '@/hooks/useSQLite';
import { AuthProvider, AuthContext } from '@/contexts/AuthContext';
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './home';
import PasswordsScreen from './passwords';
import CategoriesScreen from './categories';
import GeneratePasswordScreen from './generatePassword';
import BackupScreen from './backup';
import RestoreScreen from './restore';
import CreatePasswordScreen from './createPassword';
 
const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  await initializeDatabase(db);
};

const AuthStack = () => (
  <Stack initialRouteName="login">
    <Stack.Screen name="login" options={{ headerShown: false }} />
    <Stack.Screen name="register" options={{ title: 'Registrar' }} />
  </Stack>
);

const Tab = createBottomTabNavigator();

const AppStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'passwords') {
          iconName = focused ? 'key' : 'key-outline';
        } else if (route.name === 'categories') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'generatePassword') {
          iconName = focused ? 'create' : 'create-outline';
        } else if (route.name === 'backup') {
          iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
        } else if (route.name === 'restore') {
          iconName = focused ? 'cloud-download' : 'cloud-download-outline';
        } else if (route.name === 'createPassword') {
          iconName = focused ? 'add' : 'add-outline';
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="home" options={{ title: 'Home' }} component={HomeScreen} />
    <Tab.Screen name="passwords" options={{ title: 'Minhas Senhas' }} component={PasswordsScreen} />
    <Tab.Screen name="createPassword" options={{ title: 'Criar Senha' }} component={CreatePasswordScreen} />
    <Tab.Screen name="categories" options={{ title: 'Categorias' }} component={CategoriesScreen} />
    <Tab.Screen name="generatePassword" options={{ title: 'Gerar Senha' }} component={GeneratePasswordScreen} />
    <Tab.Screen name="backup" options={{ title: 'Backup' }} component={BackupScreen} />
    <Tab.Screen name="restore" options={{ title: 'Restaurar' }} component={RestoreScreen} />
  </Tab.Navigator>
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