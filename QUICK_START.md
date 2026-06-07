# 🚀 QUICK START: Deploy to GitHub Pages in 3 Steps

## ⚡ 3-Minute Setup

### Step 1️⃣: Add GitHub Secret (30 seconds)
1. Go to **GitHub** → Your Repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. **Name:** `VITE_GROQ_API_KEY`
5. **Value:** Your Groq API key from https://console.groq.com/keys (get your free key first!)
6. Click **Add secret**

### Step 2️⃣: Enable GitHub Pages (30 seconds)
1. **Settings** → **Pages**
2. **Build and deployment** → Select **GitHub Actions**
3. Click **Save**

### Step 3️⃣: Push Your Code (1 minute)
```bash
git add .
git commit -m "Deploy to GitHub Pages with Groq API"
git push origin main
```

## ✅ That's It!

Your app will be live at:
```
https://YOUR_USERNAME.github.io/genai-platform-starter/
```

GitHub Actions will automatically build and deploy!

---

## 🧪 Test Locally First (Optional)

```bash
cd frontend/genai-pro-dashboard
npm install
npm run dev
```

Visit: http://localhost:5173

1. Select Department: "Engineering"
2. Select Project: "Chatbot"
3. Choose Model: "mixtral-8x7b-32768"
4. Type a prompt and submit
5. Should get AI response from Groq!

---

## 📚 Documentation

- **Detailed Setup**: See `GITHUB_PAGES_DEPLOYMENT.md`
- **Migration Details**: See `MIGRATION_SUMMARY.md`
- **Quick Reference**: See `GITHUB_PAGES_README.md`

---

## 🎯 What Changed

✅ **Frontend**: Now runs entirely on GitHub Pages (free)  
✅ **API**: Calls Groq directly (free tier available)  
✅ **Backend**: No longer needed!  
✅ **Database**: Uses browser localStorage  
✅ **Cost**: $0 per month  

---

## ❓ Verify It Works

After pushing to main, check:

1. Go to **Actions** tab in GitHub
2. See green ✅ for "Deploy Frontend to GitHub Pages"
3. Visit your GitHub Pages URL
4. Try submitting a prompt
5. See AI response from Groq

---

## 🆘 Issues?

| Problem | Solution |
|---------|----------|
| "API key not configured" | Check GitHub Secret is set correctly |
| App doesn't load | Check Actions logs for build errors |
| API calls fail | Check Groq API status |
| Sessions not saving | This is normal - localStorage only persists locally |

---

**Ready? Start with Step 1 above!** 🚀
