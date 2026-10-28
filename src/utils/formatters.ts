import { Currency } from '../types';

/**
 * Formats a number with commas and currency symbol: e.g. ₹45,000.00 or ₹45,000
 */
export const formatCurrency = (
  amount: number,
  currency: Currency,
  includeSymbol: boolean = true
): string => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Format with standard number grouping
  const formattedNumber = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(absAmount) ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const prefix = isNegative ? '-' : '';
  const symbol = includeSymbol ? currency.symbol : '';

  return `${prefix}${symbol}${formattedNumber}`;
};

/**
 * Formats percentage with 1 decimal place: e.g. "65.4%"
 */
export const formatPercentage = (val: number): string => {
  return `${Math.min(Math.max(val, 0), 100).toFixed(1)}%`;
};

