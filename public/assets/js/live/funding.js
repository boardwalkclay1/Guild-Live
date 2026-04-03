// /assets/js/live/funding.js

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-link-bank').addEventListener('click', async () => {
    try {
      const res = await window.AlpacaClient.linkBank();
      alert('Bank link initiated');
    } catch (err) {
      alert(err.message || 'Failed to link bank');
    }
  });

  document.getElementById('deposit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = Number(e.target.amount.value);
    if (!amount) return;

    try {
      await window.AlpacaClient.deposit(amount);
      alert('Deposit submitted');
      e.target.reset();
    } catch (err) {
      alert(err.message || 'Deposit failed');
    }
  });

  document.getElementById('withdraw-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = Number(e.target.amount.value);
    if (!amount) return;

    try {
      await window.AlpacaClient.withdraw(amount);
      alert('Withdrawal submitted');
      e.target.reset();
    } catch (err) {
      alert(err.message || 'Withdrawal failed');
    }
  });
});
