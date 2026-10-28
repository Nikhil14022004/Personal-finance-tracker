import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';

interface FloatingAddButtonProps {
  onPress: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onPress }) => {
  const { colors, theme } = useFinance();

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme === 'dark' ? '#38bdf8' : '#0f172a',
            shadowColor: theme === 'dark' ? '#38bdf8' : '#0f172a',
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel="Add Transaction"
      >
        <Ionicons name="add" size={28} color={theme === 'dark' ? '#0f172a' : '#ffffff'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    zIndex: 99,
  },
  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});

