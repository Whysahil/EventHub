import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing
  await prisma.ticket.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Categories
  const catGov = await prisma.category.create({ data: { name: 'Leadership & Government', description: 'Govt summits and public administration events' } });
  const catCulture = await prisma.category.create({ data: { name: 'Cultural Festivals', description: 'Indian Cultural & Music Festivals' } });
  const catComm = await prisma.category.create({ data: { name: 'Community Events', description: 'Local gatherings, NGOs, volunteer' } });
  const catNet = await prisma.category.create({ data: { name: 'Networking Events', description: 'Startup & Founders Networking' } });
  
  const catTech = await prisma.category.create({ data: { name: 'Tech & AI Summits', description: 'Technical Innovation' } });

  // Create Admin
  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@eventhub.in',
      name: 'EventHub Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create Regular User
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Rahul Sharma',
      password: hashedPassword,
      role: 'USER',
    },
  });

  // Create Events
  const events = [
    // Leadership & Government
    {
       title: 'Digital India Innovation Summit 2026',
       description: 'The premier government summit shaping the next decade of digital public goods, featuring top Indian officials and policymakers.',
       date: new Date('2026-08-15T09:00:00Z'),
       venue: 'Bharat Mandapam, New Delhi',
       price: 1999,
       capacity: 5000,
       bannerUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=2000',
       categoryId: catGov.id,
       organizerId: admin.id,
    },
    {
       title: 'Policy & Administration Forum',
       description: 'Regional administrative strategies for urban planning and public welfare.',
       date: new Date('2026-09-10T10:00:00Z'),
       venue: 'Vigyan Bhawan, Delhi',
       price: 2500,
       capacity: 3000,
       bannerUrl: 'https://images.unsplash.com/photo-1475721025505-c31da16c6d09?auto=format&fit=crop&q=80&w=2000',
       categoryId: catGov.id,
       organizerId: admin.id,
    },
    
    // Cultural Festivals
    {
       title: 'Rajasthan Folk Festival',
       description: 'Experience the magic of traditional Indian classical music and folk dances at the historic forts.',
       date: new Date('2026-10-20T10:00:00Z'),
       venue: 'Mehrangarh Fort, Jodhpur',
       price: 3999,
       capacity: 2000,
       bannerUrl: 'https://images.unsplash.com/photo-1604085572502-b06cbafd8d56?auto=format&fit=crop&q=80&w=2000',
       categoryId: catCulture.id,
       organizerId: admin.id,
    },
    {
       title: 'Varanasi Dev Deepawali',
       description: 'The spectacular festival of lights on the ghats of the Ganges, captured by professional photographers.',
       date: new Date('2026-11-24T18:00:00Z'),
       venue: 'Dashashwamedh Ghat, Varanasi',
       price: 0,
       capacity: 10000,
       bannerUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=2000',
       categoryId: catCulture.id,
       organizerId: admin.id,
    },

    // Community Events
    {
       title: 'Beach Cleanup & NGO Collaboration',
       description: 'Join local communities for a massive ecological drive and volunteer networking.',
       date: new Date('2026-07-05T06:00:00Z'),
       venue: 'Juhu Beach, Mumbai',
       price: 0,
       capacity: 1000,
       bannerUrl: 'https://images.unsplash.com/photo-1593113589914-075990116daa?auto=format&fit=crop&q=80&w=2000',
       categoryId: catComm.id,
       organizerId: admin.id,
    },
    {
       title: 'Sustainable Living Meetup',
       description: 'Real human interaction focusing on permaculture, sustainable living, and organic collaboration.',
       date: new Date('2026-08-25T10:00:00Z'),
       venue: 'Auroville, Pondicherry',
       price: 500,
       capacity: 300,
       bannerUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=2000',
       categoryId: catComm.id,
       organizerId: admin.id,
    },

    // Networking Events
    {
       title: 'SaaS Founders Connect',
       description: 'Exclusive mixer for B2B tech founders, VCs, and tech enthusiasts building software for the world from India.',
       date: new Date('2026-12-05T18:00:00Z'),
       venue: 'Koramangala, Bengaluru',
       price: 2499,
       capacity: 500,
       bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=2000',
       categoryId: catNet.id,
       organizerId: admin.id,
    },
    {
       title: 'Creator Economy Conclave',
       description: 'Professional networking for content creators, influencers, and brand agencies navigating the modern digital economy.',
       date: new Date('2026-07-20T10:00:00Z'),
       venue: 'Jio World Centre, Mumbai',
       price: 1499,
       capacity: 2000,
       bannerUrl: 'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=2000',
       categoryId: catNet.id,
       organizerId: admin.id,
    },
    
    // Tech & AI 
    {
       title: 'Bengaluru AI Summit',
       description: 'Exploring the frontiers of GenAI, large language models, and enterprise ML solutions.',
       date: new Date('2026-10-10T09:00:00Z'),
       venue: 'BIEC, Bengaluru',
       price: 3999,
       capacity: 3000,
       bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000',
       categoryId: catTech.id,
       organizerId: admin.id,
    }
  ];

  for (const e of events) {
    const created = await prisma.event.create({
      data: {
        ...e,
        availableSeats: e.capacity,
        galleryUrl: JSON.stringify([
          "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"
        ])
      }
    });
    console.log(`Created event with id: ${created.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
