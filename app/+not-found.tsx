import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerStyle: { backgroundColor: Colors.light.background }, headerTintColor: Colors.light.text }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ color: Colors.light.text }}>This screen doesn't exist.</ThemedText>
        <Link href="/home" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});