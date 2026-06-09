# GenAI Platform Starter - Standalone Edition

> A **free**, **production-ready** AI platform for your portfolio. No cloud provider lock-in. Deploy anywhere.

## 🎯 What This Is

A full-stack AI application showcasing:
- ✅ Direct LLM integration (Groq API)
- ✅ React dashboard with metrics
- ✅ Admin metrics endpoint
- ✅ Completely free to run and deploy
- ✅ Zero AWS/cloud dependencies
- ✅ GitHub Pages ready (frontend)
- ✅ Optional standalone backend (Vercel/Netlify/local)

Perfect for your **AI Engineer portfolio** - shows you understand:
- Frontend development (React, Vite, Tailwind)
- Backend APIs (Node.js, Express)
- API integration (Groq)
- Data management (localStorage, JSON)
- DevOps/Deployment (GitHub Pages, Vercel)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Groq API Key (Free)
1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up (free)
3. Create API key
4. Copy the key

### Step 2: Configure Frontend

```bash
cd frontend/genai-pro-dashboard
npm install
cp .env.example .env.local
# Edit .env.local and paste your Groq API key
npm run dev
```

Visit `http://localhost:5173` and try the dashboard!

### Step 3 (Optional): Run Backend

```bash
cd backend
npm install
node server.js
```

Backend runs on `http://localhost:3000`

Update frontend `.env.local`:
```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## 📦 Project Structure

```
genai-platform-starter/
├── frontend/                    # React dashboard
│   └── genai-pro-dashboard/
│       ├── src/
│       │   ├── pages/          # Playground, Dashboard
│       │   ├── components/     # UI components
│       │   ├── api.js          # Groq + Backend API calls
│       │   └── config/         # Models, pricing, etc.
│       ├── package.json
│       └── vite.config.mjs
│
├── backend/                     # Node.js/Express server (optional)
│   ├── server.js               # Main server
│   ├── package.json
│   ├── README.md               # Backend docs
│   └── sessions.json           # Session storage
│
└── README.md                    # This file
```

---

## 🎮 Features

### 1. AI Playground
- Ask any question to Groq LLM
- Select from available models
- Track token usage
- See response latency
- Clear conversation

### 2. Admin Dashboard
- View all past interactions
- Track token usage
- Monitor request latency
- See user/project breakdowns
- Real-time metrics

### 3. Multiple Models (via Groq)
- `mixtral-8x7b-32768` (Free, fast)
- `llama-2-70b-chat` (Powerful)
- `llama3-8b-8192` (Lightweight)

### 4. Zero Configuration Deployment

**Frontend only (GitHub Pages):**
```bash
git push origin main
# Auto-deployed to GitHub Pages
```

**With backend (Vercel):**
```bash
vercel deploy
```

---

## 🏗️ Architecture

### Frontend → Groq (Direct)
```
React App (Browser)
    ↓
Groq API (Direct HTTPS call)
    ↓
LLM Response
    ↓
localStorage (Metrics)
```

### Frontend → Backend (Optional)
```
React App (Browser)
    ↓
Backend API (Express)
    ↓
sessions.json (File storage)
    ↓
Admin metrics API
```

### Both work independently!
- Frontend works without backend (uses localStorage)
- Backend is optional for persistent metrics
- Deploy just frontend or full stack

---

## 📚 Deployment Guides

### Deploy Frontend to GitHub Pages

1. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Source: GitHub Actions
   - Save

2. **Push to main:**
   ```bash
   git add .
   git commit -m "Deploy"
   git push origin main
   ```

3. **View live:**
   - GitHub Actions will auto-build and deploy
   - Site: `https://username.github.io/genai-platform-starter/`

### Deploy Backend to Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd backend
vercel deploy

# Get URL and update frontend .env
# VITE_BACKEND_URL=https://your-project.vercel.app
```

### Deploy Backend to Netlify (Free)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd backend
netlify deploy
```

### Run Backend Locally

```bash
cd backend
npm install
node server.js
# Server on http://localhost:3000
```

---

## 🔧 Configuration

### Frontend (.env.local)

