/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import Footer from './src/components/Footer';
import Welcome from './src/components/Welcome';
import Header from './src/components/Header';

const App = () => {
  return (
    <View style={styles.root}>
      <Header />
      <Welcome />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20
  }
});

export default App;
