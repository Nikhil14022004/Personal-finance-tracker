import { Transaction } from '../types';

/**
 * Creates dynamic sample transactions for the current month and recent days
 */
export const getInitialSampleTransactions = (): Transaction[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const makeDate = (day: number): string => {
    const d = Math.max(1, Math.min(day, 28));
    return `${year}-${month}-${String(d).padStart(2, '0')}`;
  };

  const todayDay = now.getDate();

  return [
    {
      id: 'sample-1',
      type: 'income',
      amount: 65000,
      category: 'Salary',
      date: makeDate(1),
      paymentMethod: 'Bank Transfer',
      note: 'Monthly Salary Credit',
      createdAt: new Date(year, now.getMonth(), 1, 9, 30).getTime(),
    },
    {
      id: 'sample-2',
      type: 'expense',
      amount: 14500,
      category: 'Bills & Utilities',
      date: makeDate(Math.min(todayDay, 3)),
      paymentMethod: 'UPI',
      note: 'House Rent & Electricity Bill',
      createdAt: new Date(year, now.getMonth(), 3, 11, 15).getTime(),
    },
    {
      id: 'sample-3',
      type: 'expense',
      amount: 4200,
      category: 'Groceries',
      date: makeDate(Math.min(todayDay, 5)),
      paymentMethod: 'Card',
      note: 'Supermarket weekly grocery haul',
      createdAt: new Date(year, now.getMonth(), 5, 17, 20).getTime(),
    },
    {
      id: 'sample-4',
      type: 'income',
      amount: 12000,
      category: 'Freelance',
      date: makeDate(Math.min(todayDay, 8)),
      paymentMethod: 'Bank Transfer',
      note: 'UI Design project payment',
      createdAt: new Date(year, now.getMonth(), 8, 14, 0).getTime(),
    },
    {
      id: 'sample-5',
      type: 'expense',
      amount: 1850,
      category: 'Food & Dining',
      date: makeDate(Math.min(todayDay, 10)),
      paymentMethod: 'UPI',
      note: 'Dinner with friends at Italian Cafe',
      createdAt: new Date(year, now.getMonth(), 10, 20, 45).getTime(),
    },
    {
      id: 'sample-6',
      type: 'expense',
      amount: 2100,
      category: 'Transportation',
      date: makeDate(Math.min(todayDay, 12)),
      paymentMethod: 'Card',
      note: 'Fuel & Metro card recharge',
      createdAt: new Date(year, now.getMonth(), 12, 10, 10).getTime(),
    },
    {
      id: 'sample-7',
      type: 'expense',
      amount: 3200,
      category: 'Shopping',
      date: makeDate(Math.min(todayDay, 15)),
      paymentMethod: 'UPI',
      note: 'Casual sneakers from Amazon',
      createdAt: new Date(year, now.getMonth(), 15, 16, 30).getTime(),
    },
    {
      id: 'sample-8',
      type: 'expense',
      amount: 799,
      category: 'Entertainment',
      date: makeDate(Math.min(todayDay, 18)),
      paymentMethod: 'Card',
      note: 'Netflix & Spotify subscriptions',
      createdAt: new Date(year, now.getMonth(), 18, 12, 0).getTime(),
    },
  ];
};

export const DEFAULT_MONTHLY_BUDGET = 35000;

