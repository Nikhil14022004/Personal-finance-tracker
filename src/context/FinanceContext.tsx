import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AppSettings, Currency, ThemeMode, Transaction } from '../types';
import { Colors } from '../constants/colors';
import {
  initializeStorageIfNeeded,
  saveTransactionsToStorage,
  saveBudgetToStorage,
  saveSettingsToStorage,
  clearAllTransactionsStorage,
  resetToSampleDataStorage,
  defaultSettings,
} from '../storage/asyncStorage';
import {
  calculateCategoryBreakdown,
  calculateMonthlyExpenses,
  calculateMonthlyIncome,
  calculateMonthlyStats,
  calculateRemainingBudget,
  calculateTotalBalance,
} from '../utils/calculations';
import { getCurrentMonthString } from '../utils/dateUtils';

interface FinanceContextType {
  transactions: Transaction[];
  budget: number;
  currency: Currency;
  theme: ThemeMode;
  colors: typeof Colors.light;
  isLoading: boolean;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  remainingBudget: number;
  budgetUsagePercent: number;
  isOverBudget: boolean;
  recentTransactions: Transaction[];
  currentMonthKey: string;
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<boolean>;
  updateTransaction: (id: string, updated: Partial<Transaction>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  setMonthlyBudget: (amount: number) => Promise<void>;
  updateCurrency: (curr: Currency) => Promise<void>;
  updateTheme: (th: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  clearAllData: () => Promise<void>;
  resetToSampleData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<number>(35000);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize storage on mount
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await initializeStorageIfNeeded();
        if (isMounted) {
          setTransactions(data.transactions);
          setBudget(data.budget);
          setSettings(data.settings);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentMonthKey = useMemo(() => getCurrentMonthString(), []);

  // Real-time calculations
  const totalBalance = useMemo(() => calculateTotalBalance(transactions), [transactions]);
  const monthlyIncome = useMemo(
    () => calculateMonthlyIncome(transactions, currentMonthKey),
    [transactions, currentMonthKey]
  );
  const monthlyExpenses = useMemo(
    () => calculateMonthlyExpenses(transactions, currentMonthKey),
    [transactions, currentMonthKey]
  );
  const remainingBudget = useMemo(
    () => calculateRemainingBudget(budget, monthlyExpenses),
    [budget, monthlyExpenses]
  );
  const budgetUsagePercent = useMemo(() => {
    if (budget <= 0) return 0;
    return (monthlyExpenses / budget) * 100;
  }, [budget, monthlyExpenses]);
  const isOverBudget = useMemo(() => monthlyExpenses > budget, [monthlyExpenses, budget]);

  const recentTransactions = useMemo(() => {
    // Sort descending by date, then by createdAt
    return [...transactions]
      .sort((a, b) => {
        if (a.date !== b.date) {
          return b.date.localeCompare(a.date);
        }
        return b.createdAt - a.createdAt;
      })
      .slice(0, 5);
  }, [transactions]);

  const colors = Colors[settings.theme];

  // Actions
  const addTransaction = async (
    data: Omit<Transaction, 'id' | 'createdAt'>
  ): Promise<boolean> => {
    try {
      const newTx: Transaction = {
        ...data,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: Date.now(),
      };
      const updated = [newTx, ...transactions];
      setTransactions(updated);
      await saveTransactionsToStorage(updated);
      return true;
    } catch (e) {
      console.error('Error adding transaction:', e);
      return false;
    }
  };

  const updateTransaction = async (
    id: string,
    updatedData: Partial<Transaction>
  ): Promise<boolean> => {
    try {
      const updated = transactions.map((t) => (t.id === id ? { ...t, ...updatedData } : t));
      setTransactions(updated);
      await saveTransactionsToStorage(updated);
      return true;
    } catch (e) {
      console.error('Error updating transaction:', e);
      return false;
    }
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    try {
      const updated = transactions.filter((t) => t.id !== id);
      setTransactions(updated);
      await saveTransactionsToStorage(updated);
      return true;
    } catch (e) {
      console.error('Error deleting transaction:', e);
      return false;
    }
  };

  const setMonthlyBudget = async (amount: number): Promise<void> => {
    setBudget(amount);
    await saveBudgetToStorage(amount);
  };

  const updateCurrency = async (curr: Currency): Promise<void> => {
    const updated = { ...settings, currency: curr };
    setSettings(updated);
    await saveSettingsToStorage(updated);
  };

  const updateTheme = async (th: ThemeMode): Promise<void> => {
    const updated = { ...settings, theme: th };
    setSettings(updated);
    await saveSettingsToStorage(updated);
  };

  const toggleTheme = async (): Promise<void> => {
    const nextTheme: ThemeMode = settings.theme === 'light' ? 'dark' : 'light';
    await updateTheme(nextTheme);
  };

  const clearAllData = async (): Promise<void> => {
    setTransactions([]);
    await clearAllTransactionsStorage();
  };

  const resetToSampleData = async (): Promise<void> => {
    const res = await resetToSampleDataStorage();
    setTransactions(res.transactions);
    setBudget(res.budget);
  };

  const value = {
    transactions,
    budget,
    currency: settings.currency,
    theme: settings.theme,
    colors,
    isLoading,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    remainingBudget,
    budgetUsagePercent,
    isOverBudget,
    recentTransactions,
    currentMonthKey,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setMonthlyBudget,
    updateCurrency,
    updateTheme,
    toggleTheme,
    clearAllData,
    resetToSampleData,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

