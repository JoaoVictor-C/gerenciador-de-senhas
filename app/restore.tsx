import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { restoreDatabase } from '@/utils/restore';
import { useSQLiteContext } from 'expo-sqlite';
import { Colors } from '@/constants/Colors';

export default function RestoreScreen() {
  const db = useSQLiteContext();

  const handleRestore = async () => {
    try {
      await restoreDatabase(db);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao realizar restauração.');
      console.error(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Restaurar Dados</ThemedText>
      <ThemedView style={styles.buttonContainer}>
        <Button title="Restaurar Backup" onPress={handleRestore} color={Colors.light.tint} />
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
