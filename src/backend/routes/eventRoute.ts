import { Router } from 'express';
import { prisma } from '../db';
import { protect, adminOnly, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();

// Get all events
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        skip,
        take: limit,
        where: { status: 'PUBLISHED' },
        include: { 
          category: { select: { id: true, name: true } }, 
          organizer: { select: { id: true, name: true } } 
        },
        orderBy: { date: 'asc' },
      }),
      prisma.event.count({ where: { status: 'PUBLISHED' } }),
    ]);

    res.json({
      events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single event
router.get('/:id', async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { category: true, organizer: { select: { name: true } } },
    });
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Create event (Admin only)
router.post('/', protect, adminOnly, async (req: AuthRequest, res, next) => {
  try {
    const { title, description, date, venue, price, capacity, categoryId, bannerUrl, galleryUrl, status } = req.body;
    
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        venue,
        price: Number(price),
        capacity: Number(capacity),
        availableSeats: Number(capacity), // Initial seats equals capacity
        categoryId,
        bannerUrl,
        galleryUrl,
        status: status || 'PUBLISHED',
        organizerId: req.user!.id,
      },
    });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

// Update event (Admin only)
router.put('/:id', protect, adminOnly, async (req: AuthRequest, res, next) => {
  try {
    const { title, description, date, venue, price, capacity, categoryId, bannerUrl, galleryUrl, status } = req.body;
    
    // Recalculate availableSeats based on capacity change
    // This is simplified; robust logic would check existing bookings
    const existingEvent = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!existingEvent) return res.status(404).json({ message: 'Event not found' });
    
    const capacityDiff = Number(capacity) - existingEvent.capacity;
    const newAvailableSeats = Math.max(0, existingEvent.availableSeats + capacityDiff);

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        venue,
        price: price ? Number(price) : undefined,
        capacity: capacity ? Number(capacity) : undefined,
        availableSeats: newAvailableSeats,
        categoryId,
        bannerUrl,
        galleryUrl,
        status,
      },
    });
    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Delete event (Admin only)
router.delete('/:id', protect, adminOnly, async (req: AuthRequest, res, next) => {
  try {
    await prisma.event.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
