import React from 'react';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FinanceProvider, useFinance } from './src/context/FinanceContext';
import { AppNavigator } from './src/navigation/AppNavigator';

const MainApp: React.FC = () => {
  const { isLoading, colors, theme } = useFinance();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.appWrapper, { backgroundColor: theme === 'dark' ? '#060910' : '#e2e8f0' }]}>
      <View style={[styles.appContainer, { backgroundColor: colors.background }]}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <AppNavigator />
      </View>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <FinanceProvider>
        <MainApp />
      </FinanceProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
    overflow: 'hidden',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: Platform.OS === 'web' ? 0.15 : 0,
    shadowRadius: 20,
    overflow: 'hidden',
  },
});
