import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { useFinance } from '../context/FinanceContext';
import { getCategoryMeta } from '../constants/categories';
import { formatCurrency } from '../utils/formatters';
import { formatDateReadable } from '../utils/dateUtils';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (tx: Transaction) => void;
  onDelete?: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const { colors, currency, deleteTransaction } = useFinance();
  const isIncome = transaction.type === 'income';
  const meta = getCategoryMeta(transaction.category, transaction.type);

  const handleDelete = () => {
    const confirmDelete = () => {
      if (onDelete) {
        onDelete(transaction.id);
      } else {
        deleteTransaction(transaction.id);
      }
    };

    if (Platform.OS === 'web') {
      const ok = window.confirm(
        `Are you sure you want to delete this ${transaction.type} transaction for ${formatCurrency(
          transaction.amount,
          currency
        )}?`
      );
      if (ok) confirmDelete();
    } else {
      Alert.alert(
        'Delete Transaction',
        `Delete this ${transaction.type} of ${formatCurrency(transaction.amount, currency)}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Category Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isIncome ? colors.accentLight : colors.surfaceSubtle },
        ]}
      >
        <Ionicons
          name={meta.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color={isIncome ? colors.accent : meta.color || colors.expense}
        />
      </View>

      {/* Main Details */}
      <TouchableOpacity
        style={styles.details}
        activeOpacity={0.7}
        onPress={() => onEdit?.(transaction)}
      >
        <View style={styles.topRow}>
          <Text
            style={[styles.title, { color: colors.textPrimary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {transaction.note || transaction.category}
          </Text>
          <Text
            style={[
              styles.amount,
              { color: isIncome ? colors.accent : colors.expense },
            ]}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount, currency)}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.metaGroup}>
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
              {transaction.category}
            </Text>
            <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
            <View style={[styles.methodBadge, { backgroundColor: colors.surfaceSubtle }]}>
              <Text style={[styles.methodText, { color: colors.textSecondary }]}>
                {transaction.paymentMethod}
              </Text>
            </View>
          </View>

          <Text style={[styles.dateText, { color: colors.textMuted }]}>
            {formatDateReadable(transaction.date)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Quick Actions: Edit & Delete */}
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surfaceSubtle }]}
            onPress={() => onEdit(transaction)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="create-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.expenseLight }]}
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={16} color={colors.expense} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dot: {
    marginHorizontal: 5,
    fontSize: 10,
  },
  methodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  methodText: {
    fontSize: 10,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

