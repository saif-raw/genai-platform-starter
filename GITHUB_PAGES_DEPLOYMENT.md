# GitHub Pages Deployment Guide

This guide explains how to deploy your GenAI Platform Starter frontend to GitHub Pages for free using **Groq API** (no AWS backend needed!).

## 📋 Prerequisites

- GitHub account
- Groq API key (free at https://console.groq.com)
- Repository pushed to GitHub

## 🚀 Quick Start (3 Steps)

### Step 1: Add Groq API Key to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - **Name**: `VITE_GROQ_API_KEY`
   - **Value**: Copy your API key from https://console.groq.com/keys (starts with `gsk_`)

### Step 2: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under "Build and deployment":
   - Select **GitHub Actions** as the source
   - Click **Save**

### Step 3: Push to GitHub

```bash
git add .
git commit -m "Setup GitHub Pages with Groq API"
git push origin main
```

**That's it!** Your app will be live at:
```
https://YOUR_USERNAME.github.io/genai-platform-starter/
```

## ✨ What Changed from AWS Version

| Feature | Before (AWS) | After (GitHub Pages) |
|---------|--------------|----------------------|
| Backend | AWS Lambda | None needed |
| Database | AWS DynamoDB | Browser localStorage |
| API Calls | API Gateway → Lambda | Direct to Groq API |
| Cost | Pay per request | Free (Groq free tier) |
| Deployment | CDK + CloudFormation | GitHub Actions (auto) |
| Session Storage | DynamoDB | localStorage (500 entries max) |

## 🔌 Supported Models

You can use any Groq-supported model. Popular free options:
- `mixtral-8x7b-32768` (Mixtral, very fast)
- `llama2-70b-4096` (Meta Llama 2)
- `gemma-7b-it` (Google Gemma)

**Update in the dashboard UI** when you run it locally.

## 📝 Detailed Setup Instructions

### For Local Development

1. **Clone and install**:
   ```bash
   cd frontend/genai-pro-dashboard
   npm install
   ```

2. **Add .env file** (already created):
   ```
   VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
   VITE_BASE_PATH=/
   ```
   Replace with your actual Groq API key from https://console.groq.com/keys

3. **Run locally**:
   ```bash
   npm run dev
   ```
   Visit: http://localhost:5173

4. **Test with Groq API**:
   - Select a department and project
   - Choose a model (e.g., "mixtral-8x7b-32768")
   - Submit a prompt
   - You should get a response from Groq!

### For GitHub Pages Deployment

The workflow (`.github/workflows/deploy-frontend.yml`) does the following:

1. Triggers on push to `main` branch
2. Installs dependencies
3. Builds React app with Vite
4. Injects `VITE_GROQ_API_KEY` from secrets
5. Deploys to GitHub Pages
6. Available at `https://YOUR_USERNAME.github.io/genai-platform-starter/`

## 🐛 Troubleshooting

### "GROQ_API_KEY is not configured"
- Verify the secret is added in GitHub Settings
- Secret name must be: `VITE_GROQ_API_KEY`
- Trigger a new deployment: **Actions** → **Deploy Frontend to GitHub Pages** → **Run workflow**

### API calls fail with errors
- Check browser console (F12) for error messages
- Verify Groq API key is valid
- Check Groq status: https://status.groq.com

### Build fails
- Check **Actions** tab for detailed logs
- Verify all files were committed (`git add .`)
- Run locally first: `npm run dev`

## 📊 Session & Usage Tracking

- **Local Storage**: Sessions stored in browser (up to 500 entries)
- **Persists across**: Same browser/device
- **Clears**: When browser cache is cleared
- **Backup**: Data is only in your browser, not on servers

To export usage data:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Run: `JSON.stringify(JSON.parse(localStorage.getItem('genai_usage_history')), null, 2)`

## 🔄 Continuous Deployment

After initial setup, deployment is **automatic**:

1. Make changes locally
2. Run: `npm run build` (verify it works)
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update dashboard"
   git push origin main
   ```
4. GitHub Actions automatically:
   - Builds your app
   - Deploys to GitHub Pages
   - Available within 1-2 minutes

## 💰 Cost

**Completely FREE!**
- GitHub Pages: Free
- Groq API: Free tier available (very generous)
- No AWS costs whatsoever

## 🎯 Next Steps

1. ✅ Add Groq API key to GitHub secrets
2. ✅ Enable GitHub Pages in Settings
3. ✅ Push to main branch
4. ✅ Visit your GitHub Pages URL
5. ✅ Test the dashboard with different models
6. ✅ Share the URL with your team!

## 📚 Additional Resources

- [Groq API Documentation](https://console.groq.com/docs/speech-text)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)

---

**Note**: This is now a fully static app. No AWS services are needed. Everything runs in the browser and calls Groq API directly!
