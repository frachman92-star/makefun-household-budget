// HomeLedger app: loads the saved household budget, routes between the
// five sections, and wires up every control. The state lives in
// localStorage (see data.js); each change saves, then re-renders.

import { loadState, saveState, resetState } from './data.js';
import { drawCategoryBars, drawTrend } from './charts.js';
import {
  renderDashboard,
  renderTransactions,
  renderBudgets,
  renderBills,
  renderGoals,
  spentByCategory,
  totalIncome,
  totalSpent,
  money,
} from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('[data-route]')];
let state = loadState();
let editingTxId = null;

function route() {
  const hash = window.location.hash || '#/dashboard';
  const parts = hash.replace(/^#\//, '').split('/');
  const page = parts[0] || 'dashboard';
  navLinks.forEach((link) => {
    const target = link.getAttribute('data-route');
    link.classList.toggle('active', target === page || (page === '' && target === 'dashboard'));
  });
  let html = '';
  if (page === 'transactions') html = renderTransactions(state, editingTxId);
  else if (page === 'budgets') html = renderBudgets(state);
  else if (page === 'bills') html = renderBills(state);
  else if (page === 'goals') html = renderGoals(state);
  else html = renderDashboard(state);
  app.innerHTML = html;
  if (page === 'dashboard' || page === '') {
    const catCanvas = document.getElementById('cat-chart');
    const trendCanvas = document.getElementById('trend-chart');
    if (catCanvas) drawCategoryBars(catCanvas, state.categories, spentByCategory(state));
    if (trendCanvas) drawTrend(trendCanvas, state.trend);
  }
  const footerNote = document.getElementById('footer-note');
  if (footerNote) {
    footerNote.textContent = 'November: ' + money(totalIncome(state)) + ' in, '
      + money(totalSpent(state)) + ' out, '
      + money(totalIncome(state) - totalSpent(state)) + ' left.';
  }
  window.__shotReady = true;
  window.scrollTo(0, 0);
}

function saveAndRender() {
  saveState(state);
  route();
}

function formValues(form) {
  const values = {};
  new FormData(form).forEach((value, key) => { values[key] = String(value).trim(); });
  return values;
}

function newId(prefix) {
  return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  const values = formValues(form);

  if (form.id === 'tx-form') {
    const amount = Number(values.amount);
    if (!values.description || !Number.isFinite(amount) || amount <= 0) return;
    if (values.editId) {
      const tx = state.transactions.find((t) => t.id === values.editId);
      if (tx) {
        tx.description = values.description;
        tx.amount = amount;
        tx.category = values.category;
        tx.date = values.date;
        tx.note = values.note;
      }
      editingTxId = null;
    } else {
      state.transactions.push({
        id: newId('t'),
        date: values.date || '2026-11-26',
        description: values.description,
        category: values.category,
        amount,
        note: values.note,
      });
    }
    saveAndRender();
  } else if (form.id === 'bill-form') {
    const amount = Number(values.amount);
    const dueDay = Number(values.dueDay);
    if (!values.name || !Number.isFinite(amount) || amount <= 0) return;
    state.bills.push({
      id: newId('b'),
      name: values.name,
      amount,
      dueDay: Number.isFinite(dueDay) && dueDay >= 1 && dueDay <= 31 ? dueDay : 1,
      paid: false,
      note: values.note,
    });
    saveAndRender();
  } else if (form.id === 'goal-form') {
    const target = Number(values.target);
    const saved = Number(values.saved) || 0;
    if (!values.name || !Number.isFinite(target) || target <= 0) return;
    state.goals.push({
      id: newId('g'),
      name: values.name,
      target,
      saved: Math.min(saved, target),
      note: values.note,
    });
    saveAndRender();
  } else if (form.classList.contains('budget-form')) {
    const budget = Number(values.budget);
    const cat = state.categories.find((c) => c.id === form.dataset.category);
    if (cat && Number.isFinite(budget) && budget >= 0) cat.budget = budget;
    saveAndRender();
  } else if (form.classList.contains('goal-form')) {
    const amount = Number(values.amount);
    const goal = state.goals.find((g) => g.id === form.dataset.goal);
    if (goal && Number.isFinite(amount) && amount > 0) goal.saved = Math.min(goal.target, goal.saved + amount);
    saveAndRender();
  }
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (button) {
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (action === 'delete-tx') {
      state.transactions = state.transactions.filter((t) => t.id !== id);
      if (editingTxId === id) editingTxId = null;
      saveAndRender();
    } else if (action === 'edit-tx') {
      editingTxId = id;
      route();
      const form = document.getElementById('tx-form');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'toggle-bill') {
      const bill = state.bills.find((b) => b.id === id);
      if (bill) bill.paid = !bill.paid;
      saveAndRender();
    }
    return;
  }
  const reset = event.target.closest('#reset-data');
  if (reset) {
    state = resetState();
    editingTxId = null;
    saveAndRender();
  }
});

window.addEventListener('hashchange', route);

route();
