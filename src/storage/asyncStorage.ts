import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Transaction } from '../types';
import { DEFAULT_CURRENCY } from '../constants/currencies';
import { DEFAULT_MONTHLY_BUDGET, getInitialSampleTransactions } from './sampleData';

const KEYS = {
  TRANSACTIONS: '@pft_transactions_v1',
  BUDGET: '@pft_monthly_budget_v1',
  SETTINGS: '@pft_settings_v1',
  INITIALIZED: '@pft_has_initialized_v1',
};

export const defaultSettings: AppSettings = {
  currency: DEFAULT_CURRENCY,
  theme: 'light',
};

/**
 * Initializes storage with sample transactions if running for the first time
 */
export const initializeStorageIfNeeded = async (): Promise<{
  transactions: Transaction[];
  budget: number;
  settings: AppSettings;
}> => {
  try {
    const hasInitialized = await AsyncStorage.getItem(KEYS.INITIALIZED);

    if (!hasInitialized) {
      // First launch: write sample transactions and default budget
      const sampleTxs = getInitialSampleTransactions();
      await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(sampleTxs));
      await AsyncStorage.setItem(KEYS.BUDGET, JSON.stringify(DEFAULT_MONTHLY_BUDGET));
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
      await AsyncStorage.setItem(KEYS.INITIALIZED, 'true');

      return {
        transactions: sampleTxs,
        budget: DEFAULT_MONTHLY_BUDGET,
        settings: defaultSettings,
      };
    }

    // Already initialized: read persisted data
    const [storedTxs, storedBudget, storedSettings] = await Promise.all([
      AsyncStorage.getItem(KEYS.TRANSACTIONS),
      AsyncStorage.getItem(KEYS.BUDGET),
      AsyncStorage.getItem(KEYS.SETTINGS),
    ]);

    const transactions: Transaction[] = storedTxs ? JSON.parse(storedTxs) : [];
    const budget: number = storedBudget ? JSON.parse(storedBudget) : DEFAULT_MONTHLY_BUDGET;
    const settings: AppSettings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;

    return {
      transactions,
      budget,
      settings,
    };
  } catch (error) {
    console.error('Error during storage initialization:', error);
    return {
      transactions: getInitialSampleTransactions(),
      budget: DEFAULT_MONTHLY_BUDGET,
      settings: defaultSettings,
    };
  }
};

/**
 * Saves transactions to AsyncStorage
 */
export const saveTransactionsToStorage = async (transactions: Transaction[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions to AsyncStorage:', error);
  }
};

/**
 * Saves monthly budget to AsyncStorage
 */
export const saveBudgetToStorage = async (budget: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.BUDGET, JSON.stringify(budget));
  } catch (error) {
    console.error('Failed to save budget to AsyncStorage:', error);
  }
};

/**
 * Saves settings to AsyncStorage
 */
export const saveSettingsToStorage = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to AsyncStorage:', error);
  }
};

/**
 * Clears all user transactions
 */
export const clearAllTransactionsStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
  } catch (error) {
    console.error('Failed to clear transactions from AsyncStorage:', error);
  }
};

/**
 * Resets storage to initial sample data
 */
export const resetToSampleDataStorage = async (): Promise<{
  transactions: Transaction[];
  budget: number;
}> => {
  try {
    const sample = getInitialSampleTransactions();
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(sample));
    await AsyncStorage.setItem(KEYS.BUDGET, JSON.stringify(DEFAULT_MONTHLY_BUDGET));
    return { transactions: sample, budget: DEFAULT_MONTHLY_BUDGET };
  } catch (error) {
    console.error('Failed to reset to sample data:', error);
    return { transactions: [], budget: DEFAULT_MONTHLY_BUDGET };
  }
};

