// /assets/js/live/positions.js

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('positions-body');
  tbody.innerHTML = `<tr><td colspan="6" class="gl-muted">Loading...</td></tr>`;

  try {
    const positions = await window.AlpacaClient.getPositions();

    if (!positions.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="gl-muted">No positions.</td></tr>`;
      return;
    }

    tbody.innerHTML = '';

    positions.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.symbol}</td>
        <td>${p.qty}</td>
        <td>$${p.avg_entry_price}</td>
        <td>$${p.market_value}</td>
        <td>$${p.unrealized_intraday_pl}</td>
        <td>$${p.unrealized_pl}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="gl-muted">Error loading positions</td></tr>`;
  }
});
