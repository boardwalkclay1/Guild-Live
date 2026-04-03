// /assets/js/live/orders.js

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('orders-body');
  tbody.innerHTML = `<tr><td colspan="6" class="gl-muted">Loading...</td></tr>`;

  try {
    const orders = await window.AlpacaClient.getOrders();

    if (!orders.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="gl-muted">No orders yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = '';

    orders.forEach(o => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${o.submitted_at}</td>
        <td>${o.symbol}</td>
        <td>${o.side}</td>
        <td>${o.qty}</td>
        <td>${o.type}</td>
        <td>${o.status}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="gl-muted">Error loading orders</td></tr>`;
  }
});
