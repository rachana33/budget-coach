# ✅ Deployment Checklist

Use this checklist to deploy your Budget Coach application to Render.

## Pre-Deployment

- [ ] **Test locally** - Ensure app runs without errors
  ```bash
  # Terminal 1
  uvicorn backend.app.main:app --reload
  
  # Terminal 2
  npm run frontend
  ```

- [ ] **Run validation script**
  ```bash
  ./test_deployment.sh
  ```

- [ ] **Have your OpenAI API key ready**
  - Get it from: https://platform.openai.com/api-keys
  - Keep it secure - you'll add it to Render

## GitHub Setup

- [ ] **Create GitHub repository**
  - Go to: https://github.com/new
  - Name: `budget-coach` (or your preferred name)
  - Keep it public (for free Render deployment)

- [ ] **Initialize git and push**
  ```bash
  git init
  git add .
  git commit -m "Initial commit - Budget Coach application"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/budget-coach.git
  git push -u origin main
  ```

## Render Setup

- [ ] **Create Render account**
  - Go to: https://render.com
  - Sign up with GitHub (easiest)

- [ ] **Deploy with Blueprint**
  - Click: **New** → **Blueprint**
  - Select your `budget-coach` repository
  - Render detects `render.yaml` automatically
  - Click: **Apply**

- [ ] **Add environment variables**
  - Go to: Backend service → **Environment**
  - Add: `OPENAI_API_KEY` = `your_actual_api_key`
  - Save changes

- [ ] **Wait for deployment** (5-10 minutes)
  - Watch the build logs
  - Both services should show "Live" status

## Post-Deployment

- [ ] **Test your URLs**
  - Frontend: `https://budget-coach-frontend.onrender.com`
  - Backend: `https://budget-coach-api.onrender.com/health`
  - API Docs: `https://budget-coach-api.onrender.com/docs`

- [ ] **Add sample data** (optional)
  - Option 1: Use the UI to manually add accounts and transactions
  - Option 2: In Render dashboard → Backend service → Shell:
    ```bash
    python -m backend.seed_data
    ```

- [ ] **Test all features**
  - [ ] View dashboard
  - [ ] Add an account
  - [ ] Add a transaction
  - [ ] Set a goal
  - [ ] Get AI coach insights (this uses your OpenAI API key)

## Share Your Work

- [ ] **Update README.md**
  - Replace `YOUR_USERNAME` with your GitHub username
  - Add your actual deployment URLs
  - Add screenshots (optional but recommended)

- [ ] **Add to portfolio**
  - Live URL: `https://budget-coach-frontend.onrender.com`
  - GitHub: `https://github.com/YOUR_USERNAME/budget-coach`
  - Note: "First load may take 30-60 seconds (free tier)"

- [ ] **Update LinkedIn/Resume**
  - Add project to experience
  - Mention: React, FastAPI, PostgreSQL, OpenAI, Render
  - Include live demo link

## Troubleshooting

### Frontend can't reach backend?
- [ ] Check `VITE_API_URL` in frontend environment variables
- [ ] Should be: `https://budget-coach-api.onrender.com`

### Backend errors?
- [ ] Check `OPENAI_API_KEY` is set correctly
- [ ] Check database connection (should be automatic)
- [ ] View logs in Render dashboard

### Services sleeping?
- [ ] This is normal on free tier
- [ ] First load takes 30-60 seconds
- [ ] Consider upgrading to paid tier if needed ($7/month per service)

## Optional Enhancements

- [ ] **Custom domain** (free on Render)
  - Settings → Custom Domain
  - Add your domain and configure DNS

- [ ] **Enable auto-deploy**
  - Already enabled! Push to GitHub = auto-deploy

- [ ] **Add monitoring**
  - Render provides basic monitoring
  - Or use: UptimeRobot (free) to keep services awake

- [ ] **Upgrade to paid tier** (if needed)
  - No sleep time
  - Faster builds
  - More resources
  - $7/month per service

## Success! 🎉

When all items are checked, you have:
- ✅ A live, production application
- ✅ Public shareable URLs
- ✅ Automatic deployments from GitHub
- ✅ Professional portfolio piece
- ✅ Full-stack project to discuss in interviews

---

**Need help?** See `DEPLOYMENT.md` for detailed instructions.
