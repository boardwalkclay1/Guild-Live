// /assets/js/live/dashboard.js

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const account = await window.AlpacaClient.getAccount();
    const positions = await window.AlpacaClient.getPositions();

    document.getElementById('metric-equity').textContent = `$${account.equity}`;
    document.getElementById('metric-buying-power').textContent = `$${account.buying_power}`;
    document.getElementById('metric-cash').textContent = `$${account.cash}`;

    const tbody = document.getElementById('dashboard-positions');
    tbody.innerHTML = '';

    if (!positions.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="gl-muted">No positions yet.</td></tr>`;
      return;
    }

    positions.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.symbol}</td>
        <td>${p.qty}</td>
        <td>$${p.market_value}</td>
        <td>$${p.unrealized_intraday_pl}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    alert(err.message || 'Failed to load dashboard');
  }
});
