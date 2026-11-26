// HomeLedger views: one render function per page, each returns the HTML
// for its section. All figures come from the live state, so every edit
// the user makes shows up on the next render.

export function money(amount) {
  const sign = amount < 0 ? '-' : '';
  const value = Math.abs(amount);
  return sign + '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function esc(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function totalIncome(state) {
  return state.income.reduce((sum, item) => sum + item.amount, 0);
}

export function spentByCategory(state) {
  const spent = {};
  state.categories.forEach((c) => { spent[c.id] = 0; });
  state.transactions.forEach((t) => {
    spent[t.category] = (spent[t.category] || 0) + t.amount;
  });
  return spent;
}

export function totalSpent(state) {
  return state.transactions.reduce((sum, t) => sum + t.amount, 0);
}

function categoryName(state, id) {
  const cat = state.categories.find((c) => c.id === id);
  return cat ? cat.name : id;
}

function progressBar(pct, color, warn) {
  const clamped = Math.max(0, Math.min(100, pct));
  const cls = warn ? 'bar-fill over' : 'bar-fill';
  return '<div class="bar"><div class="' + cls + '" style="width:' + clamped + '%;background:' + color + '"></div></div>';
}

function statCard(label, value, sub) {
  return '<div class="card stat"><div class="stat-label">' + label + '</div>'
    + '<div class="stat-value">' + value + '</div>'
    + '<div class="stat-sub">' + sub + '</div></div>';
}

