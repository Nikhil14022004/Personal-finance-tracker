import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { HomeScreen } from '../screens/HomeScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RootTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Statistics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const AppNavigator: React.FC = () => {
  const { colors, theme } = useFinance();
  const insets = useSafeAreaInsets();

  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;
  const isIOS = Platform.OS === 'ios';

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.tabBarActive,
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarStyle: {
            backgroundColor: colors.tabBarBackground,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: 1,
            height: isIOS ? 60 + insets.bottom : 70,
            paddingTop: 8,
            paddingBottom: isIOS ? Math.max(insets.bottom, 12) : 10,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
          },
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 2,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            lineHeight: 14,
            marginTop: 2,
            marginBottom: 0,
          },
          tabBarIconStyle: {
            marginTop: 2,
            marginBottom: 0,
          },
          tabBarIcon: ({ focused, color }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Transactions') {
              iconName = focused ? 'receipt' : 'receipt-outline';
            } else if (route.name === 'Statistics') {
              iconName = focused ? 'pie-chart' : 'pie-chart-outline';
            } else {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen name="Statistics" component={StatisticsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
