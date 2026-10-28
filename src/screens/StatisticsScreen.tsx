import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { Header } from '../components/Header';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { MonthlyBarChart } from '../components/MonthlyBarChart';
import {
  calculateCategoryBreakdown,
  calculateMonthlyStats,
  getPastSixMonthsComparison,
} from '../utils/calculations';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { formatMonthReadable } from '../utils/dateUtils';

export const StatisticsScreen: React.FC = () => {
  const { transactions, colors, currency, currentMonthKey } = useFinance();

  const monthlyStats = useMemo(
    () => calculateMonthlyStats(transactions, currentMonthKey),
    [transactions, currentMonthKey]
  );

  const categoryBreakdown = useMemo(
    () => calculateCategoryBreakdown(transactions, currentMonthKey),
    [transactions, currentMonthKey]
  );

  const sixMonthsData = useMemo(
    () => getPastSixMonthsComparison(transactions),
    [transactions]
  );

  const savingsRate = useMemo(() => {
    if (monthlyStats.income <= 0) return 0;
    return Math.max(0, (monthlyStats.netSavings / monthlyStats.income) * 100);
  }, [monthlyStats]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Statistics & Trends"
        subtitle={`Summary for ${formatMonthReadable(currentMonthKey)}`}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top 3 Summary Cards */}
        <View style={styles.metricsGrid}>
          {/* Net Savings Card */}
          <View
            style={[
              styles.metricCard,
              { backgroundColor: colors.surface, borderColor: colors.cardBorder },
            ]}
          >
            <View style={styles.metricHeader}>
              <View
                style={[
                  styles.metricIcon,
                  {
                    backgroundColor:
                      monthlyStats.netSavings >= 0 ? colors.accentLight : colors.expenseLight,
                  },
                ]}
              >
                <Ionicons
                  name={monthlyStats.netSavings >= 0 ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={monthlyStats.netSavings >= 0 ? colors.accent : colors.expense}
                />
              </View>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Net Savings</Text>
            </View>
            <Text
              style={[
                styles.metricValue,
                { color: monthlyStats.netSavings >= 0 ? colors.accent : colors.expense },
              ]}
            >
              {formatCurrency(monthlyStats.netSavings, currency)}
            </Text>
            <Text style={[styles.metricHint, { color: colors.textMuted }]}>
              Savings Rate: {formatPercentage(savingsRate)}
            </Text>
          </View>

          {/* Top Expense Category Card */}
          <View
            style={[
              styles.metricCard,
              { backgroundColor: colors.surface, borderColor: colors.cardBorder },
            ]}
          >
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: colors.warningLight }]}>
                <Ionicons name="flame-outline" size={16} color={colors.warning} />
              </View>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Top Category</Text>
            </View>
            <Text
              style={[styles.metricValue, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {monthlyStats.topCategory ? monthlyStats.topCategory.name : 'None'}
            </Text>
            <Text style={[styles.metricHint, { color: colors.textMuted }]}>
              {monthlyStats.topCategory
                ? formatCurrency(monthlyStats.topCategory.amount, currency)
                : 'No expenses'}
            </Text>
          </View>
        </View>

        {/* 6-Month Income vs Expenses Comparison Chart */}
        <MonthlyBarChart data={sixMonthsData} />

        {/* Expense Category Breakdown Chart */}
        <CategoryPieChart
          data={categoryBreakdown}
          totalExpenseAmount={monthlyStats.expenses}
          title="Expense Breakdown by Category"
        />

        {/* Category Detailed List with Progress Bars */}
        {categoryBreakdown.length > 0 && (
          <View
            style={[
              styles.breakdownCard,
              { backgroundColor: colors.surface, borderColor: colors.cardBorder },
            ]}
          >
            <Text style={[styles.breakdownTitle, { color: colors.textPrimary }]}>
              All Expense Categories
            </Text>
            <View style={styles.breakdownList}>
              {categoryBreakdown.map((item) => (
                <View key={item.category} style={styles.breakdownRow}>
                  <View style={styles.categoryInfoRow}>
                    <View style={styles.categoryNameCol}>
                      <View style={[styles.bullet, { backgroundColor: item.color }]} />
                      <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
                        {item.category}
                      </Text>
                      <Text style={[styles.countBadge, { color: colors.textMuted }]}>
                        ({item.count} {item.count === 1 ? 'tx' : 'txs'})
                      </Text>
                    </View>
                    <Text style={[styles.categoryAmount, { color: colors.textPrimary }]}>
                      {formatCurrency(item.amount, currency)}
                    </Text>
                  </View>

                  {/* Horizontal progress bar */}
                  <View
                    style={[
                      styles.catProgressBg,
                      { backgroundColor: colors.surfaceSubtle },
                    ]}
                  >
                    <View
                      style={[
                        styles.catProgressFill,
                        {
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metricIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  metricHint: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  breakdownCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  breakdownList: {
    gap: 14,
  },
  breakdownRow: {
    gap: 6,
  },
  categoryInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryNameCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
  },
  countBadge: {
    fontSize: 11,
  },
  categoryAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  catProgressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  bottomSpacer: {
    height: 20,
  },
});

