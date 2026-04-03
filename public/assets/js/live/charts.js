// /assets/js/live/charts.js

let chart, series;

function initChart() {
  const container = document.getElementById('chart-container');
  chart = LightweightCharts.createChart(container, {
    layout: { background: { color: '#000' }, textColor: '#D4AF37' },
    grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } },
    timeScale: { borderColor: '#333' },
    rightPriceScale: { borderColor: '#333' }
  });

  series = chart.addCandlestickSeries({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350'
  });
}

async function loadBars(symbol, timeframe) {
  try {
    const bars = await window.AlpacaClient.getBars(symbol, timeframe);

    const data = bars.map(b => ({
      time: Math.floor(b.t / 1000),
      open: b.o,
      high: b.h,
      low: b.l,
      close: b.c
    }));

    series.setData(data);
  } catch (err) {
    alert(err.message || 'Failed to load chart');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initChart();

  const form = document.getElementById('chart-symbol-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const symbol = form.symbol.value.trim().toUpperCase();
    const timeframe = form.timeframe.value;
    if (!symbol) return;
    loadBars(symbol, timeframe);
  });
});
