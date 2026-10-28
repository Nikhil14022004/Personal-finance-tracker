export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO string YYYY-MM-DD
  paymentMethod: PaymentMethod;
  note?: string;
  createdAt: number;
}

export interface Budget {
  monthlyLimit: number;
  month: string; // YYYY-MM
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  currency: Currency;
  theme: ThemeMode;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
  count: number;
}

export interface MonthlyStats {
  income: number;
  expenses: number;
  netSavings: number;
  topCategory: { name: string; amount: number } | null;
  transactionCount: number;
}

