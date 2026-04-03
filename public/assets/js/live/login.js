// /assets/js/live/login.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      const res = await window.AlpacaClient.login(email, password);
      // res should contain token + maybe user info
      window.location.href = '/dashboard.html';
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  });
});
