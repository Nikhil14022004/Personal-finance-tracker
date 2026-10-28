import { Category, PaymentMethod } from '../types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', icon: 'restaurant-outline', color: '#f97316', type: 'expense' },
  { id: 'groceries', name: 'Groceries', icon: 'cart-outline', color: '#10b981', type: 'expense' },
  { id: 'transport', name: 'Transportation', icon: 'car-outline', color: '#06b6d4', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: 'bag-handle-outline', color: '#ec4899', type: 'expense' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'receipt-outline', color: '#eab308', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film-outline', color: '#8b5cf6', type: 'expense' },
  { id: 'health', name: 'Health & Fitness', icon: 'fitness-outline', color: '#ef4444', type: 'expense' },
  { id: 'education', name: 'Education', icon: 'school-outline', color: '#3b82f6', type: 'expense' },
  { id: 'travel', name: 'Travel', icon: 'airplane-outline', color: '#14b8a6', type: 'expense' },
  { id: 'other_expense', name: 'Other Expense', icon: 'ellipsis-horizontal-circle-outline', color: '#64748b', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'cash-outline', color: '#10b981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: 'laptop-outline', color: '#06b6d4', type: 'income' },
  { id: 'investments', name: 'Investments', icon: 'trending-up-outline', color: '#3b82f6', type: 'income' },
  { id: 'business', name: 'Business', icon: 'briefcase-outline', color: '#8b5cf6', type: 'income' },
  { id: 'gifts', name: 'Gifts & Rewards', icon: 'gift-outline', color: '#ec4899', type: 'income' },
  { id: 'other_income', name: 'Other Income', icon: 'wallet-outline', color: '#64748b', type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Bank Transfer'];

export const getCategoryMeta = (nameOrId: string, type?: 'income' | 'expense'): Category => {
  const found = ALL_CATEGORIES.find(
    (c) => c.id === nameOrId || c.name.toLowerCase() === nameOrId.toLowerCase()
  );
  if (found) return found;

  return {
    id: nameOrId.toLowerCase().replace(/\s+/g, '_'),
    name: nameOrId,
    icon: type === 'income' ? 'wallet-outline' : 'pricetag-outline',
    color: type === 'income' ? '#10b981' : '#64748b',
    type: type || 'expense',
  };
};

