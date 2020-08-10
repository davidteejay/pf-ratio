import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import Main from './components/Main'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Main />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
