# 🚀 START HERE - GenAI Platform Setup Guide

Welcome! Follow this step-by-step guide to get your AI portfolio project running in **5 minutes**.

## ⏱️ What You'll Need

- **5 minutes** of your time
- **Groq API key** (free, takes 30 seconds)
- **Node.js** (download from nodejs.org if you don't have it)
- **Git** (for pushing to GitHub)

## 📋 Step-by-Step Setup

### Step 1️⃣: Get Your Groq API Key (30 seconds)

1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Click "Sign Up" (free)
3. Create your account
4. Generate API key
5. **Copy the key** (you'll need it in a moment)

### Step 2️⃣: Clone or Fork This Repository

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/genai-platform-starter.git
cd genai-platform-starter

# Or Fork on GitHub, then:
# git clone https://github.com/YOUR_USERNAME/genai-platform-starter.git
```

### Step 3️⃣: Setup Frontend

```bash
cd frontend/genai-pro-dashboard

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local and paste your Groq API key
# Windows:
notepad .env.local
# Mac/Linux:
nano .env.local

# Should look like:
# VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

### Step 4️⃣: Run Locally

```bash
# Still in frontend/genai-pro-dashboard
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
```

**Visit `http://localhost:5173` in your browser!** 🎉

### Step 5️⃣: Test the App

1. You should see the **Playground** page
2. Pick a model from the dropdown (e.g., "mixtral-8x7b-32768")
3. Type a question (e.g., "What is artificial intelligence?")
4. Click "Ask"
5. See the AI response! ✨

### Step 6️⃣: Try the Admin Dashboard

1. Click **/admin** in the navigation
2. You should see your previous question
3. Check token usage, latency, etc.

---

## 🚀 Deploy to GitHub Pages (Free!)

Once it works locally, deploy it for free:

### Step 1: Push to GitHub

```bash
# From project root
git add .
git commit -m "Deploy GenAI Platform to GitHub Pages"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to your GitHub repo
2. **Settings** → **Pages**
3. **Source:** Select "GitHub Actions"
4. Click **Save**

### Step 3: Add Your Groq API Key as Secret

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. **Name:** `VITE_GROQ_API_KEY`
4. **Value:** Paste your Groq API key
5. Click **Add secret**

### Step 4: Wait for Deployment

1. Go to **Actions** tab
2. See the build running (green checkmark ✅ when done)
3. Your site is live at:

```
https://YOUR_USERNAME.github.io/genai-platform-starter/
```

**That's it! Your AI portfolio is live!** 🚀

---

## 💡 Optional: Add Optional Backend (Advanced)

Want persistent metrics storage? Add a backend:

```bash
cd backend
npm install
node server.js
```

Then update frontend `.env.local`:
```env
VITE_BACKEND_URL=http://localhost:3000
```

To deploy backend to Vercel:
```bash
npm i -g vercel
vercel deploy backend/
# Get URL and update VITE_BACKEND_URL
```

---

## 🆘 Troubleshooting

### "Module not found" error

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "VITE_GROQ_API_KEY is not set"

✅ Make sure your `.env.local` file has:
```env
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxx
```

### App loads but says "API key not configured"

✅ Check browser DevTools (F12) → Console for error messages  
✅ Make sure `.env.local` is in `frontend/genai-pro-dashboard/`

### Site not deploying to GitHub Pages

✅ Check **Actions** tab for build errors  
✅ Make sure GitHub Pages is enabled in **Settings** → **Pages**  
✅ Make sure Groq API key is added as repository secret

---

## 📚 Next Steps

| Goal | Resource |
|------|----------|
| Understand the architecture | Read [STANDALONE_README.md](STANDALONE_README.md) |
| Learn backend setup | Read [backend/README.md](backend/README.md) |
| Deploy backend | Follow [Vercel docs](https://vercel.com/docs/frameworks/express) |
| Customize dashboard | Edit [frontend/genai-pro-dashboard/src/](frontend/genai-pro-dashboard/src/) |
| Add more models | Edit [frontend/genai-pro-dashboard/src/config/groqModels.js](frontend/genai-pro-dashboard/src/config/groqModels.js) |

---

## ✨ What You Just Built

A **full-stack AI application** with:

✅ React frontend with Vite  
✅ Real-time LLM integration (Groq)  
✅ Admin metrics dashboard  
✅ Optional Node.js backend  
✅ GitHub Pages deployment (free)  
✅ No vendor lock-in  

**Perfect for your AI Engineer portfolio!**

---

## 🎓 Learning Outcomes

This project teaches you:

- **Frontend:** React, Vite, Tailwind CSS, routing
- **Backend:** Node.js, Express.js, REST APIs
- **APIs:** Integration with external LLMs
- **DevOps:** GitHub Actions, GitHub Pages deployment
- **Full-stack:** End-to-end application development
- **Portfolio:** Building for showcasing skills

---

## 📖 Full Documentation

- **[README.md](README.md)** - Project overview
- **[STANDALONE_README.md](STANDALONE_README.md)** - Complete guide
- **[backend/README.md](backend/README.md)** - Backend details
- **[MIGRATION_TO_STANDALONE.md](MIGRATION_TO_STANDALONE.md)** - AWS migration info

---

## 🤔 Questions?

1. **Can I use a different LLM provider?** Yes! Edit the frontend code to call OpenAI, Anthropic, etc.
2. **Can I deploy elsewhere?** Yes! Use Vercel, Netlify, AWS, or any Node.js host
3. **Do I need AWS?** No! This is completely independent
4. **Is this production-ready?** For portfolio purposes, yes! For production, add auth, validation, etc.

---

## 🎉 You're All Set!

Your AI portfolio is now:
- ✅ Running locally
- ✅ Deployed to GitHub Pages  
- ✅ Ready to show employers

**Congratulations!** 🚀

---

**Need help?** See [STANDALONE_README.md](STANDALONE_README.md) for detailed docs.
