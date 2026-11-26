// HomeLedger charts: plain canvas drawings, no chart library.
// drawCategoryBars shows spent vs budget per category; drawTrend shows
// income vs spending over the last six months. Both scale to the canvas
// size and to the device pixel ratio so they stay sharp on a phone.

function setupCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.max(1, Math.round(width * ratio));
  canvas.height = Math.max(1, Math.round(height * ratio));
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width, height };
}

function moneyShort(value) {
  if (value >= 1000) return '$' + (value / 1000).toFixed(1) + 'k';
  return '$' + Math.round(value);
}

export function drawCategoryBars(canvas, categories, spentByCategory) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const rows = categories.filter((c) => c.id !== 'savings');
  const maxValue = Math.max(...rows.map((c) => Math.max(c.budget, spentByCategory[c.id] || 0)), 1);
  const top = 8;
  const bottom = 22;
  const rowHeight = (height - top - bottom) / rows.length;
  const labelWidth = 86;
  const rightMargin = 88;
  const barArea = width - labelWidth - rightMargin;

  ctx.font = '11px system-ui, sans-serif';
  rows.forEach((cat, i) => {
    const y = top + i * rowHeight;
    const barY = y + 5;
    const barH = Math.max(8, rowHeight - 16);
    const spent = spentByCategory[cat.id] || 0;
    const over = spent > cat.budget;
    ctx.fillStyle = '#33413c';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(cat.name, 0, barY + barH / 2);
    // Budget bar (pale) with the spent bar (solid) on top of it.
    ctx.fillStyle = '#e3e8e2';
    ctx.fillRect(labelWidth, barY, barArea, barH);
    ctx.fillStyle = over ? '#c05b5b' : cat.color;
    ctx.fillRect(labelWidth, barY, (barArea * Math.min(spent, maxValue)) / maxValue, barH);
    ctx.fillStyle = '#5a6b63';
    ctx.textAlign = 'left';
    ctx.fillText(moneyShort(spent) + ' / ' + moneyShort(cat.budget), labelWidth + barArea + 6, barY + barH / 2);
  });
  ctx.fillStyle = '#8a978f';
  ctx.textAlign = 'left';
  ctx.fillText('Spent vs budget, November', 0, height - 8);
}

export function drawTrend(canvas, trend) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const top = 14;
  const bottom = 24;
  const left = 44;
  const right = 8;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const maxValue = Math.max(...trend.map((t) => Math.max(t.income, t.spent)), 1) * 1.08;

  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = '#8a978f';
  ctx.textAlign = 'right';
  [0, 0.5, 1].forEach((f) => {
    const y = top + plotH * (1 - f);
    ctx.fillText(moneyShort(maxValue * f), left - 6, y + 4);
    ctx.strokeStyle = '#e8ede8';
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(width - right, y);
    ctx.stroke();
  });

  function line(values, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    values.forEach((v, i) => {
      const x = left + (plotW * i) / (values.length - 1);
      const y = top + plotH * (1 - v / maxValue);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = color;
    values.forEach((v, i) => {
      const x = left + (plotW * i) / (values.length - 1);
      const y = top + plotH * (1 - v / maxValue);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  line(trend.map((t) => t.income), '#2e6f5e');
  line(trend.map((t) => t.spent), '#e07856');

  ctx.fillStyle = '#33413c';
  ctx.textAlign = 'center';
  trend.forEach((t, i) => {
    const x = left + (plotW * i) / (trend.length - 1);
    ctx.fillText(t.month, x, height - 8);
  });

  ctx.textAlign = 'left';
  ctx.fillStyle = '#2e6f5e';
  ctx.fillText('Income', width - 132, 10);
  ctx.fillStyle = '#e07856';
  ctx.fillText('Spending', width - 70, 10);
}
