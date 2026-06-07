# GitHub Pages Deployment Guide

This guide explains how to deploy your GenAI Platform Starter frontend to GitHub Pages for free.

## 📋 Prerequisites

- GitHub account
- Repository already pushed to GitHub
- AWS backend deployed (for API endpoints)

## 🚀 Deployment Steps

### 1. **Push Your Code to GitHub**

```bash
git init
git add .
git commit -m "Initial commit: GenAI Platform Starter"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/genai-platform-starter.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. **Enable GitHub Pages in Repository Settings**

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - Select **GitHub Actions** as the source
   - Click **Save**

### 3. **Configure API Endpoint (Important!)**

GitHub Pages will host your frontend, but your backend APIs must be accessible from it.

#### Option A: Using environment variables (Recommended)

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secret `VITE_API_BASE` with your AWS API endpoint:
   ```
   https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
   ```

#### Option B: Update configuration directly

Edit `frontend/genai-pro-dashboard/.env` (create if doesn't exist):
```
VITE_API_BASE=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
```

### 4. **Deploy Automatically**

The GitHub Actions workflow will automatically:
- ✅ Trigger on pushes to `main` branch
- ✅ Build your React app
- ✅ Deploy to GitHub Pages
- ✅ Be available at: `https://YOUR_USERNAME.github.io/genai-platform-starter/`

**Manual trigger:**
1. Go to **Actions** tab
2. Click **Deploy Frontend to GitHub Pages**
3. Click **Run workflow**

## 📝 Workflow Configuration

The workflow file (`.github/workflows/deploy-frontend.yml`) does the following:

- Installs dependencies
- Builds the React application with Vite
- Deploys to GitHub Pages
- Sets base path automatically to repository name

## ✅ Verification

After deployment:

1. Check the **Actions** tab to verify the build succeeded
2. Visit `https://YOUR_USERNAME.github.io/genai-platform-starter/`
3. You should see your dashboard
4. Test API calls to verify backend connectivity

## 🐛 Troubleshooting

### API calls fail with CORS errors
- Ensure your AWS Lambda/API Gateway has CORS enabled
- Configure CORS to allow GitHub Pages origin:
  ```
  https://YOUR_USERNAME.github.io
  ```

### Dashboard shows but API calls fail
- Verify `VITE_API_BASE` secret is set correctly
- Check AWS Lambda logs for errors
- Ensure your backend is deployed and running

### Files not found (404 errors)
- This is normal for single-page apps. GitHub Pages is configured to serve `index.html` for all routes
- Update `_redirects` if using Netlify (not needed for GitHub Pages)

## 🔄 Continuous Deployment

Every time you push to `main`:
- New build triggers automatically
- Frontend updates on GitHub Pages
- No manual steps needed

## 📊 Monitoring Deployment

1. Go to **Actions** tab
2. Click the latest workflow run
3. Check logs for build details
4. Review deployment summary

## 💡 Next Steps

1. ✅ Deploy backend to AWS (if not already done)
2. ✅ Configure API endpoint in GitHub secrets
3. ✅ Test all features on live GitHub Pages URL
4. ✅ Share `https://YOUR_USERNAME.github.io/genai-platform-starter/` with your team

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)

---

**Note:** GitHub Pages only hosts static files. Your backend Lambda functions will continue running on AWS and are not affected by this deployment.
