# Ramco Institute of Technology - Mark Calculation & Percentage System

An elegant, institutional academic portal developed for **Ramco Institute of Technology (RIT)**.
Features a dynamic semester course calculator, real-time reactive backend via **Convex**, instant **Vercel** deployment readiness, certified **PDF Mark Statement** export, account calculation history, and authentic institutional styling.

---

## 🌟 Key Features

1. **Dynamic Subject & Grade Calculator**:
   - Select any number of enrolled subjects (1 to 15, default **8**).
   - Clean labels (`Subject 1`, `Subject 2`, ... `Subject 8`).
   - Grade mapping per RIT Autonomous / Anna University standards:
     - **O Grade**: 100 Marks (10 GP) - Outstanding
     - **A+ Grade**: 90 Marks (9 GP) - Excellent
     - **A Grade**: 80 Marks (8 GP) - Very Good
     - **B+ Grade**: 70 Marks (7 GP) - Good
     - **B Grade**: 60 Marks (6 GP) - Above Average
     - **C Grade**: 50 Marks (5 GP) - Average / Satisfactory
   - Real-time aggregation of total marks obtained, maximum possible marks, and overall percentage.

2. **Official Certified PDF Grade Statement**:
   - Download high-resolution, institutional grade statements with RIT crest, affiliation details, student credentials, subject-wise breakdown, and verification stamps.

3. **Convex Backend & Account History**:
   - Powered by **Convex** reactive cloud database with full schemas (`users` and `calculations`).
   - Saves calculation history under user account `kirranvijay@gmail.com`.
   - Re-load past calculations directly into the calculator or export PDF at any time.
   - Smart offline-fallback to `localStorage` ensuring 100% immediate usability.

4. **User Authentication**:
   - Configured for:
     - **Email**: `kirranvijay@gmail.com`
     - **Password**: `Kirranst@14`
   - Includes quick "Auto Fill" demo button for instant sign-in.

5. **Institutional RIT Footer & Details**:
   - North Venganallur Village, Rajapalayam – 626 117 address & contact details.
   - Credit line: **Designed & developed by Kirran S T, Dept. of Information Technology** with LinkedIn & Portfolio links.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies (already completed)
npm install

# 2. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser!

---

## ⚡ Connecting Convex Backend

1. In the project folder, run:
   ```bash
   npx convex dev
   ```
2. Log in with your Convex account and select or create a project.
3. Convex will automatically configure your `.env.local` with your `VITE_CONVEX_URL`.

---

## ☁️ Deploying to Vercel

1. Push this project to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - `VITE_CONVEX_URL` = *(Your Convex deployment URL)*
6. Click **Deploy**!
