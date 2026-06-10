import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Image } from '../components/ui/Image';
import { Calendar, MapPin, Loader2, Sparkles, ArrowRight, Flame, Clock, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

// ... (keep the Event interface and FALLBACK_EVENTS from current context, just updating imports and the mapped render block)

// We replace the whole file since we need to import Image and replace the img tag.

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  price: number;
  capacity: number;
  availableSeats?: number;
  bannerUrl: string | null;
  category: { name: string };
  organizer: { name: string };
}

// Removed mock events

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-emerald-400 font-bold ml-2">Event Started</span>;

  return (
    <span className="font-mono text-xs tracking-wider opacity-90 font-medium">
      {timeLeft.d}d {timeLeft.h}h {timeLeft.m}m
    </span>
  );
}

export default function EventsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: dbData, isLoading, error } = useQuery<{events: Event[], meta: any}>({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await api.get('/events');
      return data;
    },
  });

  const events = dbData?.events || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-32 pt-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-24 max-w-3xl">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6">
             <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             Active & Live
           </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 display-font text-balance">Active <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Registrations</span></h1>
          <p className="text-gray-400 text-xl font-light leading-relaxed">Book premium events, tech summits, and cultural festivals curated exclusively for our ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => {
            const isTrending = idx === 0 || idx === 1;
            const percentageLeft = event.availableSeats !== undefined ? (event.availableSeats / event.capacity) * 100 : 100;
            const seatsRemaining = event.availableSeats !== undefined ? event.availableSeats : event.capacity;
            const almostSoldOut = seatsRemaining > 0 && seatsRemaining <= 50;

            return (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={`/events/${event.id}`} className="block h-full group focus:outline-none">
                <div className="h-full flex flex-col group-hover:-translate-y-2 transition-transform duration-500 bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden hover:border-indigo-500/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] relative">
                  
                  {isTrending && (
                    <div className="absolute top-0 right-0 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl flex items-center gap-1 uppercase tracking-widest shadow-lg">
                      <Flame className="w-3.5 h-3.5" /> Trending
                    </div>
                  )}

                  <div className="h-64 relative overflow-hidden bg-gray-900 border-b border-white/10">
                     <Image src={event.bannerUrl || undefined} alt={event.title} category={event.category?.name} className="group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
                    
                    <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                      {event.category?.name || 'General'}
                    </div>

                    <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5 text-indigo-400" />
                       <CountdownTimer targetDate={event.date} />
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col relative z-10 bg-gray-950/50 backdrop-blur-xl border-t border-white/5">
                    <p className="text-sm font-semibold text-indigo-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h4 className="text-2xl font-bold mb-3 line-clamp-2 text-white group-hover:text-indigo-400 transition-colors leading-snug display-font">{event.title}</h4>
                    <p className="text-base text-gray-400 line-clamp-2 flex-1 mb-5 font-light">{event.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-300 gap-3 mb-6 bg-white/5 px-4 py-3 rounded-2xl border border-white/5 group-hover:bg-indigo-500/5 transition-colors">
                      <MapPin className="h-5 w-5 text-indigo-400 shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>

                    <div className="mb-6">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                          <span className="text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" /> Registration Status</span>
                          <span className={almostSoldOut ? "text-orange-400" : "text-emerald-400"}>
                            {seatsRemaining === 0 ? "Sold Out" : `${seatsRemaining} left`}
                          </span>
                       </div>
                       <div className="w-full bg-white/10 rounded-full h-1.5 border border-white/5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${almostSoldOut ? "bg-orange-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"}`} 
                            style={{ width: `${100 - percentageLeft}%` }}
                          ></div>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                      <div className="flex flex-col">
                         <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Starting from</span>
                         <span className="font-bold text-2xl text-white display-font">
                           {event.price === 0 ? 'Free Entry' : `₹${event.price.toLocaleString('en-IN')}`}
                         </span>
                      </div>
                      <Button className="rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] h-12 px-6 font-bold bg-white text-gray-950 hover:bg-gray-200 transition-all group-hover:scale-105">
                         View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )})}
        </div>
      </div>
    </div>
  );
}
