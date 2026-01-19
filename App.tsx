import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { FocusScreen } from './src/screens/FocusScreen';
import './src/i18n'; // Initialize i18n
import { loadLanguage } from './src/i18n';

export default function App() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    const init = async () => {
        await loadLanguage();
        setIsLoaded(true);
    };
    init();
  }, []);

  if (!isLoaded) {
      return (
          <View style={styles.container}>
              <Text>Loading...</Text>
          </View>
      );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FocusScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
});
