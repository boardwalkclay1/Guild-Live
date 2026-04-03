// /assets/js/live/settings.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('settings-form');

  // Simple local storage settings
  const saved = JSON.parse(localStorage.getItem('guild_live_settings') || '{}');

  if (saved.theme) form.theme.value = saved.theme;
  if (saved.confirm_orders !== undefined) form.confirm_orders.checked = saved.confirm_orders;
  if (saved.email_confirms !== undefined) form.email_confirms.checked = saved.email_confirms;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const settings = {
      theme: form.theme.value,
      confirm_orders: form.confirm_orders.checked,
      email_confirms: form.email_confirms.checked
    };
    localStorage.setItem('guild_live_settings', JSON.stringify(settings));
    alert('Settings saved');
  });
});