export function renderDashboard(state) {
  const income = totalIncome(state);
  const spent = totalSpent(state);
  const left = income - spent;
  const spentNoSavings = spent - (spentByCategory(state).savings || 0);
  const savingsRate = income > 0 ? Math.round(((spentByCategory(state).savings || 0) / income) * 100) : 0;
  const byCat = spentByCategory(state);
  const topCats = state.categories
    .filter((c) => c.id !== 'savings')
    .map((c) => ({ ...c, spent: byCat[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 4);
  const unpaid = state.bills.filter((b) => !b.paid);
  const nextBill = unpaid.length ? unpaid[0] : null;
  const goals = state.goals;
  const goalDone = goals.reduce((s, g) => s + g.saved, 0);
  const goalTarget = goals.reduce((s, g) => s + g.target, 0);

  let html = '<section class="page-head"><h1>November budget at a glance</h1>'
    + '<p>Income, spending and savings for the Alvarez household, updated as you add things.</p></section>';

  html += '<section class="stats">'
    + statCard('Monthly income', money(income), 'Maya salary + Jordan freelance')
    + statCard('Spent so far', money(spent), 'Across ' + state.transactions.length + ' transactions')
    + statCard('Left to spend', money(left), left >= 0 ? 'On track for the month' : 'Over the monthly income')
    + statCard('Savings rate', savingsRate + '%', money(byCat.savings || 0) + ' moved to savings')
    + '</section>';

  html += '<section class="grid-two">'
    + '<div class="card"><h2>Spending vs budget</h2>'
    + '<canvas id="cat-chart" class="chart" width="640" height="300" aria-label="Bar chart of spending against budget per category"></canvas>'
    + '<p class="hint">Pale bars are the budget, solid bars are what you spent. Red means over budget.</p></div>'
    + '<div class="card"><h2>Income vs spending, Jun to Nov</h2>'
    + '<canvas id="trend-chart" class="chart" width="640" height="300" aria-label="Line chart of income and spending over six months"></canvas>'
    + '<p class="hint">Spending stays under income every month, which is how the emergency fund keeps growing.</p></div>'
    + '</section>';

  html += '<section class="grid-two">'
    + '<div class="card"><h2>Biggest costs this month</h2><ul class="rank-list">'
    + topCats.map((c) => '<li><span class="dot" style="background:' + c.color + '"></span>'
      + '<span class="rank-name">' + esc(c.name) + '</span>'
      + '<span class="rank-amount">' + money(c.spent) + '</span>'
      + '<span class="rank-note">of ' + money(c.budget) + ' budgeted</span></li>').join('')
    + '</ul><p><a class="link" href="#/transactions">See every transaction</a></p></div>'
    + '<div class="card"><h2>Bills and goals</h2>'
    + '<p>' + (nextBill
      ? 'Next bill: <strong>' + esc(nextBill.name) + ' ' + money(nextBill.amount) + '</strong>, due on the ' + nextBill.dueDay + 'th.'
      : 'Every bill this month is paid. Nice work.') + '</p>'
    + '<p>' + unpaid.length + ' of ' + state.bills.length + ' bills still to pay.</p>'
    + '<p>Savings goals: <strong>' + money(goalDone) + '</strong> saved toward <strong>' + money(goalTarget) + '</strong> in total.</p>'
    + '<p><a class="link" href="#/bills">Review bills</a> &middot; <a class="link" href="#/goals">Review goals</a></p></div>'
    + '</section>';

  html += '<section class="card"><h2>Where the money went</h2>'
    + '<p class="hint">Groceries and childcare are the two flexible costs to watch: groceries run about $30 under budget most weeks, and the nursery fees are fixed.</p>'
    + '<p>Non-savings spending so far is <strong>' + money(spentNoSavings) + '</strong>. At this pace the month ends about <strong>' + money(left) + '</strong> ahead, which goes straight into the emergency fund.</p></section>';

  return html;
}

export function renderTransactions(state, editingId) {
  const rows = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  const options = state.categories
    .map((c) => '<option value="' + c.id + '">' + esc(c.name) + '</option>')
    .join('');
  const editing = editingId ? state.transactions.find((t) => t.id === editingId) : null;

  let html = '<section class="page-head"><h1>Transactions</h1>'
    + '<p>Every pound in and out, newest first. Add one, fix one, or remove one, and the dashboard updates at once.</p></section>';

  html += '<section class="card"><h2>' + (editing ? 'Edit transaction' : 'Add a transaction') + '</h2>'
    + '<form id="tx-form" class="form-grid">'
    + '<label>Description<input name="description" required maxlength="80" value="' + esc(editing ? editing.description : '') + '" placeholder="e.g. Weekly shop, Green Mart"></label>'
    + '<label>Amount ($) <input name="amount" type="number" min="0.01" step="0.01" required value="' + (editing ? editing.amount : '') + '" placeholder="0.00"></label>'
    + '<label>Category<select name="category">' + options + '</select></label>'
    + '<label>Date<input name="date" type="date" required value="' + (editing ? editing.date : '2026-11-26') + '"></label>'
    + '<label class="wide">Note<input name="note" maxlength="120" value="' + esc(editing ? editing.note : '') + '" placeholder="What was this for?"></label>'
    + '<input type="hidden" name="editId" value="' + (editing ? editing.id : '') + '">'
    + '<div class="form-actions"><button type="submit" class="btn">' + (editing ? 'Save changes' : 'Add transaction') + '</button>'
    + (editing ? '<a class="btn ghost" href="#/transactions">Cancel</a>' : '')
    + '</div></form></section>';

  html += '<section class="card"><h2>' + rows.length + ' transactions, ' + money(totalSpent(state)) + ' in total</h2>'
    + '<div class="table-wrap"><table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Note</th><th class="num">Amount</th><th></th></tr></thead><tbody>'
    + rows.map((t) => '<tr><td>' + esc(t.date) + '</td><td>' + esc(t.description) + '</td>'
      + '<td>' + esc(categoryName(state, t.category)) + '</td><td class="muted">' + esc(t.note) + '</td>'
      + '<td class="num">' + money(t.amount) + '</td>'
      + '<td class="row-actions"><button class="btn small" data-action="edit-tx" data-id="' + t.id + '">Edit</button> '
      + '<button class="btn small danger" data-action="delete-tx" data-id="' + t.id + '">Delete</button></td></tr>').join('')
    + '</tbody></table></div></section>';
  return html;
}

export function renderBudgets(state) {
  const byCat = spentByCategory(state);
  const income = totalIncome(state);
  const totalBudget = state.categories.reduce((s, c) => s + c.budget, 0);

  let html = '<section class="page-head"><h1>Category budgets</h1>'
    + '<p>Monthly income is ' + money(income) + ' and the budgets add up to ' + money(totalBudget) + ', leaving ' + money(income - totalBudget) + ' unassigned for surprises. Change any budget and the bars move.</p></section>';

  html += '<section class="budget-list">'
    + state.categories.map((c) => {
      const spent = byCat[c.id] || 0;
      const pct = c.budget > 0 ? Math.round((spent / c.budget) * 100) : 0;
      const over = spent > c.budget;
      return '<div class="card budget-row"><div class="budget-top"><span class="dot" style="background:' + c.color + '"></span>'
        + '<h2>' + esc(c.name) + '</h2>'
        + '<span class="budget-amount">' + money(spent) + ' of ' + money(c.budget) + '</span></div>'
        + progressBar(pct, c.color, over)
        + '<p class="budget-note">' + pct + '% used'
        + (over ? ' &middot; <strong class="warn">Over budget by ' + money(spent - c.budget) + '</strong>' : ' &middot; ' + money(c.budget - spent) + ' left')
        + '</p>'
        + '<form class="budget-form" data-category="' + c.id + '"><label>Monthly budget ($)'
        + '<input type="number" name="budget" min="0" step="1" value="' + c.budget + '" required></label>'
        + '<button type="submit" class="btn small">Update budget</button></form></div>';
    }).join('')
    + '</section>';
  return html;
}

export function renderBills(state) {
  const unpaid = state.bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const paidTotal = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);

  let html = '<section class="page-head"><h1>Bills and reminders</h1>'
    + '<p>' + unpaid.length + ' bills still to pay this month, ' + money(unpaidTotal) + ' in total. ' + money(paidTotal) + ' already paid. Tick a bill off when it clears.</p></section>';

  html += '<section class="card"><h2>Add a bill</h2>'
    + '<form id="bill-form" class="form-grid">'
    + '<label>Bill name<input name="name" required maxlength="60" placeholder="e.g. Water"></label>'
    + '<label>Amount ($)<input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></label>'
    + '<label>Due day of month<input name="dueDay" type="number" min="1" max="31" required value="1"></label>'
    + '<label class="wide">Note<input name="note" maxlength="120" placeholder="What is this for?"></label>'
    + '<div class="form-actions"><button type="submit" class="btn">Add bill</button></div></form></section>';

  html += '<section class="card"><h2>This month&rsquo;s bills</h2><ul class="bill-list">'
    + [...state.bills].sort((a, b) => a.dueDay - b.dueDay).map((b) => '<li class="' + (b.paid ? 'paid' : 'due') + '">'
      + '<span class="bill-day">' + b.dueDay + '<small>Nov</small></span>'
      + '<span class="bill-main"><strong>' + esc(b.name) + '</strong><span class="muted">' + esc(b.note) + '</span></span>'
      + '<span class="bill-amount">' + money(b.amount) + '</span>'
      + '<span class="bill-status">' + (b.paid ? 'Paid' : 'To pay') + '</span>'
      + '<button class="btn small" data-action="toggle-bill" data-id="' + b.id + '">' + (b.paid ? 'Mark unpaid' : 'Mark paid') + '</button>'
      + '</li>').join('')
    + '</ul></section>';
  return html;
}

export function renderGoals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const overall = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  let html = '<section class="page-head"><h1>Savings goals</h1>'
    + '<p>' + money(totalSaved) + ' saved toward ' + money(totalTarget) + ' across ' + state.goals.length + ' goals, ' + overall + '% of the way there. Add money to a goal whenever there is some left over.</p></section>';

  html += '<section class="card"><h2>Add a savings goal</h2>'
    + '<form id="goal-form" class="form-grid">'
    + '<label>Goal name<input name="name" required maxlength="60" placeholder="e.g. Holiday fund"></label>'
    + '<label>Target ($)<input name="target" type="number" min="1" step="1" required placeholder="1000"></label>'
    + '<label>Already saved ($)<input name="saved" type="number" min="0" step="1" value="0"></label>'
    + '<label class="wide">Note<input name="note" maxlength="120" placeholder="What is this for?"></label>'
    + '<div class="form-actions"><button type="submit" class="btn">Add goal</button></div></form></section>';

  html += '<section class="goal-list">'
    + state.goals.map((g) => {
      const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
      const done = g.saved >= g.target;
      return '<div class="card goal-row"><div class="goal-top"><h2>' + esc(g.name) + '</h2>'
        + '<span class="goal-amount">' + money(g.saved) + ' of ' + money(g.target) + '</span></div>'
        + progressBar(pct, '#2e6f5e', false)
        + '<p class="goal-note">' + pct + '% there &middot; ' + money(g.target - g.saved) + ' to go &middot; ' + esc(g.note) + '</p>'
        + (done ? '<p><strong class="good">Goal reached!</strong></p>' : '')
        + '<form class="goal-form" data-goal="' + g.id + '"><label>Add to this goal ($)'
        + '<input type="number" name="amount" min="0.01" step="0.01" required placeholder="50.00"></label>'
        + '<button type="submit" class="btn small">Add savings</button></form></div>';
    }).join('')
    + '</section>';
  return html;
}
