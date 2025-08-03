# URL Shortener Backend (Node.js)

This is the backend for the URL Shortener service, built with Node.js and Express.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   The server will run on port 5000 by default.

3. Run tests:
   ```bash
   npm test
   ```

## Endpoints
- `POST /api/shorten` — Shorten a URL
- `GET /:short_code` — Redirect to the original URL
- `GET /api/stats/:short_code` — Get analytics for a short code
- `GET /api/health` — Health check

## Notes
- All data is stored in memory and will be lost on server restart.
- No authentication or rate limiting is implemented. 