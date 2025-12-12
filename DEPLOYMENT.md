# Budget Coach - Deployment Guide for Render

This guide will help you deploy your Budget Coach application to Render with public URLs.

## Prerequisites

1. A GitHub account
2. A Render account (free tier) - sign up at https://render.com
3. Your OpenAI API key

## Step 1: Push Code to GitHub

1. Create a new repository on GitHub (e.g., `budget-coach`)
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/budget-coach.git
   git push -u origin main
   ```

## Step 2: Deploy to Render

### Option A: Deploy with Blueprint (Recommended - One Click)

1. Go to https://render.com/dashboard
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click **"Apply"**
6. Set environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_MODEL`: `gpt-4o-mini` (already set)

> **Note:** The Blueprint will automatically:
> - create the database
> - link the database to the backend
> - link the backend URL to the frontend
> - seed the database with sample data

### Option B: Deploy Services Manually
(Not recommended - The blueprint handles all connections automatically)

#### Deploy Backend:
1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `budget-coach-api`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_MODEL`: `gpt-4o-mini`
5. Click **"Create Web Service"**

#### Create Database:
1. Click **"New"** → **"PostgreSQL"**
2. **Name**: `budget-coach-db`
3. Click **"Create Database"**
4. Copy the **Internal Database URL**
5. Go back to your backend service → **Environment**
6. Add: `DATABASE_URL` = (paste the internal database URL)

#### Deploy Frontend:
1. Click **"New"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `budget-coach-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Add environment variable:
   - `VITE_API_URL`: `https://budget-coach-api.onrender.com` (use your backend URL)
5. Click **"Create Static Site"**

## Step 3: Get Your Public URLs

After deployment completes (5-10 minutes):

- **Frontend URL**: `https://budget-coach-frontend.onrender.com`
- **Backend API**: `https://budget-coach-api.onrender.com`

## Step 4: Sample Data (Automated)

The deployment is configured to automatically check for existing data. If the database is empty, it will automatically populate it with sample accounts, transactions, and goals so you can see the app in action immediately!

## Important Notes

### Free Tier Limitations:
- ⚠️ **Services spin down after 15 minutes of inactivity**
- First load takes 30-60 seconds to wake up
- Perfect for portfolio/demo purposes
- Database has 90-day data retention

### For Recruiters:
Add a note on your portfolio:
> "Note: This app is hosted on Render's free tier. The first load may take 30-60 seconds as the server wakes up. Subsequent requests will be fast!"

### Security:
- Your OpenAI API key is stored securely in Render's environment variables
- Never commit `.env` files to GitHub
- The database is private and only accessible by your backend service

## Troubleshooting

### Frontend can't connect to backend:
- Check that `VITE_API_URL` in frontend environment variables matches your backend URL
- Verify CORS is enabled in backend (already configured)

### Database connection errors:
- Ensure `DATABASE_URL` is set in backend environment variables
- Check that the database is in the same region as your backend service

### Build failures:
- Check build logs in Render dashboard
- Ensure all dependencies are in `requirements.txt` and `package.json`

## Local Development

To run locally after deployment setup:

```bash
# Backend
uvicorn backend.app.main:app --reload

# Frontend (in another terminal)
cd frontend
npm run dev
```

## Updating Your Deployment

Render automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

Your changes will be live in 5-10 minutes!

## Custom Domain (Optional)

Render allows custom domains on the free tier:
1. Go to your service → **Settings** → **Custom Domain**
2. Add your domain and follow DNS instructions

---

**Your Budget Coach app is now live and shareable! 🎉**
