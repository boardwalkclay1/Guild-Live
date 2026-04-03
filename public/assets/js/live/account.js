// /assets/js/live/account.js

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const account = await window.AlpacaClient.getAccount();

    document.getElementById('account-id').textContent = account.id || '–';
    document.getElementById('account-status').textContent = account.status || '–';
    document.getElementById('profile-name').textContent = account.name || '–';
    document.getElementById('profile-email').textContent = account.email || '–';
  } catch (err) {
    alert(err.message || 'Failed to load account');
  }
});
