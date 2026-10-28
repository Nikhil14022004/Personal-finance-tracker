import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MonthComparisonData } from '../utils/calculations';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

interface MonthlyBarChartProps {
  data: MonthComparisonData[];
  title?: string;
}

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({
  data,
  title = 'Income vs Expenses (Last 6 Months)',
}) => {
  const { colors, currency } = useFinance();

  // Find max value to scale bar heights
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expenses)),
    1000 // avoid div by zero
  );

  const chartHeight = 130;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Expense</Text>
          </View>
        </View>
      </View>

      {/* Chart Bars */}
      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {data.map((item) => {
          const incomeHeight = Math.max((item.income / maxVal) * (chartHeight - 30), 4);
          const expenseHeight = Math.max((item.expenses / maxVal) * (chartHeight - 30), 4);

          return (
            <View key={item.monthKey} style={styles.barGroup}>
              <View style={styles.barsContainer}>
                {/* Income Bar */}
                <View
                  style={[
                    styles.bar,
                    {
                      height: incomeHeight,
                      backgroundColor: colors.accent,
                    },
                  ]}
                />
                {/* Expense Bar */}
                <View
                  style={[
                    styles.bar,
                    {
                      height: expenseHeight,
                      backgroundColor: colors.expense,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.monthLabel, { color: colors.textSecondary }]}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 95,
  },
  bar: {
    width: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  monthLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
});

