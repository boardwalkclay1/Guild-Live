// /assets/js/live/watchlist.js

async function renderWatchlist() {
  const tbody = document.getElementById('watchlist-body');
  tbody.innerHTML = `<tr><td colspan="5" class="gl-muted">Loading...</td></tr>`;

  try {
    const list = await window.AlpacaClient.getWatchlist();

    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="gl-muted">No symbols yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = '';

    for (const symbol of list) {
      const quote = await window.AlpacaClient.getQuote(symbol);

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${symbol}</td>
        <td>${quote.last}</td>
        <td>${quote.change}</td>
        <td>${quote.percent}</td>
        <td><button class="gl-btn-secondary gl-btn-small" data-symbol="${symbol}">Remove</button></td>
      `;
      tbody.appendChild(row);
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="gl-muted">Error loading watchlist</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('watchlist-add-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const symbol = form.symbol.value.trim().toUpperCase();
    if (!symbol) return;

    try {
      await window.AlpacaClient.addToWatchlist(symbol);
      form.reset();
      renderWatchlist();
    } catch (err) {
      alert(err.message || 'Failed to add symbol');
    }
  });

  document.getElementById('watchlist-body').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-symbol]');
    if (!btn) return;

    const symbol = btn.dataset.symbol;
    try {
      await window.AlpacaClient.removeFromWatchlist(symbol);
      renderWatchlist();
    } catch (err) {
      alert(err.message || 'Failed to remove symbol');
    }
  });

  renderWatchlist();
});
