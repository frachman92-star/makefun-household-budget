// HomeLedger seed data: the Alvarez household, a family of four.
// Maya (teacher) and Jordan (freelance designer), two kids, one shared budget.
// All figures are sample data for November 2026, stored in localStorage
// under STORAGE_KEY and edited by the app; nothing here is fetched.

export const STORAGE_KEY = 'homeledger-v1';

export const HOUSEHOLD = {
  name: 'The Alvarez Family',
  members: 'Maya, Jordan, Leo (9) and Sofia (6)',
  month: 'November 2026',
  monthKey: '2026-11',
};

export const INCOME = [
  { id: 'inc-1', source: 'Maya salary', amount: 3100, date: '2026-11-01', note: 'Monthly pay, after tax' },
  { id: 'inc-2', source: 'Jordan freelance', amount: 1700, date: '2026-11-10', note: 'Two design projects' },
];

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', budget: 1450, color: '#2e6f5e' },
  { id: 'groceries', name: 'Groceries', budget: 620, color: '#4a9a7d' },
  { id: 'childcare', name: 'Childcare', budget: 450, color: '#e07856' },
  { id: 'transport', name: 'Transport', budget: 280, color: '#5b8dbf' },
  { id: 'utilities', name: 'Utilities', budget: 210, color: '#8a6fc0' },
  { id: 'dining', name: 'Dining out', budget: 180, color: '#d9a441' },
  { id: 'health', name: 'Health', budget: 160, color: '#c05b7a' },
  { id: 'entertainment', name: 'Entertainment', budget: 120, color: '#7a9e4b' },
  { id: 'clothing', name: 'Clothing', budget: 100, color: '#a08568' },
  { id: 'savings', name: 'Savings', budget: 600, color: '#3f7d6b' },
];

export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', description: 'Monthly rent', category: 'housing', amount: 1450, note: 'Apartment, paid on the 1st' },
  { id: 't02', date: '2026-11-02', description: 'Weekly shop, Green Mart', category: 'groceries', amount: 132, note: 'Fruit, veg, pantry staples' },
  { id: 't03', date: '2026-11-03', description: 'After-school club, Leo', category: 'childcare', amount: 150, note: 'November football club' },
  { id: 't04', date: '2026-11-04', description: 'Bus passes, both kids', category: 'transport', amount: 64, note: 'Monthly school bus' },
  { id: 't05', date: '2026-11-05', description: 'Electric bill', category: 'utilities', amount: 96, note: 'October usage' },
  { id: 't06', date: '2026-11-06', description: 'Pizza night', category: 'dining', amount: 38, note: 'Friday treat for the kids' },
  { id: 't07', date: '2026-11-08', description: 'Weekly shop, Green Mart', category: 'groceries', amount: 118, note: 'Includes school lunch boxes' },
  { id: 't08', date: '2026-11-09', description: 'Petrol', category: 'transport', amount: 52, note: 'Family car fill-up' },
  { id: 't09', date: '2026-11-10', description: 'Dentist check, Sofia', category: 'health', amount: 45, note: 'Six-month check' },
  { id: 't10', date: '2026-11-11', description: 'Cinema tickets', category: 'entertainment', amount: 34, note: 'Saturday film, four tickets' },
  { id: 't11', date: '2026-11-12', description: 'Internet bill', category: 'utilities', amount: 65, note: 'Monthly broadband' },
  { id: 't12', date: '2026-11-13', description: 'School lunches top-up', category: 'groceries', amount: 41, note: 'Canteen credit' },
  { id: 't13', date: '2026-11-14', description: 'Winter coats, Leo and Sofia', category: 'clothing', amount: 64, note: 'Sale, two coats' },
  { id: 't14', date: '2026-11-15', description: 'Weekly shop, Green Mart', category: 'groceries', amount: 127, note: 'Big shop before guests' },
  { id: 't15', date: '2026-11-16', description: 'Petrol', category: 'transport', amount: 48, note: 'Family car fill-up' },
  { id: 't16', date: '2026-11-17', description: 'Pharmacy', category: 'health', amount: 28, note: 'Cold medicine and vitamins' },
  { id: 't17', date: '2026-11-18', description: 'Family dinner out', category: 'dining', amount: 64, note: 'Maya birthday dinner' },
  { id: 't18', date: '2026-11-19', description: 'Childcare, Sofia', category: 'childcare', amount: 300, note: 'November nursery fees' },
  { id: 't19', date: '2026-11-20', description: 'Streaming subscription', category: 'entertainment', amount: 15, note: 'Family plan' },
  { id: 't20', date: '2026-11-21', description: 'Weekly shop, Green Mart', category: 'groceries', amount: 68, note: 'Top-up shop' },
  { id: 't21', date: '2026-11-22', description: 'Petrol', category: 'transport', amount: 32, note: 'Family car fill-up' },
  { id: 't22', date: '2026-11-23', description: 'Water bill', category: 'utilities', amount: 26, note: 'Quarterly water, part paid' },
  { id: 't23', date: '2026-11-24', description: 'Takeaway tacos', category: 'dining', amount: 40, note: 'Busy Tuesday, no cooking' },
  { id: 't24', date: '2026-11-25', description: 'Board game night', category: 'entertainment', amount: 37, note: 'New game for the kids' },
  { id: 't25', date: '2026-11-25', description: 'Transfer to emergency fund', category: 'savings', amount: 600, note: 'Monthly savings, auto transfer' },
  { id: 't26', date: '2026-11-26', description: 'Doctor visit, Leo', category: 'health', amount: 45, note: 'Check-up and prescription' },
];

