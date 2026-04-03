// /worker/index.js

import { Hono } from 'hono';
import { jwt } from 'hono/jwt';

const app = new Hono();

// ENV VARS
const BROKER_KEY = ALPACA_BROKER_KEY;
const BROKER_SECRET = ALPACA_BROKER_SECRET;
const DATA_KEY = ALPACA_DATA_KEY;
const DATA_SECRET = ALPACA_DATA_SECRET;

// Alpaca URLs
const BROKER_URL = "https://broker-api.sandbox.alpaca.markets/v1";
const DATA_URL = "https://data.sandbox.alpaca.markets/v2";

// Helper: Alpaca request
async function alpaca(path, method = "GET", body = null, isData = false) {
  const url = (isData ? DATA_URL : BROKER_URL) + path;

  const headers = {
    "Content-Type": "application/json",
    "APCA-API-KEY-ID": isData ? DATA_KEY : BROKER_KEY,
    "APCA-API-SECRET-KEY": isData ? DATA_SECRET : BROKER_SECRET
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Alpaca error");
  return json;
}

// AUTH — stored in D1
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();

  const row = await c.env.DB
    .prepare("SELECT id, password FROM users WHERE email = ?")
    .bind(email)
    .first();

  if (!row) return c.json({ error: "Invalid credentials" }, 401);
  if (row.password !== password) return c.json({ error: "Invalid credentials" }, 401);

  const token = await jwt.sign({ uid: row.id }, c.env.JWT_SECRET);

  return c.json({ token });
});

// Middleware: require JWT
app.use('/api/*', async (c, next) => {
  const auth = c.req.header("Authorization");
  if (!auth) return c.json({ error: "Missing token" }, 401);

  try {
    const token = auth.replace("Bearer ", "");
    c.user = await jwt.verify(token, c.env.JWT_SECRET);
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }

  await next();
});

// KYC → Alpaca
app.post('/api/kyc', async (c) => {
  const data = await c.req.json();
  const res = await alpaca("/accounts", "POST", data);
  return c.json(res);
});

// ACCOUNT
app.get('/api/account', async () => {
  const res = await alpaca("/accounts");
  return new Response(JSON.stringify(res));
});

// POSITIONS
app.get('/api/positions', async () => {
  const res = await alpaca("/accounts/positions");
  return new Response(JSON.stringify(res));
});

// ORDERS
app.get('/api/orders', async () => {
  const res = await alpaca("/trading/orders");
  return new Response(JSON.stringify(res));
});

app.post('/api/orders', async (c) => {
  const order = await c.req.json();
  const res = await alpaca("/trading/orders", "POST", order);
  return c.json(res);
});

// WATCHLIST (stored in D1)
app.get('/api/watchlist', async (c) => {
  const rows = await c.env.DB.prepare("SELECT symbol FROM watchlist WHERE user_id = ?")
    .bind(c.user.uid)
    .all();

  return c.json(rows.results.map(r => r.symbol));
});

app.post('/api/watchlist', async (c) => {
  const { symbol } = await c.req.json();
  await c.env.DB.prepare("INSERT INTO watchlist (user_id, symbol) VALUES (?, ?)")
    .bind(c.user.uid, symbol)
    .run();
  return c.json({ success: true });
});

app.delete('/api/watchlist/:symbol', async (c) => {
  const symbol = c.req.param("symbol");
  await c.env.DB.prepare("DELETE FROM watchlist WHERE user_id = ? AND symbol = ?")
    .bind(c.user.uid, symbol)
    .run();
  return c.json({ success: true });
});

// QUOTE
app.get('/api/quote/:symbol', async (c) => {
  const symbol = c.req.param("symbol");
  const res = await alpaca(`/stocks/${symbol}/quotes/latest`, "GET", null, true);
  return c.json({
    last: res.quote.ap,
    change: res.quote.ap - res.quote.bp,
    percent: ((res.quote.ap - res.quote.bp) / res.quote.bp * 100).toFixed(2)
  });
});

// BARS
app.get('/api/bars/:symbol/:tf', async (c) => {
  const { symbol, tf } = c.req.param();
  const res = await alpaca(`/stocks/${symbol}/bars?timeframe=${tf}&limit=500`, "GET", null, true);
  return c.json(res.bars);
});

// FUNDING
app.post('/api/funding/link-bank', async () => {
  return new Response(JSON.stringify({ success: true }));
});

app.post('/api/funding/deposit', async (c) => {
  const { amount } = await c.req.json();
  const res = await alpaca("/accounts/transfers", "POST", {
    transfer_type: "ach",
    direction: "INCOMING",
    amount
  });
  return c.json(res);
});

app.post('/api/funding/withdraw', async (c) => {
  const { amount } = await c.req.json();
  const res = await alpaca("/accounts/transfers", "POST", {
    transfer_type: "ach",
    direction: "OUTGOING",
    amount
  });
  return c.json(res);
});

export default app;
