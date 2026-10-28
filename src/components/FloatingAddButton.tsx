import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';

interface FloatingAddButtonProps {
  onPress: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onPress }) => {
  const { theme } = useFinance();

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme === 'dark' ? '#38bdf8' : '#0f172a',
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel="Add Transaction"
      >
        <Ionicons name="add" size={30} color={theme === 'dark' ? '#0f172a' : '#ffffff'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 99,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
