import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { Header } from '../components/Header';
import { SummaryCard } from '../components/SummaryCard';
import { BudgetCard } from '../components/BudgetCard';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { TransactionItem } from '../components/TransactionItem';
import { EmptyState } from '../components/EmptyState';
import { FloatingAddButton } from '../components/FloatingAddButton';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { EditBudgetModal } from '../components/EditBudgetModal';
import { calculateCategoryBreakdown } from '../utils/calculations';
import { Transaction } from '../types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    colors,
    recentTransactions,
    transactions,
    currentMonthKey,
    monthlyExpenses,
    deleteTransaction,
  } = useFinance();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const categoryBreakdown = calculateCategoryBreakdown(transactions, currentMonthKey);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 400);
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setAddModalVisible(true);
  };

  const handleCloseModal = () => {
    setAddModalVisible(false);
    setEditingTransaction(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Finance Tracker"
        subtitle="Manage your personal wealth"
        rightActionIcon="add"
        onRightAction={() => {
          setEditingTransaction(null);
          setAddModalVisible(true);
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Total Balance & Monthly Highlights */}
        <SummaryCard />

        {/* Monthly Budget Card */}
        <BudgetCard onEditPress={() => setBudgetModalVisible(true)} />

        {/* Expense Category Breakdown Chart */}
        <CategoryPieChart
          data={categoryBreakdown}
          totalExpenseAmount={monthlyExpenses}
          title="Monthly Expense Breakdown"
        />

        {/* Recent Transactions Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleGroup}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Recent Transactions
            </Text>
            <View style={[styles.countBadge, { backgroundColor: colors.surfaceSubtle }]}>
              <Text style={[styles.countBadgeText, { color: colors.textSecondary }]}>
                {recentTransactions.length}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('Transactions')}
            activeOpacity={0.7}
          >
            <Text style={[styles.seeAllText, { color: colors.info }]}>See All</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.info} />
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Start tracking your money by adding your first income or expense."
            actionText="Add Transaction"
            onAction={() => {
              setEditingTransaction(null);
              setAddModalVisible(true);
            }}
          />
        ) : (
          recentTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onEdit={handleEdit}
              onDelete={deleteTransaction}
            />
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Plus Action Button */}
      <FloatingAddButton
        onPress={() => {
          setEditingTransaction(null);
          setAddModalVisible(true);
        }}
      />

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        visible={addModalVisible}
        onClose={handleCloseModal}
        initialTransaction={editingTransaction}
      />

      {/* Edit Budget Modal */}
      <EditBudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 30,
  },
});

