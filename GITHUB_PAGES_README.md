# GenAI Platform - GitHub Pages Edition

A free, serverless AI dashboard running entirely on GitHub Pages using **Groq API**.

## 🎯 What Is This?

This is your GenAI Platform Starter, now deployed for **zero cost** on GitHub Pages. No AWS, no backend services needed!

- **Frontend**: React dashboard running on GitHub Pages (free)
- **AI API**: Direct Groq API calls (free tier available)
- **Storage**: Browser localStorage (sessions stored locally)
- **Deployment**: Automatic via GitHub Actions

## ✨ Key Changes from AWS Version

| Component | AWS Version | GitHub Pages Version |
|-----------|------------|---------------------|
| Backend | AWS Lambda | ❌ None |
| Database | DynamoDB | Browser localStorage |
| API | API Gateway | Direct Groq API |
| Deployment | CDK + CloudFormation | GitHub Actions |
| Cost | Pay-as-you-go | **FREE** |

## 🚀 Quick Setup (5 minutes)

### 1. Add GitHub Secret

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. New repository secret:
   - **Name**: `VITE_GROQ_API_KEY`
   - **Value**: Your Groq API key from https://console.groq.com/keys

### 2. Enable GitHub Pages

1. Settings → Pages
2. Build and deployment → GitHub Actions
3. Save

### 3. Push to GitHub

```bash
git add .
git commit -m "Deploy to GitHub Pages with Groq API"
git push origin main
```

✅ **Done!** Your app is now live at `https://YOUR_USERNAME.github.io/genai-platform-starter/`

## 📖 Detailed Documentation

See [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md) for:
- Local development setup
- Troubleshooting
- Model selection
- Session/usage tracking
- Continuous deployment

## 💻 Local Development

```bash
cd frontend/genai-pro-dashboard
npm install
npm run dev
```

Visit: http://localhost:5173

### Test with Local Groq API

1. Select Department: "Engineering"
2. Select Project: "Search AI"
3. Choose Model: "mixtral-8x7b-32768"
4. Enter prompt: "What is AI?"
5. Submit and see results!

## 🔧 Environment Variables

**Local Development**: `.env` file (already created with your key)
```
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
VITE_BASE_PATH=/
```

**GitHub Pages**: Secret `VITE_GROQ_API_KEY` (in repository settings)
Replace `gsk_your_groq_api_key_here` with your actual Groq API key from https://console.groq.com/keys

## 📊 What Works

✅ Real-time AI responses from Groq  
✅ Session tracking (localStorage)  
✅ Usage metrics (locally stored)  
✅ Multiple Groq models supported  
✅ Department/Project organization  
✅ Admin dashboard view  
✅ Automatic deployment on git push  

## ❌ What's Different

Since there's no backend:
- DynamoDB tables not accessible
- No cloud persistence (data stored in browser only)
- No AWS Lambda functions
- No API Gateway
- No Cognito authentication

For these features, consider:
- Using **Firebase** for cloud storage (free tier)
- Using **Supabase** for databases
- Staying with AWS Lambda for backend logic

## 🎓 Groq API Models

Free models available:

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| mixtral-8x7b-32768 | ⚡⚡⚡ Fast | Good | General chat |
| llama2-70b-4096 | ⚡⚡ Medium | Better | Complex tasks |
| gemma-7b-it | ⚡⚡⚡ Fast | Fair | Quick responses |

[View all available models](https://console.groq.com/docs/speech-text)

## 🔐 Security Notes

- ⚠️ **API Key**: Stored in GitHub Secrets (not in code)
- ⚠️ **Sessions**: Stored in browser localStorage only
- ⚠️ **Public**: The `.env` file with your key is in `.gitignore`

## 💡 Advanced: Add Cloud Database

To persist sessions across devices, integrate **Firebase**:

1. Create Firebase project (free tier)
2. Add Firebase SDK to React
3. Store sessions in Firestore instead of localStorage
4. Update API calls to sync to cloud

Guide: See Firebase + React integration docs

## 🆘 Troubleshooting

### "GROQ_API_KEY is not configured"
→ Check GitHub Secrets are set correctly

### "API Error: ..." in dashboard
→ Check Groq API status and your API key validity

### Sessions not persisting
→ This is expected - localStorage only persists per browser
→ Use Firebase or Supabase for cloud persistence

### Build fails
→ Check Actions tab for detailed error logs
→ Run `npm run build` locally to debug

## 🔄 Workflow

1. **Edit code** locally
2. **Test** with `npm run dev`
3. **Build** with `npm run build`
4. **Commit** changes with `git add . && git commit -m "..."`
5. **Push** to main: `git push origin main`
6. **Deploy** auto-triggered by GitHub Actions
7. **Live** on GitHub Pages in 1-2 minutes

## 📚 Resources

- [Groq API Docs](https://console.groq.com/docs/speech-text)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)

## 📄 Original Project Structure

```
genai-platform-starter/
├── frontend/
│   └── genai-pro-dashboard/        ← This is deployed to GitHub Pages
├── backend/
│   └── lambdas/                    ← Not needed for GitHub Pages
├── deployment/
│   └── cdk/                        ← Not needed for GitHub Pages
└── README.md
```

## ✅ Deployment Checklist

- [ ] Groq API key added to GitHub Secrets (`VITE_GROQ_API_KEY`)
- [ ] GitHub Pages enabled in Settings
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow ran successfully
- [ ] Dashboard accessible at GitHub Pages URL
- [ ] Can submit prompts and get Groq API responses
- [ ] Sessions stored in localStorage

---

**Ready to deploy?** Follow the 5-minute setup above! 🚀
