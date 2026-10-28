import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightActionIcon?: keyof typeof Ionicons.glyphMap;
  onRightAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightActionIcon,
  onRightAction,
}) => {
  const { colors, theme, toggleTheme } = useFinance();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.cardBorder }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        {rightActionIcon && onRightAction ? (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle }]}
            onPress={onRightAction}
            activeOpacity={0.7}
          >
            <Ionicons name={rightActionIcon} size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surfaceSubtle }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Theme"
        >
          <Ionicons
            name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={20}
            color={theme === 'dark' ? '#f59e0b' : colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

