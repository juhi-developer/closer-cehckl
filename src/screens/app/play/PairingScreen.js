import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const PairingScreen = () => {
  return (
    <View style={styles.container}>
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' }}>
 
      <Image source={{ uri: 'https://example.com/image.png' }} style={styles.image} />  
      <Text style={styles.title}>Pairing Required</Text>
      <Text style={styles.subtitle}>Please pair with a partner to continue.</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default PairingScreen;
