# GenAI Platform Backend - Standalone Server

A simple, free, and portable Node.js/Express backend for the GenAI Platform dashboard. 

## Features

✅ **Zero Cloud Dependencies** - No AWS, Azure, or GCP required  
✅ **Free to Deploy** - Works on Vercel, Netlify, Replit, or run locally  
✅ **Optional Backend** - Frontend works fine without it (uses localStorage)  
✅ **Admin Metrics API** - Track AI usage and costs  
✅ **Session Persistence** - Store all interactions to JSON file  

## Quick Start

### Local Development

```bash
cd backend
npm install
node server.js
```

Server starts on `http://localhost:3000`

### API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Get metrics (admin dashboard)
curl http://localhost:3000/api/admin/usage?limit=50

# Store a session (auto-called by frontend)
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","response":"answer","model":"mixtral-8x7b-32768"}'
```

## Deployment Options

### Option 1: Vercel (Recommended - Free Tier)

```bash
npm i -g vercel
vercel deploy
```

Then set `VITE_BACKEND_URL=https://your-project.vercel.app` in frontend `.env`

### Option 2: Netlify Functions

```bash
npm i -g netlify-cli
netlify deploy
```

### Option 3: Replit (Free)

1. Create new Replit project
2. Import from GitHub repo
3. Run `node backend/server.js`
4. Use Replit URL as `VITE_BACKEND_URL`

### Option 4: Railway (Free tier available)

1. Connect GitHub repo
2. Deploy `backend/` folder
3. Set PORT environment variable

## Configuration

### Environment Variables

```env
# Port (default: 3000)
PORT=5000

# Data storage location
SESSIONS_FILE=./sessions.json
```

## Data Storage

Sessions are saved to `backend/sessions.json`:

```json
[
  {
    "id": "1234567890-abc123",
    "timestamp": "2024-01-01T12:00:00Z",
    "prompt": "What is AI?",
    "userId": "user@example.com",
    "projectId": "dashboard",
    "result": {
      "model": "mixtral-8x7b-32768",
      "provider": "groq",
      "text": "AI is..."
    },
    "usage": {
      "inputTokens": 10,
      "outputTokens": 50,
      "totalTokens": 60,
      "latencyMs": 1200
    }
  }
]
```

## Production Deployment

### Vercel Example (vercel.json)

```json
{
  "buildCommand": "npm install",
  "outputDirectory": ".",
  "env": {
    "NODE_ENV": "production",
    "PORT": "3000"
  }
}
```

### Netlify Functions Example

Convert `server.js` to serverless function:

```javascript
// functions/api.js
const app = require('../backend/server.js');
exports.handler = app;
```

## Security Notes

⚠️ **This backend is intentionally simple for portfolio purposes.**

For production:
- Add authentication to admin endpoints
- Rate limit API calls
- Use HTTPS only
- Store sessions in a real database (PostgreSQL, MongoDB)
- Add input validation
- Use environment variables for secrets

## Local Frontend + Backend Development

```bash
# Terminal 1: Backend
cd backend
npm install
node server.js

# Terminal 2: Frontend
cd frontend/genai-pro-dashboard
npm install
VITE_BACKEND_URL=http://localhost:3000 npm run dev
```

Then visit `http://localhost:5173` and it will sync metrics with the backend!

## Troubleshooting

**Sessions not saving?**
- Check `backend/sessions.json` exists and is writable
- Check `NODE_ENV` is not set to restrictive value

**Backend not accessible from frontend?**
- Ensure CORS is enabled (it is by default)
- Check firewall/network settings
- Verify `VITE_BACKEND_URL` is correct

**Port 3000 already in use?**
```bash
PORT=5000 node server.js
```

## What's Different from AWS Version?

| Aspect | AWS Version | Standalone |
|--------|---|---|
| Compute | Lambda | Node.js Express |
| Database | DynamoDB | JSON file |
| Cost | $0 (free tier) | $0 (free tier) |
| Deployment | CDK + API Gateway | Direct Node.js |
| Setup Complexity | High | Low |
| Portfolio Value | Cloud experience | Full-stack experience |

## Next Steps

- [Deploy to Vercel](https://vercel.com/docs/frameworks/express)
- [Deploy to Netlify](https://docs.netlify.com/functions/overview/)
- [Learn Express.js](https://expressjs.com/)
- [Frontend README](../STANDALONE_README.md)

---

Built for portfolio showcase. Keep it simple, impressive, and impressive. ✨
