# 💰 Personal Finance Tracker Mobile App

A clean, modern, beginner-friendly **Personal Finance Tracker** mobile application built with **React Native**, **Expo**, **TypeScript**, and **AsyncStorage**. Designed for both mobile (iOS & Android via Expo Go) and web browser deployment (Vercel, Netlify, Cloudflare Pages).

---

## 📱 Features

### 1. 🏠 Home Dashboard
- **Total Balance**: Real-time net balance calculated across all transactions (`Total Income − Total Expenses`).
- **Monthly Income & Expenses**: Current month cash flow with green/red visual indicators.
- **Monthly Budget Card**: Progress bar, spent vs. remaining budget, and warning banner when exceeding the budget limit.
- **Expense Breakdown Chart**: Clean SVG donut chart with category distribution and legend.
- **Recent Transactions**: Quick list of the latest 5 transactions with edit/delete actions and "See All" shortcut.
- **Floating Action Button (+)**: One-tap access to add new transactions anywhere.

### 2. ➕ Add & Edit Transaction
- **Type Toggle**: Effortlessly switch between **Expense** and **Income**.
- **Amount Validation**: Enforces valid numeric values greater than zero.
- **Category Selector**: Dedicated categories with custom icons and colors (Food, Groceries, Transport, Bills, Shopping, Salary, Freelance, etc.).
- **Payment Methods**: Cash, UPI, Card, and Bank Transfer.
- **Date Selector**: Quick "Set Today" button or custom `YYYY-MM-DD`.
- **Optional Note**: Descriptive note for purchases or receipts.
- **Instant Feedback**: Toast notification upon saving.

### 3. 📜 Transaction History
- **Search Bar**: Real-time filtering by note, category, payment method, or amount.
- **Filter Tabs**: Toggle between **All**, **Income**, and **Expenses** with live count badges.
- **List Items**: Clean cards displaying category icon, payment badge, formatted date, and amount.
- **Edit & Delete**: Full edit modal support and safe confirmation prompts before deletion.

### 4. 📊 Statistics & Analytics
- **Summary Metrics**: Net savings, savings rate percentage, and top expense category.
- **Income vs. Expenses Bar Chart**: Side-by-side comparison for the past 6 months.
- **Category Distribution Chart**: Visual SVG donut chart and breakdown list with percentage progress bars.

### 5. ⚙️ Settings & Customization
- **Currency Selection**: Default **Indian Rupee (₹)**, with one-tap switching to **$ USD**, **€ EUR**, **£ GBP**, **¥ JPY**, and more.
- **Dark Mode / Light Mode**: Seamless dark theme toggle with instant UI adaptation.
- **Budget Configuration**: Quick presets (₹15,000, ₹25,000, ₹35,000, ₹50,000+) or custom input.
- **Data Management**:
  - *Clear All Data*: Safely erase all transactions with a confirmation dialog.
  - *Reload Sample Data*: Restore realistic demo transactions anytime.
- **Storage Status**: 100% offline, private local persistence via `@react-native-async-storage/async-storage`.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 58) & [React Native](https://reactnative.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Navigation**: [React Navigation](https://reactnavigation.org/) (Bottom Tabs + Native Stack)
- **Data Storage**: `@react-native-async-storage/async-storage`
- **Charts & Icons**: `react-native-svg` and `@expo/vector-icons` (Ionicons)
- **Web & Deployment**: `react-native-web`, `@expo/metro-runtime`

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) installed.

### 1. Install Dependencies
```bash
cd personal-finance-tracker
npm install
```

### 2. Run the App
To start the Expo development server:
```bash
npx expo start
```
From the interactive terminal:
- Press **`w`** to open in your web browser.
- Press **`a`** to open in Android Emulator / device.
- Press **`i`** to open in iOS Simulator.
- Scan the QR code using the **Expo Go** app on your physical iPhone or Android phone.

---

## 🌐 Deploy to Vercel

The project is already pre-configured with `vercel.json` for seamless static web export.

### Option A: Using Vercel CLI (Instant)
```bash
# 1. Install Vercel CLI if you haven't already
npm install -g vercel

# 2. Deploy
vercel
```

### Option B: Deploy via GitHub & Vercel Dashboard
1. Push this repository to GitHub.
2. In your [Vercel Dashboard](https://vercel.com/new), import the repository.
3. Vercel will automatically detect the settings from `vercel.json`:
   - **Framework Preset**: Other
   - **Build Command**: `npx expo export -p web`
   - **Output Directory**: `dist`
4. Click **Deploy**!

---

## 📁 Project Structure

```
personal-finance-tracker/
├── assets/                  # Icons and splash images
├── dist/                    # Static web bundle for deployment
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AddTransactionModal.tsx
│   │   ├── BudgetCard.tsx
│   │   ├── CategoryPieChart.tsx
│   │   ├── EditBudgetModal.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FloatingAddButton.tsx
│   │   ├── Header.tsx
│   │   ├── MonthlyBarChart.tsx
│   │   ├── SummaryCard.tsx
│   │   └── TransactionItem.tsx
│   ├── constants/           # Categories, colors & currencies
│   │   ├── categories.ts
│   │   ├── colors.ts
│   │   └── currencies.ts
│   ├── context/             # Finance state & storage provider
│   │   └── FinanceContext.tsx
│   ├── navigation/          # React Navigation bottom tabs
│   │   └── AppNavigator.tsx
│   ├── screens/             # Main application screens
│   │   ├── HomeScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── StatisticsScreen.tsx
│   │   └── TransactionsScreen.tsx
│   ├── storage/             # AsyncStorage helpers & sample data
│   │   ├── asyncStorage.ts
│   │   └── sampleData.ts
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts
│   └── utils/               # Math, date, and currency helpers
│       ├── calculations.ts
│       ├── dateUtils.ts
│       └── formatters.ts
├── App.tsx                  # App entry root with providers & responsive container
├── app.json                 # Expo configuration
├── package.json             # Dependencies and build scripts
├── tsconfig.json            # TypeScript configuration
└── vercel.json              # Vercel deployment configuration
```

---

## 🔒 Offline & Privacy
All transactions and preferences are kept exclusively on the local device using AsyncStorage. No cloud tracking, no accounts, and no third-party telemetry.

