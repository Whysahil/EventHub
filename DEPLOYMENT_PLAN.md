# EventHub Deployment Plan

## 1. Why Vercel Returns 404 for API Routes

Your application is currently bundled as a traditional Express server (`server.ts`) alongside a Vite React frontend. Vercel is a serverless-first platform primarily designed for static sites and frontend frameworks. 

When you deploy to Vercel:
1. It runs `npm run build` which produces static files in the `dist` folder.
2. It statically serves `index.html` and your compiled React assets.
3. It **completely ignores** `server.ts` and `npm start`.

Because Vercel does not instantiate a long-running Node.js process by default, any requests made to `/api/*` fall through to the static file server, returning a `404 Not Found` error.

## 2. Production-Ready Deployment Architecture

To fix this efficiently and scale properly:
* **Frontend:** Vercel (Fast global CDN for static assets).
* **Backend:** Render (Fully managed platform for long-running Node/Express backends).
* **Database:** Supabase PostgreSQL (Managed relational database with connection pooling).

This architecture separates concerns, allowing each component to run in its native optimal environment.

## 3. Step-by-Step Deployment Instructions

### A. Database (Supabase)
1. In your Supabase dashboard, locate your **Transaction** connection string (pgbouncer enabled, port 6543) and **Session** connection string (port 5432).
2. Set them as your environment variables (as you've already done in `.env`).

### B. Backend (Render)
1. Create a new **Web Service** on Render and connect your GitHub repository.
2. Set the following Build and Start commands:
   * **Build Command:** `npm install && npx prisma generate && npm run build`
   * **Start Command:** `npx prisma migrate deploy && npm start`
3. Add your environment variables in the Render dashboard:
   * `DATABASE_URL`
   * `DIRECT_URL`
   * `JWT_SECRET`
   * `GOOGLE_CLIENT_ID`
   * `GOOGLE_CLIENT_SECRET`
   * `GITHUB_CLIENT_ID`
   * `GITHUB_CLIENT_SECRET`
   * `APP_URL` or `FRONTEND_URL` (set this to your Vercel domain later)
4. Deploy. Once deployed, Render will provide a URL like `https://eventhub-api.onrender.com`.

### C. Frontend (Vercel)
1. Create a new project on Vercel and connect your GitHub repository.
2. Leave the default Build Command (`npm run build`) and Output Directory (`dist`).
3. Under Environment Variables, add:
   * `VITE_BACKEND_URL`: Set to your Render backend URL (e.g., `https://eventhub-api.onrender.com`).
   * `VITE_FRONTEND_URL`: Set to your Vercel frontend URL.
4. Deploy.

### D. Update OAuth Callbacks
1. **Google Cloud Console:**
   * Go to APIs & Services > Credentials.
   * Under your OAuth 2.0 Client IDs, add the Render backend callback URL to **Authorized redirect URIs**:
     `https://eventhub-api.onrender.com/api/auth/callback/google`
2. **GitHub Developer Settings:**
   * Go to Developer settings > OAuth Apps.
   * Update the **Authorization callback URL** to your Render backend callback URL:
     `https://eventhub-api.onrender.com/api/auth/callback/github`

## 4. Updates Made to the Codebase

We have prepared the codebase for this decoupled deployment:
1. **Frontend API Configuration:** `src/lib/api.ts` now securely points to `import.meta.env.VITE_BACKEND_URL` fallback for API calls, decoupling it from the relative `/api` path.
2. **Vite Configuration:** Updated `vite.config.ts` to allow `VITE_`, `BACKEND_URL`, and `FRONTEND_URL` environment variables.
3. **OAuth Redirect Resilience:** `src/backend/routes/authRoute.ts` has been secured to dynamically map the OAuth callbacks based on the server running them (Render) while bouncing the postMessage cross-origin cleanly.
4. **Booking & QR Resolution:** Ensured that `server.ts` does not contain mock endpoints and the production Express endpoints are solid.

Follow this plan to achieve a clean production-ready architecture.
