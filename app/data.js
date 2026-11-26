// HomeLedger seed data and storage for the Alvarez family, November 2026.
// All figures are the seeded month in full: November spending totals $3,779.00
// against $4,800.00 of income, and groceries alone total $486.00.

export const MONTH_LABEL = 'November 2026';
export const MONTHLY_INCOME = 4800;
export const GOAL_DEPOSITS_NOV = 624;

export const CATEGORIES = [
  { slug: 'groceries', label: 'Groceries', budget: 620 },
  { slug: 'dining', label: 'Dining', budget: 350 },
  { slug: 'transport', label: 'Transport', budget: 400 },
  { slug: 'housing', label: 'Housing', budget: 1600 },
  { slug: 'utilities', label: 'Utilities', budget: 200 },
  { slug: 'entertainment', label: 'Entertainment', budget: 200 },
  { slug: 'shopping', label: 'Shopping', budget: 400 },
  { slug: 'health', label: 'Health', budget: 260 },
];

export function categoryLabel(slug) {
  const found = CATEGORIES.find((c) => c.slug === slug);
  return found ? found.label : slug;
}

function tx(id, date, description, category, amount) {
  return { id, date, description, category, amount };
}

export function seedTransactions() {
  return [
    tx('tx01', '2026-11-01', 'Monthly rent', 'housing', 1450.0),
    tx('tx02', '2026-11-01', 'Fuel', 'transport', 45.0),
    tx('tx03', '2026-11-02', 'Weekly market shop', 'groceries', 92.4),
    tx('tx04', '2026-11-02', 'Streaming subscription', 'entertainment', 15.99),
    tx('tx05', '2026-11-03', 'Family pizza night', 'dining', 48.2),
    tx('tx06', '2026-11-03', "Kids' school shoes", 'shopping', 89.99),
    tx('tx07', '2026-11-04', 'Home insurance', 'housing', 120.0),
    tx('tx08', '2026-11-05', 'Bus passes', 'transport', 38.25),
    tx('tx09', '2026-11-05', 'Pharmacy run', 'health', 35.0),
    tx('tx10', '2026-11-06', 'Lunch with coworkers', 'dining', 36.75),
    tx('tx11', '2026-11-07', 'Supermarket run', 'groceries', 118.75),
    tx('tx12', '2026-11-08', 'Electricity bill', 'utilities', 86.4),
    tx('tx13', '2026-11-08', 'Movie night tickets', 'entertainment', 24.0),
    tx('tx14', '2026-11-09', 'Sunday lunch out', 'dining', 62.4),
    tx('tx15', '2026-11-10', 'Internet bill', 'utilities', 54.25),
    tx('tx16', '2026-11-10', 'Winter coats', 'shopping', 122.72),
    tx('tx17', '2026-11-11', 'Fuel', 'transport', 52.8),
    tx('tx18', '2026-11-12', 'Corner store top-up', 'groceries', 64.3),
    tx('tx19', '2026-11-12', 'Dentist check-up', 'health', 145.0),
    tx('tx20', '2026-11-13', 'Water bill', 'utilities', 42.1),
    tx('tx21', '2026-11-14', 'Coffee and pastries', 'dining', 28.9),
    tx('tx22', '2026-11-15', 'Ride share', 'transport', 27.5),
    tx('tx23', '2026-11-16', 'Board game night snacks', 'entertainment', 18.5),
    tx('tx24', '2026-11-17', 'Household supplies', 'shopping', 56.4),
    tx('tx25', '2026-11-18', 'Weekly market shop', 'groceries', 87.15),
    tx('tx26', '2026-11-19', 'Family cinema trip', 'entertainment', 32.0),
    tx('tx27', '2026-11-19', 'Vitamins and first aid', 'health', 28.5),
    tx('tx28', '2026-11-20', 'Fuel', 'transport', 61.2),
    tx('tx29', '2026-11-21', 'Birthday dinner', 'dining', 41.5),
    tx('tx30', '2026-11-21', 'New bedsheets', 'shopping', 74.25),
    tx('tx31', '2026-11-22', 'Car service and oil', 'transport', 189.0),
    tx('tx32', '2026-11-23', 'Supermarket run', 'groceries', 123.4),
    tx('tx33', '2026-11-23', 'Eye test', 'health', 42.0),
    tx('tx34', '2026-11-24', 'Family dinner out', 'dining', 84.6),
    tx('tx35', '2026-11-24', 'Kitchenware set', 'shopping', 43.8),
    tx('tx36', '2026-11-25', 'Concert tickets', 'entertainment', 96.0),
  ];
}

export function seedBills() {
  return [
    { id: 'bill1', name: 'Electricity', amount: 86.4, dueDate: '2026-11-28', paid: false },
    { id: 'bill2', name: 'Internet', amount: 54.25, dueDate: '2026-11-30', paid: false },
    { id: 'bill3', name: 'Water', amount: 42.1, dueDate: '2026-12-03', paid: false },
    { id: 'bill4', name: 'Rent', amount: 1450.0, dueDate: '2026-11-01', paid: true },
    { id: 'bill5', name: 'Phone plan', amount: 65.0, dueDate: '2026-11-05', paid: true },
    { id: 'bill6', name: 'Car insurance', amount: 120.0, dueDate: '2026-11-10', paid: true },
  ];
}

export function seedGoals() {
  return [
    { id: 'g1', name: 'Emergency fund', target: 5000, saved: 3200 },
    { id: 'g2', name: 'Family vacation', target: 2400, saved: 1150 },
    { id: 'g3', name: 'New car deposit', target: 6000, saved: 1850 },
    { id: 'g4', name: "Kids' school fund", target: 1500, saved: 640 },
  ];
}

export function seedBudgets() {
  const budgets = {};
  for (const c of CATEGORIES) budgets[c.slug] = c.budget;
  return budgets;
}

export function seedState() {
  return {
    income: MONTHLY_INCOME,
    goalDepositsNov: GOAL_DEPOSITS_NOV,
    transactions: seedTransactions(),
    budgets: seedBudgets(),
    bills: seedBills(),
    goals: seedGoals(),
  };
}

const STORAGE_KEY = 'homeledger-v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = seedState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function money(n) {
  return '$' + Number(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function spentInMonth(state, monthPrefix) {
  return state.transactions
    .filter((t) => t.date.startsWith(monthPrefix))
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

export function spentByCategory(state, slug, monthPrefix) {
  return state.transactions
    .filter((t) => t.category === slug && t.date.startsWith(monthPrefix))
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

export function monthlyTrend() {
  return [
    { month: 'Jun', spent: 3420 },
    { month: 'Jul', spent: 3580 },
    { month: 'Aug', spent: 3490 },
    { month: 'Sep', spent: 3610 },
    { month: 'Oct', spent: 3725 },
    { month: 'Nov', spent: 3779 },
  ];
}
