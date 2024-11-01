import React, { useState } from 'react';
import { StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { restoreDatabase } from '@/utils/restore';
import { useSQLiteContext } from 'expo-sqlite';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function RestoreScreen() {
  const db = useSQLiteContext();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await restoreDatabase(db);
      Alert.alert('Sucesso', 'Restauração concluída com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao realizar restauração.');
      console.error(error);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Ionicons name="cloud-download-outline" size={80} color={Colors.light.tint} style={styles.icon} />
      <ThemedText type="title" style={styles.title}>Restaurar Dados</ThemedText>
      <ThemedText style={styles.description}>
        Restaure seus dados a partir do último backup realizado. Isso substituirá todos os dados atuais.
      </ThemedText>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRestore}
        disabled={isRestoring}
      >
        {isRestoring ? (
          <ActivityIndicator color={Colors.light.background} />
        ) : (
          <ThemedText style={styles.buttonText}>Restaurar Backup</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    color: Colors.light.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
