// View templates for HomeLedger. Each function returns an HTML string for
// one route; main.js injects it into #view and then draws the charts.

import {
  CATEGORIES,
  MONTH_LABEL,
  categoryLabel,
  money,
  monthlyTrend,
  spentByCategory,
  spentInMonth,
} from './data.js';

const MONTH = '2026-11';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function dashboardView(state) {
  const spent = spentInMonth(state, MONTH);
  const income = state.income;
  const saved = income - spent;
  const rate = Math.round((state.goalDepositsNov / income) * 100);
  const recent = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 5);
  const summary = CATEGORIES.map((c) => ({
    label: c.label,
    spent: spentByCategory(state, c.slug, MONTH),
    budget: state.budgets[c.slug],
  })).sort((a, b) => b.spent - a.spent);

  return `
  <h1>November budget at a glance</h1>
  <p class="lede">The Alvarez family, ${MONTH_LABEL}. Income, spending and savings for the month so far.</p>
  <section class="stats">
    <div class="card stat"><span class="stat-label">Income</span><span class="stat-value">${money(income)}</span><span class="stat-note">Paychecks, November</span></div>
    <div class="card stat"><span class="stat-label">Spent</span><span class="stat-value">${money(spent)}</span><span class="stat-note">36 transactions</span></div>
    <div class="card stat"><span class="stat-label">Saved</span><span class="stat-value">${money(saved)}</span><span class="stat-note">Income minus spending</span></div>
    <div class="card stat"><span class="stat-label">Savings rate</span><span class="stat-value">${rate}%</span><span class="stat-note">${money(state.goalDepositsNov)} moved to goals</span></div>
  </section>
  <section class="grid-two">
    <div class="card">
      <h2>Spending by category</h2>
      <canvas id="cat-chart" width="560" height="260" aria-label="Bar chart of spending by category"></canvas>
      <p class="chart-note">Housing is the biggest slice, as usual. Transport is running over budget this month.</p>
    </div>
    <div class="card">
      <h2>Monthly trend</h2>
      <canvas id="trend-chart" width="560" height="260" aria-label="Bar chart of monthly spending, June to November"></canvas>
      <p class="chart-note">Spending has crept up since June. November is the highest month yet at ${money(spent)}.</p>
    </div>
  </section>
  <section class="grid-two">
    <div class="card">
      <h2>Recent transactions</h2>
      <ul class="plain-list">
        ${recent.map((t) => `<li><span>${esc(t.date)} &middot; ${esc(t.description)}</span><strong>${money(t.amount)}</strong></li>`).join('')}
      </ul>
      <p><a href="#/transactions">See all transactions &rarr;</a></p>
    </div>
    <div class="card">
      <h2>Budget summary</h2>
      <ul class="plain-list">
        ${summary.map((s) => `<li><span>${esc(s.label)}</span><strong>${money(s.spent)} of ${money(s.budget)}</strong></li>`).join('')}
      </ul>
      <p><a href="#/budgets">Manage budgets &rarr;</a></p>
    </div>
  </section>`;
}

