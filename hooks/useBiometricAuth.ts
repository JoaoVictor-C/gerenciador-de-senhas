import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export const authenticate = async (): Promise<boolean> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    Alert.alert('Erro', 'Biometria não suportada neste dispositivo.');
    return false;
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    Alert.alert('Erro', 'Nenhuma biometria registrada.');
    return false;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Autenticação Biométrica',
    fallbackLabel: 'Use a senha',
  });

  if (result.success) {
    return true;
  } else {
    Alert.alert('Erro', 'Falha na autenticação.');
    return false;
  }
};