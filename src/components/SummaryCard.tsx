import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { formatMonthReadable } from '../utils/dateUtils';

export const SummaryCard: React.FC = () => {
  const { totalBalance, monthlyIncome, monthlyExpenses, currency, currentMonthKey, theme } =
    useFinance();

  const isDark = theme === 'dark';

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? '#131b2e' : '#0f172a',
            borderColor: isDark ? '#27354f' : '#1e293b',
          },
        ]}
      >
        {/* Header row: Label + Month indicator */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.label}>TOTAL BALANCE</Text>
            <Text style={styles.balanceText}>{formatCurrency(totalBalance, currency)}</Text>
          </View>
          <View style={styles.monthBadge}>
            <Ionicons name="calendar-outline" size={13} color="#94a3b8" />
            <Text style={styles.monthText}>{formatMonthReadable(currentMonthKey)}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Income & Expense Breakdown */}
        <View style={styles.statsRow}>
          {/* Monthly Income */}
          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Ionicons name="arrow-down" size={14} color="#10b981" />
              </View>
              <Text style={styles.statLabel}>Income (This Month)</Text>
            </View>
            <Text style={[styles.statValue, { color: '#34d399' }]}>
              +{formatCurrency(monthlyIncome, currency)}
            </Text>
          </View>

          {/* Vertical Separator */}
          <View style={styles.verticalSeparator} />

          {/* Monthly Expenses */}
          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Ionicons name="arrow-up" size={14} color="#ef4444" />
              </View>
              <Text style={styles.statLabel}>Expense (This Month)</Text>
            </View>
            <Text style={[styles.statValue, { color: '#f87171' }]}>
              -{formatCurrency(monthlyExpenses, currency)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  container: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  monthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  monthText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
  },
  verticalSeparator: {
    width: 1,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
});

