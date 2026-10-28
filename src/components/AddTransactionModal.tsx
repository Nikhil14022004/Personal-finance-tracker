import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentMethod, Transaction, TransactionType } from '../types';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../constants/categories';
import { getTodayDateString } from '../utils/dateUtils';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  initialTransaction?: Transaction | null;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  initialTransaction,
}) => {
  const { colors, currency, addTransaction, updateTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Categories list depends on type
  const availableCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Sync state when editing or opening
  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setAmount(initialTransaction.amount.toString());
      setCategory(initialTransaction.category);
      setDate(initialTransaction.date);
      setPaymentMethod(initialTransaction.paymentMethod);
      setNote(initialTransaction.note || '');
    } else {
      setType('expense');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0].name);
      setDate(getTodayDateString());
      setPaymentMethod('UPI');
      setNote('');
    }
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialTransaction, visible]);

  // Keep category valid when type switches
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const newCategories = newType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    setCategory(newCategories[0].name);
    setErrorMessage('');
  };

  const handleSave = async () => {
    setErrorMessage('');
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0.');
      return;
    }

    if (!category.trim()) {
      setErrorMessage('Please select a category.');
      return;
    }

    if (!date.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setErrorMessage('Please enter a valid date in YYYY-MM-DD format.');
      return;
    }

    let success = false;
    if (initialTransaction) {
      success = await updateTransaction(initialTransaction.id, {
        type,
        amount: parsedAmount,
        category,
        date,
        paymentMethod,
        note: note.trim(),
      });
    } else {
      success = await addTransaction({
        type,
        amount: parsedAmount,
        category,
        date,
        paymentMethod,
        note: note.trim(),
      });
    }

    if (success) {
      setSuccessMessage(
        initialTransaction ? 'Transaction updated successfully!' : 'Transaction saved successfully!'
      );
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMessage('Failed to save transaction. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {initialTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Feedback Notifications */}
            {errorMessage ? (
              <View style={[styles.alertBox, { backgroundColor: colors.expenseLight }]}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.expense} />
                <Text style={[styles.alertText, { color: colors.expense }]}>{errorMessage}</Text>
              </View>
            ) : null}

            {successMessage ? (
              <View style={[styles.alertBox, { backgroundColor: colors.accentLight }]}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.accent} />
                <Text style={[styles.alertText, { color: colors.accent }]}>{successMessage}</Text>
              </View>
            ) : null}

            {/* Type Selector (Income vs Expense) */}
            <View style={[styles.typeToggleContainer, { backgroundColor: colors.surfaceSubtle }]}>
              <TouchableOpacity
                style={[
                  styles.typeTab,
                  type === 'expense' && [styles.typeTabActive, { backgroundColor: colors.expense }],
                ]}
                onPress={() => handleTypeChange('expense')}
              >
                <Ionicons
                  name="arrow-up-circle-outline"
                  size={16}
                  color={type === 'expense' ? '#ffffff' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.typeTabText,
                    { color: type === 'expense' ? '#ffffff' : colors.textSecondary },
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeTab,
                  type === 'income' && [styles.typeTabActive, { backgroundColor: colors.accent }],
                ]}
                onPress={() => handleTypeChange('income')}
              >
                <Ionicons
                  name="arrow-down-circle-outline"
                  size={16}
                  color={type === 'income' ? '#ffffff' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.typeTabText,
                    { color: type === 'income' ? '#ffffff' : colors.textSecondary },
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Amount</Text>
              <View
                style={[
                  styles.amountInputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                  },
                ]}
              >
                <Text style={[styles.currencyPrefix, { color: colors.textPrimary }]}>
                  {currency.symbol}
                </Text>
                <TextInput
                  style={[styles.amountInput, { color: colors.textPrimary }]}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(val) => {
                    setAmount(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoFocus={!initialTransaction}
                />
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {availableCategories.map((cat) => {
                  const isSelected = category === cat.name;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: isSelected ? cat.color : colors.surfaceSubtle,
                          borderColor: isSelected ? cat.color : colors.cardBorder,
                        },
                      ]}
                      onPress={() => setCategory(cat.name)}
                    >
                      <Ionicons
                        name={cat.icon as keyof typeof Ionicons.glyphMap}
                        size={16}
                        color={isSelected ? '#ffffff' : colors.textPrimary}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          { color: isSelected ? '#ffffff' : colors.textPrimary },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Date Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Date (YYYY-MM-DD)
                </Text>
                <TouchableOpacity
                  onPress={() => setDate(getTodayDateString())}
                  style={styles.todayBtn}
                >
                  <Text style={[styles.todayBtnText, { color: colors.info }]}>Set Today</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.textInputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                  },
                ]}
              >
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Payment Method
              </Text>
              <View style={styles.paymentMethodsRow}>
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = paymentMethod === method;
                  return (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentChip,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                          borderColor: isSelected ? colors.primary : colors.cardBorder,
                        },
                      ]}
                      onPress={() => setPaymentMethod(method)}
                    >
                      <Text
                        style={[
                          styles.paymentChipText,
                          { color: isSelected ? '#ffffff' : colors.textPrimary },
                        ]}
                      >
                        {method}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Optional Note */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Optional Note / Description
              </Text>
              <View
                style={[
                  styles.textInputWrapper,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                  },
                ]}
              >
                <Ionicons name="document-text-outline" size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="e.g. Grocery items, Flight ticket"
                  placeholderTextColor={colors.textMuted}
                  value={note}
                  onChangeText={setNote}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: type === 'expense' ? colors.expense : colors.accent },
              ]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-sharp" size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>
                {initialTransaction ? 'Update Transaction' : 'Save Transaction'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  typeToggleContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  typeTabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeTabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  todayBtn: {
    paddingVertical: 2,
  },
  todayBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    height: '100%',
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  paymentChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

