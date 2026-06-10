import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config({ override: true });

import { errorHandler } from './src/backend/middlewares/errorHandler';
import authRoute from './src/backend/routes/authRoute';
import eventRoute from './src/backend/routes/eventRoute';
import categoryRoute from './src/backend/routes/categoryRoute';
import bookingRoute from './src/backend/routes/bookingRoute';
import adminRoute from './src/backend/routes/adminRoute';
import { prisma } from './src/backend/db';

async function verifyDatabase() {
  console.log("Starting database verification...");
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('placeholder')) {
    console.warn('⚠️ DATABASE_URL is missing or appears to be a placeholder.');
    console.warn('Application will start, but database operations will fail.');
    return;
  }

  // Parse check for unencoded brackets in password
  if (dbUrl.includes('[') || dbUrl.includes(']')) {
    console.warn('⚠️ WARNING: DATABASE_URL contains unencoded brackets "[]".');
    console.warn('If your password contains special characters, ensure they are URL-encoded.');
  }

  try {
    // 1. Verify Prisma Client initialized
    console.log("✅ Prisma Client initialized");

    // 2. PostgreSQL is reachable
    await prisma.$connect();
    console.log("✅ PostgreSQL is reachable");
    
    // 3. Check if migrations applied / tables exist
    await prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`;
    console.log("✅ Tables exist and migrations applied");

  } catch (error: any) {
    console.error(`\n❌ DATABASE VERIFICATION FAILED`);
    
    if (error.code === 'P1001') {
      console.error(`Reason: PostgreSQL is unreachable. Check your host address and network connection.`);
    } else if (error.code === 'P1000' || error.message.includes('Authentication failed')) {
      console.error(`Reason: Authentication failed. Please verify your database username and password.`);
    } else if (error.code === 'P2010' || error.message.includes('does not exist')) {
      console.error(`Reason: Tables missing. You need to apply migrations: "npx prisma migrate deploy".`);
    } else {
      console.error(`Reason: ${error.message}`);
    }
    console.error(`The server will continue to start, but database queries will return 500 errors.\n`);
  } finally {
    // Always disconnect after verification to not hold an idle connection during startup
    await prisma.$disconnect();
  }
}

async function startServer() {
  await verifyDatabase();

  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(helmet({ contentSecurityPolicy: false })); // Disabled CSP for Vite HMR in dev
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoute);
  app.use('/api/events', eventRoute);
  app.use('/api/categories', categoryRoute);
  app.use('/api/bookings', bookingRoute);
  app.use('/api/admin', adminRoute);

  // Global Error Handler
  app.use(errorHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
