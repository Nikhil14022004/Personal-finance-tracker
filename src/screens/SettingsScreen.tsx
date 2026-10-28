import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { Header } from '../components/Header';
import { EditBudgetModal } from '../components/EditBudgetModal';
import { CURRENCIES } from '../constants/currencies';
import { Currency } from '../types';
import { formatCurrency } from '../utils/formatters';

export const SettingsScreen: React.FC = () => {
  const {
    colors,
    theme,
    toggleTheme,
    currency,
    updateCurrency,
    budget,
    transactions,
    clearAllData,
    resetToSampleData,
  } = useFinance();

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage('');
    }, 2500);
  };

  const handleClearData = () => {
    const performClear = async () => {
      await clearAllData();
      showStatus('All transaction data cleared successfully.');
    };

    if (Platform.OS === 'web') {
      const ok = window.confirm(
        'Are you sure you want to delete all transactions? This action cannot be undone.'
      );
      if (ok) performClear();
    } else {
      Alert.alert(
        'Clear All Data',
        'Are you sure you want to delete all transactions? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear All', style: 'destructive', onPress: performClear },
        ]
      );
    }
  };

  const handleResetSampleData = () => {
    const performReset = async () => {
      await resetToSampleData();
      showStatus('Sample transactions restored successfully!');
    };

    if (Platform.OS === 'web') {
      const ok = window.confirm(
        'Reset transactions back to initial demo data?'
      );
      if (ok) performReset();
    } else {
      Alert.alert(
        'Load Sample Data',
        'This will populate your account with sample transactions and default budget.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Load Sample Data', onPress: performReset },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings" subtitle="Preferences & App Configuration" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status Toast Notification */}
        {statusMessage ? (
          <View style={[styles.toast, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
            <Text style={[styles.toastText, { color: colors.accent }]}>{statusMessage}</Text>
          </View>
        ) : null}

        {/* Section: Preferences */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}
        >
          {/* Currency Selection */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setCurrencyModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.infoLight }]}>
                <Ionicons name="cash-outline" size={18} color={colors.info} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Currency</Text>
                <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                  {currency.name}
                </Text>
              </View>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.badgeText, { color: colors.info }]}>{currency.symbol}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Theme Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.warningLight }]}>
                <Ionicons
                  name={theme === 'dark' ? 'moon' : 'sunny-outline'}
                  size={18}
                  color={colors.warning}
                />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Dark Mode</Text>
                <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                  {theme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.cardBorder, true: colors.accent }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Monthly Budget Setting */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setBudgetModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.accentLight }]}>
                <Ionicons name="wallet-outline" size={18} color={colors.accent} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  Monthly Budget
                </Text>
                <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                  Current limit: {formatCurrency(budget, currency)}
                </Text>
              </View>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.badgeText, { color: colors.accent }]}>Configure</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Section: Data Management */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DATA MANAGEMENT</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}
        >
          {/* Reload Sample Data */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleResetSampleData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.infoLight }]}>
                <Ionicons name="refresh-outline" size={18} color={colors.info} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  Reload Sample Data
                </Text>
                <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                  Populate demo income & expenses
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Clear All Data */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleClearData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.expenseLight }]}>
                <Ionicons name="trash-outline" size={18} color={colors.expense} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: colors.expense }]}>
                  Clear All Transaction Data
                </Text>
                <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                  Permanently delete all recorded transactions
                </Text>
              </View>
            </View>
            <Ionicons name="alert-circle-outline" size={18} color={colors.expense} />
          </TouchableOpacity>
        </View>

        {/* Section: App Information */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}
        >
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Application</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              Personal Finance Tracker
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>1.0.0</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Storage</Text>
            <Text style={[styles.infoValue, { color: colors.accent }]}>
              AsyncStorage (100% Offline & Local)
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Total Records</Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              {transactions.length} transactions stored
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Currency Selection Modal */}
      <Modal
        visible={currencyModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.currencyModalCard,
              { backgroundColor: colors.surface, borderColor: colors.cardBorder },
            ]}
          >
            <View style={styles.currencyModalHeader}>
              <Text style={[styles.currencyModalTitle, { color: colors.textPrimary }]}>
                Select Currency
              </Text>
              <TouchableOpacity
                onPress={() => setCurrencyModalVisible(false)}
                style={[styles.closeIconBtn, { backgroundColor: colors.surfaceSubtle }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              {CURRENCIES.map((curr: Currency) => {
                const isSelected = currency.code === curr.code;
                return (
                  <TouchableOpacity
                    key={curr.code}
                    style={[
                      styles.currencyItem,
                      {
                        backgroundColor: isSelected
                          ? colors.surfaceSubtle
                          : 'transparent',
                      },
                    ]}
                    onPress={async () => {
                      await updateCurrency(curr);
                      setCurrencyModalVisible(false);
                      showStatus(`Currency updated to ${curr.name}`);
                    }}
                  >
                    <View style={styles.currencyItemLeft}>
                      <View
                        style={[
                          styles.currencySymbolBadge,
                          {
                            backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.currencySymbolText,
                            { color: isSelected ? '#ffffff' : colors.textPrimary },
                          ]}
                        >
                          {curr.symbol}
                        </Text>
                      </View>
                      <View>
                        <Text style={[styles.currencyName, { color: colors.textPrimary }]}>
                          {curr.name}
                        </Text>
                        <Text style={[styles.currencyCode, { color: colors.textSecondary }]}>
                          {curr.code}
                        </Text>
                      </View>
                    </View>

                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Budget Modal */}
      <EditBudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 10,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 12,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  currencyModalCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  currencyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#cbd5e1',
  },
  currencyModalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  closeIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 2,
  },
  currencyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencySymbolBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbolText: {
    fontSize: 15,
    fontWeight: '700',
  },
  currencyName: {
    fontSize: 14,
    fontWeight: '600',
  },
  currencyCode: {
    fontSize: 11,
    marginTop: 1,
  },
  bottomSpacer: {
    height: 20,
  },
});

