import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface BudgetCardProps {
  onEditPress?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ onEditPress }) => {
  const { budget, monthlyExpenses, remainingBudget, budgetUsagePercent, isOverBudget, currency, colors } =
    useFinance();

  // Progress clamped between 0 and 100 for bar width
  const visualPercent = Math.min(Math.max(budgetUsagePercent, 0), 100);

  // Status color based on budget health
  let statusColor = colors.accent;
  if (budgetUsagePercent >= 100) {
    statusColor = colors.expense;
  } else if (budgetUsagePercent >= 80) {
    statusColor = colors.warning;
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isOverBudget ? colors.expense : colors.cardBorder,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconContainer, { backgroundColor: isOverBudget ? colors.expenseLight : colors.infoLight }]}>
            <Ionicons
              name={isOverBudget ? 'alert-circle' : 'wallet-outline'}
              size={18}
              color={isOverBudget ? colors.expense : colors.info}
            />
          </View>
          <View>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Monthly Budget</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              Limit: {formatCurrency(budget, currency)}
            </Text>
          </View>
        </View>

        {onEditPress && (
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.surfaceSubtle }]}
            onPress={onEditPress}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={13} color={colors.textSecondary} />
            <Text style={[styles.editText, { color: colors.textSecondary }]}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBarBackground, { backgroundColor: colors.surfaceSubtle }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${visualPercent}%`,
              backgroundColor: statusColor,
            },
          ]}
        />
      </View>

      {/* Stats Below Bar */}
      <View style={styles.footerRow}>
        <View>
          <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>Spent</Text>
          <Text style={[styles.footerValue, { color: colors.textPrimary }]}>
            {formatCurrency(monthlyExpenses, currency)}
          </Text>
        </View>

        <View style={styles.percentBadge}>
          <Text style={[styles.percentText, { color: statusColor }]}>
            {formatPercentage(budgetUsagePercent)} used
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>
            {isOverBudget ? 'Over Budget' : 'Remaining'}
          </Text>
          <Text
            style={[
              styles.footerValue,
              { color: isOverBudget ? colors.expense : colors.accent },
            ]}
          >
            {formatCurrency(Math.abs(remainingBudget), currency)}
          </Text>
        </View>
      </View>

      {/* Exceeded Warning Banner */}
      {isOverBudget && (
        <View style={[styles.warningBanner, { backgroundColor: colors.expenseLight }]}>
          <Ionicons name="warning-outline" size={16} color={colors.expense} />
          <Text style={[styles.warningText, { color: colors.expense }]}>
            Warning: Expenses exceeded by {formatCurrency(Math.abs(remainingBudget), currency)}!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  editText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
});

