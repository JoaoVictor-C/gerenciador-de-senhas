import React, { useState } from 'react';
import { View, Button, StyleSheet, TextInput, Switch, Text, Alert } from 'react-native';
import { generatePassword } from '@/utils/generatePassword';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

type Props = {
  onGenerate: (password: string) => void;
};

export const PasswordGenerator: React.FC<Props> = ({ onGenerate }) => {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);

  const handleGenerate = () => {
    if (length < 8) {
      Alert.alert('Erro', 'O comprimento da senha deve ser pelo menos 8 caracteres.');
      return;
    }
    const newPassword = generatePassword(length, {
      uppercase: includeUppercase,
      numbers: includeNumbers,
      symbols: includeSymbols,
    });
    onGenerate(newPassword);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.option}>
        <ThemedText style={styles.label}>Comprimento:</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: Colors.light.card, color: Colors.light.text, borderColor: Colors.light.border }]}
          keyboardType="number-pad"
          value={length.toString()}
          onChangeText={(text) => setLength(parseInt(text) || 0)}
          placeholder="8"
          placeholderTextColor={Colors.light.text}
        />
      </ThemedView>
      <ThemedView style={styles.option}>
        <ThemedText style={styles.label}>Incluir Maiúsculas</ThemedText>
        <Switch
          value={includeUppercase}
          onValueChange={setIncludeUppercase}
          trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
          thumbColor={includeUppercase ? Colors.light.background : Colors.light.background}
        />
      </ThemedView>
      <ThemedView style={styles.option}>
        <ThemedText style={styles.label}>Incluir Números</ThemedText>
        <Switch
          value={includeNumbers}
          onValueChange={setIncludeNumbers}
          trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
          thumbColor={includeNumbers ? Colors.light.background : Colors.light.background}
        />
      </ThemedView>
      <ThemedView style={styles.option}>
        <ThemedText style={styles.label}>Incluir Símbolos</ThemedText>
        <Switch
          value={includeSymbols}
          onValueChange={setIncludeSymbols}
          trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
          thumbColor={includeSymbols ? Colors.light.background : Colors.light.background}
        />
      </ThemedView>
      <Button title="Gerar Senha" onPress={handleGenerate} color={Colors.light.tint} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
    backgroundColor: Colors.light.background,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 10,
    borderRadius: 4,
    width: 60,
    textAlign: 'center',
  },
});
