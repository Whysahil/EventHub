import { Router } from 'express';
import { prisma } from '../db';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

router.get('/stats', protect, adminOnly, async (req, res, next) => {
  try {
    const [totalUsers, totalEvents, totalBookings, revenueAgg] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({ _sum: { total: true } })
    ]);

    const revenue = revenueAgg._sum.total || 0;

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      revenue
    });
  } catch (error) {
    next(error);
  }
});

export default router;
