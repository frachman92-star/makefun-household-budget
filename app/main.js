// HomeLedger router and event wiring. Hash routes, localStorage persistence,
// and window.__shotReady after every render so screenshots can wait for paint.

import { CATEGORIES, loadState, money, monthlyTrend, saveState, spentByCategory } from './data.js';
import { drawCategoryChart, drawTrendChart } from './charts.js';
import { billsView, budgetsView, dashboardView, goalsView, transactionsView } from './views.js';

const MONTH = '2026-11';
const ROUTES = ['dashboard', 'transactions', 'budgets', 'bills', 'goals'];

let state = loadState();
let editingId = null;

const viewEl = document.getElementById('view');

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return ROUTES.includes(hash) ? hash : 'dashboard';
}

function render() {
  // Clear the flag first so a wait for the new view cannot pass on the
  // previous view's ready state (notably after a nav-link click, where the
  // hashchange task may still be queued when the waiter starts polling).
  window.__shotReady = false;
  const route = currentRoute();
  let html;
  if (route === 'transactions') html = transactionsView(state, editingId);
  else if (route === 'budgets') html = budgetsView(state);
  else if (route === 'bills') html = billsView(state);
  else if (route === 'goals') html = goalsView(state);
  else html = dashboardView(state);

  viewEl.innerHTML = html;

  document.querySelectorAll('nav a[data-route]').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });

  if (route === 'dashboard') {
    const rows = CATEGORIES.map((c) => ({
      label: c.label,
      spent: spentByCategory(state, c.slug, MONTH),
      budget: state.budgets[c.slug],
    })).sort((a, b) => b.spent - a.spent);
    drawCategoryChart(document.getElementById('cat-chart'), rows);
    drawTrendChart(document.getElementById('trend-chart'), monthlyTrend());
  }

  window.__shotReady = true;
}

function newTxId() {
  return 'tx-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 10000);
}

document.addEventListener('submit', (event) => {
  const form = event.target;
  event.preventDefault();

  if (form.id === 'tx-form') {
    const data = new FormData(form);
    const description = String(data.get('description') || '').trim();
    const amount = Number(data.get('amount'));
    const category = String(data.get('category') || 'groceries');
    const date = String(data.get('date') || '2026-11-26');
    if (!description || !(amount > 0) || !date) return;
    if (editingId) {
      const existing = state.transactions.find((t) => t.id === editingId);
      if (existing) {
        existing.description = description;
        existing.amount = amount;
        existing.category = category;
        existing.date = date;
      }
      editingId = null;
    } else {
      state.transactions.push({ id: newTxId(), date, description, category, amount });
    }
    saveState(state);
    render();
    return;
  }

  if (form.classList.contains('budget-form')) {
    const slug = form.dataset.category;
    const value = Number(new FormData(form).get('budget'));
    if (slug && value >= 0) {
      state.budgets[slug] = value;
      saveState(state);
      render();
    }
    return;
  }

  if (form.classList.contains('goal-form')) {
    const goalId = form.dataset.goal;
    const value = Number(new FormData(form).get('amount'));
    const goal = state.goals.find((g) => g.id === goalId);
    if (goal && value > 0) {
      goal.saved = Math.round((goal.saved + value) * 100) / 100;
      saveState(state);
      render();
    }
    return;
  }
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'delete-tx') {
    state.transactions = state.transactions.filter((t) => t.id !== id);
    if (editingId === id) editingId = null;
    saveState(state);
    render();
  } else if (action === 'edit-tx') {
    editingId = id;
    render();
    const field = document.querySelector('#tx-form input[name="description"]');
    if (field) field.focus();
  } else if (action === 'cancel-edit') {
    editingId = null;
    render();
  } else if (action === 'toggle-bill') {
    const bill = state.bills.find((b) => b.id === id);
    if (bill) {
      bill.paid = !bill.paid;
      saveState(state);
      render();
    }
  }
});

window.addEventListener('hashchange', () => {
  editingId = null;
  render();
});

// Drop the ready flag the moment a nav link is clicked, so a waiter that
// starts polling before the hashchange task runs still waits for the new
// view instead of passing on the old view's flag.
document.querySelector('nav').addEventListener('click', (event) => {
  if (event.target.closest('a[data-route]')) window.__shotReady = false;
});

window.addEventListener('resize', () => {
  if (currentRoute() === 'dashboard') render();
});

render();

// Keep the money helper reachable for debugging from the console.
window.__homeledger = { money };