```env
# REQUIRED: Get from https://console.groq.com/keys
VITE_GROQ_API_KEY=gsk_xxxxxxxxxx

# OPTIONAL: Backend URL for persistent metrics
VITE_BACKEND_URL=

# Auto-set by GitHub Actions
VITE_BASE_PATH=/
```

### Backend (.env)

```env
# Default: 3000
PORT=3000

# Sessions file location
SESSIONS_FILE=./sessions.json
```

---

## 🧪 Testing Locally

### Full Stack (Frontend + Backend)

```bash
# Terminal 1: Start backend
cd backend
npm install
node server.js

# Terminal 2: Start frontend
cd frontend/genai-pro-dashboard
npm install
VITE_BACKEND_URL=http://localhost:3000 npm run dev
```

Visit: `http://localhost:5173`

### Frontend Only

```bash
cd frontend/genai-pro-dashboard
npm install
npm run dev
```

Visit: `http://localhost:5173`

Metrics stored in browser localStorage (clears if you clear browser data).

---

## 📊 API Reference

### Groq API (Frontend calls this directly)

```bash
POST https://api.groq.com/openai/v1/chat/completions
Authorization: Bearer ${GROQ_API_KEY}
Content-Type: application/json

{
  "model": "mixtral-8x7b-32768",
  "messages": [{"role": "user", "content": "What is AI?"}],
  "temperature": 0.7,
  "max_tokens": 1024
}
```

### Backend API (Optional)

```bash
# Health check
GET /health

# Get admin metrics
GET /api/admin/usage?limit=50

# Store session (auto-called by frontend)
POST /api/sessions
{
  "prompt": "...",
  "response": "...",
  "model": "...",
  "userId": "..."
}

# Clear all sessions (admin)
DELETE /api/admin/sessions
```

---

## 💡 Portfolio Talking Points

✅ **Full-stack development:** React, Node.js, APIs  
✅ **API integration:** Direct LLM calls, no proxy  
✅ **DevOps:** GitHub Actions, GitHub Pages, Vercel  
✅ **Modern stack:** Vite, Tailwind, Express  
✅ **Zero-cost deployment:** Free tier usage only  
✅ **Scalable architecture:** Works with or without backend  
✅ **Real usage tracking:** Metrics dashboard  

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not configured" | Check `.env.local` has `VITE_GROQ_API_KEY` |
| App doesn't load | Check browser console for errors |
| Backend not connecting | Verify `VITE_BACKEND_URL` is correct |
| Metrics not saving | Check localStorage permissions (browser settings) |
| Groq API errors | Check [Groq status](https://status.groq.com) |

---

## 🚀 Next Steps

1. **Deploy frontend:** Push to GitHub, enable Pages
2. **Get live URL:** GitHub Pages auto-deploys
3. **Optional backend:** Deploy to Vercel
4. **Showcase:** Add to portfolio with before/after metrics

---

## 📄 File Structure Details

### Frontend

- **pages/Playground.jsx** - Main LLM interface
- **pages/Dashboard.jsx** - Admin metrics dashboard
- **api.js** - All API calls (Groq + Backend)
- **config/** - Models, pricing, org structure
- **components/** - Reusable UI components

### Backend

- **server.js** - Express app with all endpoints
- **sessions.json** - Stores all interactions

### Config Files

- **.env.example** - Template for frontend config
- **package.json** - Dependencies
- **vite.config.mjs** - Frontend build config
- **tailwind.config.cjs** - Styling config

---

## 🔒 Security Notes

✅ **Safe for portfolio:** Groq API key in environment variables  
✅ **No auth needed:** Simple backend (portfolio project)  
⚠️ **Don't commit .env:** Add to `.gitignore`  

For production deployment, add:
- Authentication to admin endpoints
- Rate limiting
- Input validation
- HTTPS enforcement

---

## 📖 Learn More

- [Groq Documentation](https://console.groq.com/docs)
- [React Guide](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🎓 Use This For

✨ Portfolio projects  
✨ Learning full-stack development  
✨ Understanding LLM APIs  
✨ Free AI tool prototypes  
✨ Team AI showcases  

---

## 📝 License

MIT - Use freely for portfolios and learning

---

**Ready to showcase your AI skills? Deploy now!** 🚀
