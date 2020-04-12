import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNav from './components/appNav'

export default function App() {
  return (
    <PaperProvider>
      <AppNav />
    </PaperProvider>
  );
}
