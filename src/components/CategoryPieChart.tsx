import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { CategorySummary } from '../types';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface CategoryPieChartProps {
  data: CategorySummary[];
  title?: string;
  totalExpenseAmount: number;
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  title = 'Expense Breakdown',
  totalExpenseAmount,
}) => {
  const { colors, currency } = useFinance();

  if (!data || data.length === 0 || totalExpenseAmount === 0) {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="pie-chart-outline" size={40} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No expense data available for this period
          </Text>
        </View>
      </View>
    );
  }

  // Chart dimensions
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets
  let accumulatedPercent = 0;
  const segments = data.map((item) => {
    const strokeDashoffset = circumference - (circumference * item.percentage) / 100;
    const rotation = (accumulatedPercent / 100) * 360;
    accumulatedPercent += item.percentage;
    return {
      ...item,
      strokeDashoffset,
      rotation,
    };
  });

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
          Total: {formatCurrency(totalExpenseAmount, currency)}
        </Text>
      </View>

      <View style={styles.contentRow}>
        {/* SVG Donut Chart */}
        <View style={styles.chartContainer}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${center}, ${center}`}>
              {/* Background circle */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={colors.surfaceSubtle}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Segments */}
              {segments.map((seg, idx) => (
                <Circle
                  key={`seg-${idx}-${seg.category}`}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  rotation={seg.rotation}
                  origin={`${center}, ${center}`}
                />
              ))}
            </G>
          </Svg>
          {/* Center Info */}
          <View style={styles.centerTextContainer}>
            <Text style={[styles.centerCount, { color: colors.textPrimary }]}>
              {data.length}
            </Text>
            <Text style={[styles.centerSub, { color: colors.textSecondary }]}>
              Categories
            </Text>
          </View>
        </View>

        {/* Legend List */}
        <View style={styles.legendContainer}>
          {data.slice(0, 5).map((item, index) => (
            <View key={`legend-${index}`} style={styles.legendItem}>
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              <View style={styles.legendInfo}>
                <Text
                  style={[styles.legendName, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {item.category}
                </Text>
                <Text style={[styles.legendAmount, { color: colors.textSecondary }]}>
                  {formatCurrency(item.amount, currency)} ({formatPercentage(item.percentage)})
                </Text>
              </View>
            </View>
          ))}
          {data.length > 5 && (
            <Text style={[styles.moreText, { color: colors.textMuted }]}>
              +{data.length - 5} more categories
            </Text>
          )}
        </View>
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
    fontSize: 16,
    fontWeight: '700',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 180,
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCount: {
    fontSize: 22,
    fontWeight: '800',
  },
  centerSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  legendContainer: {
    flex: 1,
    minWidth: 140,
    justifyContent: 'center',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendInfo: {
    flex: 1,
  },
  legendName: {
    fontSize: 13,
    fontWeight: '600',
  },
  legendAmount: {
    fontSize: 11,
    marginTop: 1,
  },
  moreText: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
});

