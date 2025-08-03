import express from 'express';
import crypto from 'crypto';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// In-memory storage
const urlDatabase = {};

// Helper: Validate URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Helper: Generate 6-char alphanumeric code
function generateCode() {
  return crypto.randomBytes(4).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'URL Shortener API is running (Node.js)' });
});

// POST /api/shorten
app.post('/api/shorten', (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  // Generate unique code
  let code;
  do {
    code = generateCode();
  } while (urlDatabase[code]);
  // Store mapping
  urlDatabase[code] = {
    originalUrl: url,
    createdAt: new Date().toISOString(),
    clicks: 0
  };
  res.json({ shortCode: code });
});

// GET /:short_code
app.get('/:short_code', (req, res) => {
  const { short_code } = req.params;
  const entry = urlDatabase[short_code];
  if (!entry) {
    return res.status(404).json({ error: 'Short code not found' });
  }
  entry.clicks++;
  res.redirect(entry.originalUrl);
});

// GET /api/stats/:short_code
app.get('/api/stats/:short_code', (req, res) => {
  const { short_code } = req.params;
  const entry = urlDatabase[short_code];
  if (!entry) {
    return res.status(404).json({ error: 'Short code not found' });
  }
  res.json({
    originalUrl: entry.originalUrl,
    createdAt: entry.createdAt,
    clicks: entry.clicks
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 