export const SEED_BILLS = [
  { id: 'b1', name: 'Rent', amount: 1450, dueDay: 1, paid: true, note: 'Due the 1st, auto-pay' },
  { id: 'b2', name: 'Electric', amount: 96, dueDay: 5, paid: true, note: 'October usage' },
  { id: 'b3', name: 'Internet', amount: 65, dueDay: 12, paid: true, note: 'Broadband, monthly' },
  { id: 'b4', name: 'Water', amount: 48, dueDay: 20, paid: false, note: 'Quarterly, due soon' },
  { id: 'b5', name: 'Phone plan', amount: 78, dueDay: 25, paid: false, note: 'Two lines, family plan' },
  { id: 'b6', name: 'Car insurance', amount: 112, dueDay: 28, paid: false, note: 'Monthly premium' },
  { id: 'b7', name: 'Gym membership', amount: 35, dueDay: 5, paid: true, note: 'Maya and Jordan' },
];

export const SEED_GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 6000, saved: 4350, note: 'Six months of essentials, the safety net first' },
  { id: 'g2', name: 'Family vacation', target: 2400, saved: 1150, note: 'Beach trip next summer, flights and a week away' },
  { id: 'g3', name: 'New car', target: 8000, saved: 2300, note: 'Replace the old hatchback within two years' },
  { id: 'g4', name: "Kids' college fund", target: 10000, saved: 1800, note: 'A little each month, it adds up over the years' },
];

export const TREND = [
  { month: 'Jun', income: 4800, spent: 3420 },
  { month: 'Jul', income: 4800, spent: 3610 },
  { month: 'Aug', income: 4800, spent: 3890 },
  { month: 'Sep', income: 4800, spent: 3540 },
  { month: 'Oct', income: 4800, spent: 3720 },
  { month: 'Nov', income: 4800, spent: 3779 },
];

export function seedState() {
  return {
    income: INCOME.map((x) => ({ ...x })),
    categories: CATEGORIES.map((x) => ({ ...x })),
    transactions: SEED_TRANSACTIONS.map((x) => ({ ...x })),
    bills: SEED_BILLS.map((x) => ({ ...x })),
    goals: SEED_GOALS.map((x) => ({ ...x })),
    trend: TREND.map((x) => ({ ...x })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions)) return parsed;
    }
  } catch (e) {
    // A damaged save falls back to the seed figures.
  }
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}
