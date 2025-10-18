import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@components/Button';

export const HomeScreen: React.FC = () => {
  const handlePress = () => {
    console.log('Button pressed!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MyApp</Text>
      <Text style={styles.subtitle}>React Native with TypeScript</Text>
      <Button title="Get Started" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666666',
  },
});
