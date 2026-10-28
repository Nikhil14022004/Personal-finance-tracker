import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { Header } from '../components/Header';
import { TransactionItem } from '../components/TransactionItem';
import { EmptyState } from '../components/EmptyState';
import { FloatingAddButton } from '../components/FloatingAddButton';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/formatters';

type FilterType = 'all' | 'income' | 'expense';

export const TransactionsScreen: React.FC = () => {
  const { transactions, colors, currency, deleteTransaction } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Filter & Search Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (filterType !== 'all' && tx.type !== filterType) {
        return false;
      }
      // Search query filter (matches category, note, payment method, or amount)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const noteMatch = tx.note?.toLowerCase().includes(query) ?? false;
        const categoryMatch = tx.category.toLowerCase().includes(query);
        const paymentMatch = tx.paymentMethod.toLowerCase().includes(query);
        const amountMatch = tx.amount.toString().includes(query);
        return noteMatch || categoryMatch || paymentMatch || amountMatch;
      }
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: transactions.length,
      income: transactions.filter((t) => t.type === 'income').length,
      expense: transactions.filter((t) => t.type === 'expense').length,
    };
  }, [transactions]);

  // Filtered net sum
  const filteredNet = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => {
      return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
    }, 0);
  }, [filteredTransactions]);

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
        title="Transactions"
        subtitle={`${transactions.length} total entries`}
        rightActionIcon="add"
        onRightAction={() => {
          setEditingTransaction(null);
          setAddModalVisible(true);
        }}
      />

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search notes, categories, payment method..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Tabs: All, Income, Expenses */}
      <View style={styles.filterRow}>
        {(['all', 'income', 'expense'] as FilterType[]).map((tab) => {
          const isActive = filterType === tab;
          const label = tab === 'all' ? 'All' : tab === 'income' ? 'Income' : 'Expenses';
          const count = counts[tab];

          let activeBg = colors.primary;
          if (tab === 'income') activeBg = colors.accent;
          if (tab === 'expense') activeBg = colors.expense;

          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                {
                  backgroundColor: isActive ? activeBg : colors.surface,
                  borderColor: isActive ? activeBg : colors.cardBorder,
                },
              ]}
              onPress={() => setFilterType(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: isActive ? '#ffffff' : colors.textPrimary },
                ]}
              >
                {label}
              </Text>
              <View
                style={[
                  styles.filterCountBadge,
                  {
                    backgroundColor: isActive
                      ? 'rgba(255, 255, 255, 0.25)'
                      : colors.surfaceSubtle,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterCountText,
                    { color: isActive ? '#ffffff' : colors.textSecondary },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Filter Results Summary Header */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {filteredTransactions.length}{' '}
          {filteredTransactions.length === 1 ? 'transaction' : 'transactions'} found
        </Text>
        <Text
          style={[
            styles.resultsSum,
            { color: filteredNet >= 0 ? colors.accent : colors.expense },
          ]}
        >
          Net: {formatCurrency(filteredNet, currency)}
        </Text>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onEdit={handleEdit}
            onDelete={deleteTransaction}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No matching transactions"
            description={
              searchQuery
                ? `No transactions matched "${searchQuery}". Try a different keyword.`
                : 'No transactions found under this filter.'
            }
            actionText={searchQuery ? 'Clear Search' : 'Add Transaction'}
            onAction={() => {
              if (searchQuery) {
                setSearchQuery('');
              } else {
                setEditingTransaction(null);
                setAddModalVisible(true);
              }
            }}
          />
        }
      />

      {/* Floating Add Button */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultsSum: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 90,
  },
});

