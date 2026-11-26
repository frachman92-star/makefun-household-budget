// Canvas charts for HomeLedger. Plain 2D canvas, no libraries, no network.

const BAR_COLOR = '#2e7d6b';
const BAR_COLOR_OVER = '#b4452f';
const TREND_COLOR = '#2e7d6b';
const GRID_COLOR = '#e3e6e1';
const TEXT_COLOR = '#5a615c';

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || canvas.width;
  const h = canvas.clientHeight || canvas.height;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function niceMax(value) {
  const step = value > 1000 ? 500 : value > 100 ? 100 : 50;
  return Math.ceil(value / step) * step;
}

// Horizontal bars: one per category, longest bar is the biggest spender.
export function drawCategoryChart(canvas, rows) {
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  ctx.clearRect(0, 0, w, h);
  const labelW = 96;
  const top = 8;
  const bottom = 8;
  const gap = 6;
  const barH = Math.min(24, (h - top - bottom - gap * (rows.length - 1)) / rows.length);
  const max = niceMax(Math.max(...rows.map((r) => r.spent), 1));
  ctx.font = '12px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  rows.forEach((row, i) => {
    const y = top + i * (barH + gap);
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = 'right';
    ctx.fillText(row.label, labelW - 8, y + barH / 2);
    const barW = ((w - labelW - 64) * row.spent) / max;
    ctx.fillStyle = row.spent > row.budget ? BAR_COLOR_OVER : BAR_COLOR;
    ctx.beginPath();
    ctx.roundRect(labelW, y, Math.max(barW, 2), barH, 4);
    ctx.fill();
    ctx.fillStyle = '#33413a';
    ctx.textAlign = 'left';
    ctx.fillText('$' + Math.round(row.spent).toLocaleString('en-US'), labelW + barW + 8, y + barH / 2);
  });
}

// Vertical bars: monthly spending, June through November.
export function drawTrendChart(canvas, months) {
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  ctx.clearRect(0, 0, w, h);
  const left = 44;
  const right = 12;
  const top = 14;
  const bottom = 26;
  const plotW = w - left - right;
  const plotH = h - top - bottom;
  const max = niceMax(Math.max(...months.map((m) => m.spent)));
  ctx.font = '11px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  for (let g = 0; g <= 4; g++) {
    const value = (max * g) / 4;
    const y = top + plotH - (plotH * g) / 4;
    ctx.strokeStyle = GRID_COLOR;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(w - right, y);
    ctx.stroke();
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = 'right';
    ctx.fillText('$' + Math.round(value).toLocaleString('en-US'), left - 6, y);
  }
  const slot = plotW / months.length;
  const barW = Math.min(44, slot * 0.55);
  months.forEach((m, i) => {
    const barH = (plotH * m.spent) / max;
    const x = left + i * slot + (slot - barW) / 2;
    const y = top + plotH - barH;
    ctx.fillStyle = i === months.length - 1 ? '#1f5c4e' : TREND_COLOR;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 4);
    ctx.fill();
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = 'center';
    ctx.fillText(m.month, left + i * slot + slot / 2, top + plotH + 14);
  });
}
