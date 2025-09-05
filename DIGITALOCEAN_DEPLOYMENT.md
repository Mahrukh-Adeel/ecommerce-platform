# DigitalOcean App Platform Deployment Guide

## Step 1: Prerequisites
1. Create a DigitalOcean account at https://cloud.digitalocean.com/
2. Make sure your code is pushed to GitHub

## Step 2: Create the App
1. Go to DigitalOcean Control Panel
2. Click "Apps" in the sidebar
3. Click "Create App"
4. Choose "GitHub" as source
5. Authorize DigitalOcean to access your GitHub
6. Select repository: `Mahrukh-Adeel/ecommerce-platform`
7. Select branch: `backend-deployemnt`
8. Choose "Autodeploy" for automatic deployments

## Step 3: Configure the App
1. **Source Directory**: Set to `backend`
2. **Build Command**: `npm run build`
3. **Run Command**: `npm start`
4. **Environment**: Node.js
5. **Plan**: Basic ($5/month)

## Step 4: Environment Variables
Add these environment variables in the App Platform:
- `NODE_ENV` = `production`
- `PORT` = `8080` (DigitalOcean uses this port)
- `MONGODB_URI` = your MongoDB connection string
- `JWT_SECRET` = your JWT secret
- `SESSION_SECRET` = your session secret
- `FRONTEND_URL` = your frontend URL (e.g., https://everwood.netlify.app)

## Step 5: Database Setup
Make sure your MongoDB Atlas allows connections from all IPs (0.0.0.0/0) or add DigitalOcean's IP ranges.

## Alternative: Using the App Spec File
You can also use the `.do/app.yaml` file I created:
1. In the App creation process, choose "Edit your App Spec"
2. Paste the contents of `.do/app.yaml`
3. Update the environment variables with your actual values

## Benefits over Heroku:
- More reliable uptime
- Better pricing
- No sleep mode
- Faster deployments
- Better logging
