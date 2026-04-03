// CORE UTILITIES FOR GUILD LIVE

// Base Worker endpoint
const WORKER = '/api';

// Generic GET
export async function get(path) {
  const res = await fetch(`${WORKER}${path}`);
  return res.json();
}

// Generic POST
export async function post(path, body) {
  const res = await fetch(`${WORKER}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

// Alpaca API wrapper (Worker handles keys)
export const api = {
  account: () => get('/account'),
  positions: () => get('/positions'),
  orders: () => get('/orders'),
  watchlist: () => get('/watchlist'),
  addToWatchlist: (symbol) => post('/watchlist/add', { symbol }),
  removeFromWatchlist: (symbol) => post('/watchlist/remove', { symbol }),
  quote: (symbol) => get(`/quote/${symbol}`),
  bars: (symbol, tf) => get(`/bars/${symbol}/${tf}`),
  trade: (order) => post('/trade', order),
  deposit: (amount) => post('/deposit', { amount }),
  withdraw: (amount) => post('/withdraw', { amount }),
  linkBank: () => post('/link-bank', {}),
  kyc: (data) => post('/kyc', data)
};
