import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { backupDatabase } from '@/utils/backup';
import { useSQLiteContext } from 'expo-sqlite';
import { Colors } from '@/constants/Colors';

export default function BackupScreen() {
  const db = useSQLiteContext();

  const handleBackup = async () => {
    try {
      await backupDatabase(db);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao realizar backup.');
      console.error(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Backup de Dados</ThemedText>
      <ThemedView style={styles.buttonContainer}>
        <Button title="Realizar Backup" onPress={handleBackup} color={Colors.light.tint} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
});
