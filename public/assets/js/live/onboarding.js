// /assets/js/live/onboarding.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('kyc-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await window.AlpacaClient.submitKyc(data);
      // res should contain account status / id
      alert('Application submitted');
      window.location.href = '/dashboard.html';
    } catch (err) {
      alert(err.message || 'Application failed');
    }
  });
});
