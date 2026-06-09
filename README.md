# GenAI Platform Starter - Standalone Edition

> **Build your AI portfolio with zero cloud dependencies.** Deploy to GitHub Pages for free.

> 🎯 **Start here:** Read [START_HERE.md](START_HERE.md) for 5-minute setup, or [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for complete navigation.

A production-ready **full-stack** AI application showcasing:
- ✅ React dashboard with real-time metrics
- ✅ Direct LLM integration (Groq API - free tier)
- ✅ Admin metrics endpoint
- ✅ Completely free deployment (GitHub Pages)
- ✅ Zero AWS/cloud lock-in
- ✅ Optional standalone backend (Node.js/Express)

**Perfect for your portfolio** - shows you understand full-stack AI development.

---

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Get Free Groq API Key
```bash
# Go to https://console.groq.com/keys and grab your free key
```

### 2️⃣ Setup Frontend
```bash
cd frontend/genai-pro-dashboard
npm install
cp .env.example .env.local
# Paste your Groq API key in .env.local
npm run dev
```

Visit `http://localhost:5173` 🎉

### 3️⃣ (Optional) Setup Backend
```bash
cd backend
npm install
node server.js
```

Then update frontend `.env.local`:
```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## 📊 Features

### AI Playground
- Chat with any Groq model
- Track token usage in real-time
- Monitor response latency
- Save conversation history

### Admin Dashboard  
- View all past interactions
- Track token usage per user/project
- Monitor performance metrics
- Export session data

### Metrics & Monitoring
- Request count and latency
- Token usage tracking
- Cost estimation
- User activity breakdown

---

## 🏗️ Architecture

```
Frontend (React + Vite)           Backend (Node.js + Express) [Optional]
├── Groq API (Direct)    ├─────→ Admin API endpoints
├── localStorage (metrics) └─────→ JSON file storage
└── GitHub Pages (deploy)        └─────→ Free hosting (Vercel/Netlify)
```

**Key insight:** Frontend works standalone. Backend is optional for persistent metrics.

---

## 📚 Documentation

- **[STANDALONE_README.md](STANDALONE_README.md)** - Complete guide (START HERE!)
- **[backend/README.md](backend/README.md)** - Backend server setup
- **[MIGRATION_TO_STANDALONE.md](MIGRATION_TO_STANDALONE.md)** - What changed from AWS version
- **[QUICK_START.md](QUICK_START.md)** - Quick deployment reference

---

## 🚀 Deployment

### Deploy Frontend to GitHub Pages (Free)

1. **Enable GitHub Pages:**
   - Settings → Pages → Source: GitHub Actions
   - Save

2. **Push to main:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **View live:**
   - Site: `https://username.github.io/genai-platform-starter/`
   - GitHub Actions auto-builds and deploys

### Deploy Backend (Optional)

**Vercel (Recommended):**
```bash
npm i -g vercel
cd backend
vercel deploy
# Then update VITE_BACKEND_URL in frontend .env
```

**Netlify:**
```bash
npm i -g netlify-cli
cd backend
netlify deploy
```

**Local/Self-hosted:**
```bash
cd backend
npm install
node server.js
```

---

## 🎯 Portfolio Checklist

✅ Full-stack development (React + Node.js)  
✅ API integration (Groq LLM)  
✅ DevOps/Deployment (GitHub Pages, Vercel)  
✅ Real metrics dashboard  
✅ Zero-cost infrastructure  
✅ Production-ready code  

---

## 🔧 Configuration

### Frontend (.env.local)
```env
VITE_GROQ_API_KEY=gsk_your_api_key_here
VITE_BACKEND_URL=http://localhost:3000  # Optional
```

### Backend (.env)
```env
PORT=3000
SESSIONS_FILE=./sessions.json
```

---

## 📁 Project Structure

```
genai-platform-starter/
├── frontend/
│   └── genai-pro-dashboard/        # React app (GitHub Pages)
│       ├── src/
│       │   ├── pages/              # Playground, Dashboard
│       │   ├── components/         # UI components
│       │   ├── api.js              # Groq + Backend integration
│       │   └── config/             # Models, pricing
│       └── package.json
├── backend/                         # Node.js/Express (Optional)
│   ├── server.js                   # Main API server
│   ├── sessions.json               # Session storage
│   ├── package.json
│   └── README.md
├── diagrams/                        # Architecture diagrams
├── STANDALONE_README.md             # Complete guide
├── MIGRATION_TO_STANDALONE.md       # What changed
└── README.md                        # This file
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not configured" | Add `VITE_GROQ_API_KEY` to `.env.local` |
| App doesn't load | Check browser console for errors |
| Backend not connecting | Verify `VITE_BACKEND_URL` is correct |
| Groq rate limited | Check [Groq status](https://status.groq.com) |

---

## 📖 Learn More

- [Groq API Docs](https://console.groq.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Vite Guide](https://vitejs.dev)
- [GitHub Pages Docs](https://pages.github.com)

---

## 💡 Next Steps

1. **Fork/Clone** this repo
2. **Get Groq API key** from [console.groq.com/keys](https://console.groq.com/keys)
3. **Follow [STANDALONE_README.md](STANDALONE_README.md)** for complete setup
4. **Deploy** to GitHub Pages
5. **Add to portfolio!** 🎉

---

## 📝 License

MIT - Feel free to use for your portfolio!

---

**Now 100% standalone and cloud-agnostic! No AWS required.** ✨