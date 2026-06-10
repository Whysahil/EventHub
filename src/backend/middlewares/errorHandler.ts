import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server error';

  if (err.code?.startsWith('P')) {
    // Prisma error
    statusCode = 500;
    if (err.code === 'P1001') message = "Database Connection Error: PostgreSQL server is unreachable. Check DATABASE_URL.";
    else if (err.code === 'P1000' || message.includes('Authentication failed')) message = "Database Connection Error: Authentication failed. Verify PostgreSQL username/password.";
    else if (err.code === 'P2010' || message.includes('does not exist')) message = "Database Error: Tables missing. Did you forget to run 'npx prisma migrate deploy'?";
    // For other prisma errors, we don't expose full query details to users unless dev
    else if (process.env.NODE_ENV !== 'production') message = `Prisma Error [${err.code}]: ${err.message}`;
    else message = "A database operation failed.";
  }

  res.status(statusCode);
  res.json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    code: err.code
  });
};
