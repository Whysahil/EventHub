import { Router } from 'express';
import { prisma } from '../db';
import { protect, AuthRequest } from '../middlewares/authMiddleware';
import QRCode from 'qrcode';
import { sendTicketEmail } from '../utils/email';

const router = Router();

// Create a booking
router.post('/', protect, async (req: AuthRequest, res, next) => {
  try {
    const { eventId, tickets, selectedSeats } = req.body;
    
    // First, verify event exists and has capacity
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (event.availableSeats < tickets) {
      res.status(400).json({ message: 'Not enough seats available' });
      return;
    }

    const total = event.price * tickets;
    const userEmail = user.email;

    // Use a transaction to create booking, tickets, and update availableSeats
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update event
      const updatedEvent = await tx.event.update({
        where: { id: eventId, availableSeats: { gte: tickets } },
        data: { availableSeats: { decrement: tickets } }
      });

      // 2. Create Booking
      const booking = await tx.booking.create({
        data: {
          userId: req.user!.id,
          eventId,
          tickets,
          total,
        },
        include: {
          event: true,
        }
      });

      // 3. Generate QR codes and prepare ticket data
      const createdTickets = [];
      for (let i = 0; i < tickets; i++) {
        const seatNum = selectedSeats && selectedSeats[i] ? selectedSeats[i] : `General Admission - T${i+1}`;
        // Create an initial ticket to get a unique ID
        const ticket = await tx.ticket.create({
          data: {
            bookingId: booking.id,
            eventId: event.id,
            userId: req.user!.id,
            eventName: event.title,
            venue: event.venue,
            date: event.date,
            seatNumber: seatNum,
            price: event.price,
            ticketStatus: 'VALID'
          }
        });
        
        // Generate QR Code wrapping the Ticket ID
        const qrCodeUrl = await QRCode.toDataURL(JSON.stringify({ 
           ticketId: ticket.id, 
           bookingId: booking.id, 
           eventName: event.title, 
           seatNum 
        }));

        // Update the ticket with QR Code URL
        const updatedTicket = await tx.ticket.update({
          where: { id: ticket.id },
          data: { qrCodeUrl }
        });
        
        createdTickets.push(updatedTicket);
      }

      return { booking, createdTickets };
    });

    // Send emails OUTSIDE the transaction asynchronously
    result.createdTickets.forEach((ticket) => {
      sendTicketEmail(userEmail, {
        eventName: event.title,
        date: event.date,
        venue: event.venue,
        seatNumber: ticket.seatNumber || '',
        bookingId: ticket.bookingId,
        qrCodeUrl: ticket.qrCodeUrl || '',
        bannerUrl: event.bannerUrl
      }).catch(console.error);
    });

    res.status(201).json(result);
  } catch (error) {
    if (error && (error as any).code === 'P2025') {
      res.status(400).json({ message: 'Not enough seats available, or event changed' });
      return;
    }
    console.error(error);
    next(error);
  }
});

// Get user tickets
router.get('/my-tickets', protect, async (req: AuthRequest, res, next) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user!.id },
      include: { 
        event: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tickets);
  } catch (error) {
    next(error);
  }
});

export default router;
