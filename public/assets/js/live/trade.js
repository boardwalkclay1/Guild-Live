// /assets/js/live/trade.js

async function updateQuote(symbol) {
  if (!symbol) return;
  try {
    const q = await window.AlpacaClient.getQuote(symbol);
    document.getElementById('quote-symbol').textContent = symbol;
    document.getElementById('quote-price').textContent = q.last;
    document.getElementById('quote-change').textContent = q.change;
    document.getElementById('quote-percent').textContent = q.percent;
  } catch (err) {
    document.getElementById('quote-symbol').textContent = symbol;
    document.getElementById('quote-price').textContent = '–';
    document.getElementById('quote-change').textContent = '–';
    document.getElementById('quote-percent').textContent = '–';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trade-form');
  const symbolInput = form.symbol;

  symbolInput.addEventListener('change', () => {
    const symbol = symbolInput.value.trim().toUpperCase();
    updateQuote(symbol);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const order = {
      symbol: data.symbol.trim().toUpperCase(),
      side: data.side,
      qty: Number(data.qty),
      type: data.type,
      time_in_force: data.time_in_force
    };

    if (order.type === 'limit') {
      order.limit_price = Number(data.limit_price);
    }

    try {
      const res = await window.AlpacaClient.placeOrder(order);
      alert('Order submitted');
      form.reset();
    } catch (err) {
      alert(err.message || 'Order failed');
    }
  });
});
