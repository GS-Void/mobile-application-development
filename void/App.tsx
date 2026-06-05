import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/routes/AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#020414" />
      <AppNavigator />
    </>
  );
}