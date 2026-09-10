# Ramco Institute of Technology - Backend (Convex) & Frontend (Vercel) Setup

This project uses **Convex** for the reactive real-time database and **Vercel** for lightning-fast frontend deployment.

## 1. Quick Convex Setup
1. In the project root, run:
   ```bash
   npx convex dev
   ```
2. Follow the prompt to log into Convex and create a project (e.g., `rit-cgpa-calculator`).
3. Convex will automatically create `.env.local` containing:
   ```env
   VITE_CONVEX_URL="https://your-deployment-name.convex.cloud"
   ```

## 2. Deploying on Vercel
1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com):
   - Click **Add New** > **Project** and import this repository.
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add the Environment Variable in Vercel:
   - Name: `VITE_CONVEX_URL`
   - Value: Your Convex URL (from `npx convex dev` or production deployment)
4. Click **Deploy**!

> **Note on Offline Mode**: Even without running `npx convex dev` right away, the application includes a smart local fallback that stores calculations securely in `localStorage` under `kirranvijay@gmail.com` and automatically synchronizes with Convex once connected.
