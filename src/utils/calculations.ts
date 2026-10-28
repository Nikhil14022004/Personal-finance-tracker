import { CategorySummary, MonthlyStats, Transaction } from '../types';
import { isDateInMonth, getCurrentMonthString } from './dateUtils';
import { getCategoryMeta } from '../constants/categories';

/**
 * Calculates total balance across all recorded transactions
 * Total balance = Total income - Total expenses
 */
export const calculateTotalBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
  }, 0);
};

/**
 * Calculates total income for a given month (defaults to current month)
 */
export const calculateMonthlyIncome = (
  transactions: Transaction[],
  month: string = getCurrentMonthString()
): number => {
  return transactions
    .filter((tx) => tx.type === 'income' && isDateInMonth(tx.date, month))
    .reduce((acc, tx) => acc + tx.amount, 0);
};

/**
 * Calculates total expenses for a given month (defaults to current month)
 */
export const calculateMonthlyExpenses = (
  transactions: Transaction[],
  month: string = getCurrentMonthString()
): number => {
  return transactions
    .filter((tx) => tx.type === 'expense' && isDateInMonth(tx.date, month))
    .reduce((acc, tx) => acc + tx.amount, 0);
};

/**
 * Calculates remaining monthly budget
 * Remaining budget = monthly budget - monthly expenses
 */
export const calculateRemainingBudget = (
  monthlyBudget: number,
  monthlyExpenses: number
): number => {
  return monthlyBudget - monthlyExpenses;
};

/**
 * Calculates category-wise breakdown of expenses for a given month
 */
export const calculateCategoryBreakdown = (
  transactions: Transaction[],
  month: string = getCurrentMonthString()
): CategorySummary[] => {
  const expenseTxs = transactions.filter(
    (tx) => tx.type === 'expense' && isDateInMonth(tx.date, month)
  );

  const totalExpense = expenseTxs.reduce((sum, tx) => sum + tx.amount, 0);
  if (totalExpense === 0) return [];

  const map = new Map<string, { amount: number; count: number }>();

  expenseTxs.forEach((tx) => {
    const existing = map.get(tx.category) || { amount: 0, count: 0 };
    map.set(tx.category, {
      amount: existing.amount + tx.amount,
      count: existing.count + 1,
    });
  });

  const summaries: CategorySummary[] = [];

  map.forEach((data, categoryName) => {
    const meta = getCategoryMeta(categoryName, 'expense');
    const percentage = (data.amount / totalExpense) * 100;
    summaries.push({
      category: categoryName,
      amount: data.amount,
      percentage,
      color: meta.color,
      icon: meta.icon,
      count: data.count,
    });
  });

  // Sort descending by amount
  return summaries.sort((a, b) => b.amount - a.amount);
};

/**
 * Calculates monthly statistics
 */
export const calculateMonthlyStats = (
  transactions: Transaction[],
  month: string = getCurrentMonthString()
): MonthlyStats => {
  const income = calculateMonthlyIncome(transactions, month);
  const expenses = calculateMonthlyExpenses(transactions, month);
  const netSavings = income - expenses;

  const breakdown = calculateCategoryBreakdown(transactions, month);
  const topCategory =
    breakdown.length > 0
      ? { name: breakdown[0].category, amount: breakdown[0].amount }
      : null;

  const currentMonthTxs = transactions.filter((tx) => isDateInMonth(tx.date, month));

  return {
    income,
    expenses,
    netSavings,
    topCategory,
    transactionCount: currentMonthTxs.length,
  };
};

/**
 * Generates last 6 months data for comparison bar charts
 */
export interface MonthComparisonData {
  monthKey: string; // YYYY-MM
  label: string;    // "May", "Jun", etc.
  income: number;
  expenses: number;
}

export const getPastSixMonthsComparison = (
  transactions: Transaction[]
): MonthComparisonData[] => {
  const result: MonthComparisonData[] = [];
  const now = new Date();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;
    const label = monthNames[d.getMonth()];

    const income = calculateMonthlyIncome(transactions, monthKey);
    const expenses = calculateMonthlyExpenses(transactions, monthKey);

    result.push({
      monthKey,
      label,
      income,
      expenses,
    });
  }

  return result;
};

