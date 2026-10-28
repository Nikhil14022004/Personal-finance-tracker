import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

interface EditBudgetModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ visible, onClose }) => {
  const { budget, setMonthlyBudget, currency, colors } = useFinance();
  const [amountStr, setAmountStr] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (visible) {
      setAmountStr(budget.toString());
      setError('');
    }
  }, [visible, budget]);

  const handleSave = async () => {
    const val = parseFloat(amountStr);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a budget amount greater than 0.');
      return;
    }

    await setMonthlyBudget(val);
    onClose();
  };

  const quickAmounts = [15000, 25000, 35000, 50000, 75000, 100000];

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <View style={[styles.iconCircle, { backgroundColor: colors.infoLight }]}>
                <Ionicons name="wallet-outline" size={20} color={colors.info} />
              </View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>Set Monthly Budget</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceSubtle }]}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Set your target spending limit for the month to stay on track.
          </Text>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.expenseLight }]}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.expense} />
              <Text style={[styles.errorText, { color: colors.expense }]}>{error}</Text>
            </View>
          ) : null}

          {/* Budget Input */}
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder },
            ]}
          >
            <Text style={[styles.currencyPrefix, { color: colors.textPrimary }]}>
              {currency.symbol}
            </Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={amountStr}
              onChangeText={(t) => {
                setAmountStr(t);
                if (error) setError('');
              }}
              autoFocus
            />
          </View>

          {/* Quick preset chips */}
          <Text style={[styles.presetLabel, { color: colors.textSecondary }]}>Quick Presets</Text>
          <View style={styles.presetRow}>
            {quickAmounts.map((q) => (
              <TouchableOpacity
                key={q}
                style={[
                  styles.presetChip,
                  {
                    backgroundColor:
                      amountStr === q.toString() ? colors.primary : colors.surfaceSubtle,
                    borderColor:
                      amountStr === q.toString() ? colors.primary : colors.cardBorder,
                  },
                ]}
                onPress={() => setAmountStr(q.toString())}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    { color: amountStr === q.toString() ? '#ffffff' : colors.textPrimary },
                  ]}
                >
                  {formatCurrency(q, currency)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.cardBorder }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>Save Budget</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
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
  subtitle: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    height: '100%',
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