export function transactionsView(state, editingId) {
  const rows = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const editing = editingId ? state.transactions.find((t) => t.id === editingId) : null;
  const options = CATEGORIES.map(
    (c) => `<option value="${c.slug}"${editing && editing.category === c.slug ? ' selected' : ''}>${c.label}</option>`,
  ).join('');

  return `
  <h1>Transactions</h1>
  <p class="lede">Every purchase and bill the Alvarez family logged in ${MONTH_LABEL}.</p>
  <div class="card">
    <h2>${editing ? 'Edit transaction' : 'Add a transaction'}</h2>
    <form id="tx-form">
      <div class="form-grid">
        <label>Description<input type="text" name="description" required value="${editing ? esc(editing.description) : ''}" placeholder="What was it?"></label>
        <label>Amount<input type="number" name="amount" required min="0.01" step="0.01" value="${editing ? editing.amount : ''}" placeholder="0.00"></label>
        <label>Category<select name="category">${options}</select></label>
        <label>Date<input type="date" name="date" required value="${editing ? editing.date : '2026-11-26'}"></label>
      </div>
      <button type="submit">${editing ? 'Save changes' : 'Add transaction'}</button>
      ${editing ? '<button type="button" data-action="cancel-edit">Cancel edit</button>' : ''}
    </form>
  </div>
  <div class="card table-card">
    <h2>All transactions (${rows.length})</h2>
    <div class="table-wrap">
    <table>
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th>Actions</th></tr></thead>
      <tbody>
        ${rows.map((t) => `<tr>
          <td>${esc(t.date)}</td>
          <td>${esc(t.description)}</td>
          <td>${categoryLabel(t.category)}</td>
          <td class="num">${money(t.amount)}</td>
          <td><button type="button" data-action="edit-tx" data-id="${t.id}">Edit</button>
          <button type="button" data-action="delete-tx" data-id="${t.id}">Delete</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
    </div>
  </div>`;
}

export function budgetsView(state) {
  const rows = CATEGORIES.map((c) => {
    const spent = spentByCategory(state, c.slug, MONTH);
    const budget = state.budgets[c.slug];
    const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
    const over = spent - budget;
    return { ...c, spent, budget, pct, over };
  });

  return `
  <h1>Category budgets</h1>
  <p class="lede">Monthly limits the Alvarez family set for ${MONTH_LABEL}, against what each category has actually spent.</p>
  <div class="budget-list">
    ${rows.map((r) => `
    <div class="card budget-row">
      <div class="budget-head">
        <h2>${r.label}</h2>
        <span class="budget-amount">${money(r.spent)} of ${money(r.budget)}</span>
      </div>
      <div class="progress" role="progressbar" aria-valuenow="${r.pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill${r.over > 0 ? ' over' : ''}" style="width: ${r.pct}%"></div>
      </div>
      <p class="budget-note">${r.pct}% of budget used${r.over > 0 ? ` &middot; <span class="over-warning">Over budget by ${money(r.over)}</span>` : ''}</p>
      <form class="budget-form" data-category="${r.slug}">
        <label>Monthly budget <input type="number" name="budget" min="0" step="1" value="${r.budget}"></label>
        <button type="submit">Update budget</button>
      </form>
    </div>`).join('')}
  </div>`;
}

export function billsView(state) {
  const unpaid = state.bills.filter((b) => !b.paid).length;
  const items = [...state.bills].sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
  return `
  <h1>Bills and reminders</h1>
  <p class="lede">${unpaid} ${unpaid === 1 ? 'bill' : 'bills'} still unpaid. Mark each one paid as it clears the account.</p>
  <div class="card">
    <ul class="bill-list">
      ${items.map((b) => `
      <li class="${b.paid ? 'paid' : 'due'}">
        <span class="bill-name">${esc(b.name)}</span>
        <span class="bill-meta">Due ${esc(b.dueDate)} &middot; ${money(b.amount)}</span>
        <span class="bill-status">${b.paid ? 'Paid' : 'Unpaid'}</span>
        <button type="button" data-action="toggle-bill" data-id="${b.id}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button>
      </li>`).join('')}
    </ul>
  </div>
  <div class="card">
    <h2>Coming up</h2>
    <p>Electricity is due 28 November, internet on 30 November and water on 3 December. Rent and car insurance are already settled for the month.</p>
  </div>`;
}

export function goalsView(state) {
  return `
  <h1>Savings goals</h1>
  <p class="lede">What the Alvarez family is saving toward, and how close each goal is.</p>
  <div class="goal-list">
    ${state.goals.map((g) => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      return `
    <div class="card goal-row">
      <div class="goal-head">
        <h2>${esc(g.name)}</h2>
        <span class="goal-amount">${money(g.saved)} of ${money(g.target)}</span>
      </div>
      <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill" style="width: ${pct}%"></div>
      </div>
      <p class="goal-note">${pct}% saved &middot; ${money(g.target - g.saved)} to go</p>
      <form class="goal-form" data-goal="${g.id}">
        <label>Add to this goal <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00"></label>
        <button type="submit">Add savings</button>
      </form>
    </div>`;
    }).join('')}
  </div>`;
}

export { monthlyTrend };
