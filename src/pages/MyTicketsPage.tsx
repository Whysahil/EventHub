import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Calendar, MapPin, Loader2, Ticket, CheckCircle2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { Image } from '../components/ui/Image';
import { useEffect } from 'react';

export default function MyTicketsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['my-tickets'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/my-tickets');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-32 pt-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 display-font">My Tickets</h1>
          <p className="text-gray-400 font-light text-lg">View, manage, and present your digital event passes.</p>
        </div>

        {!tickets || tickets.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm shadow-2xl glass">
             <Ticket className="mx-auto h-16 w-16 text-gray-700 mb-6" />
             <h3 className="text-2xl font-bold mb-3 display-font">No tickets found</h3>
             <p className="text-gray-400 mb-8 max-w-sm mx-auto font-light">Explore our curated library of events and secure your spot.</p>
             <Link to="/events">
               <Button className="rounded-xl px-10 h-14 font-bold bg-white text-gray-950 hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]">Browse Events</Button>
             </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {tickets.map((ticket: any, idx: number) => (
              <motion.div 
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className="flex flex-col md:flex-row overflow-hidden group hover:border-indigo-500/50 transition-all shadow-2xl bg-gray-900/80 backdrop-blur-sm border-white/10 rounded-3xl">
                  {/* Banner Column */}
                  <div className="md:w-64 relative border-r border-white/10 bg-gray-950 flex flex-col justify-end min-h-[220px]">
                    <Image src={ticket.event?.bannerUrl || undefined} category={ticket.event?.category?.name} containerClassName="absolute inset-0 w-full h-full" className="opacity-40 group-hover:opacity-70 transition-opacity duration-700 object-cover w-full h-full" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
                    <div className="relative z-10 p-6">
                       <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1 drop-shadow-md">Seat Number</p>
                       <p className="text-4xl font-black display-font text-white drop-shadow-lg">{ticket.seatNumber}</p>
                    </div>
                  </div>
                  
                  {/* Details Column */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">TICKET #{ticket.id.split('-')[0].toUpperCase()}</p>
                            <h4 className="text-2xl font-bold text-white leading-tight display-font pr-4">{ticket.eventName}</h4>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center text-sm text-gray-300 gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-[#0f1422] flex items-center justify-center border border-white/5 shadow-inner">
                            <Calendar className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Date & Time</div>
                            {new Date(ticket.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-300 gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-[#0f1422] flex items-center justify-center border border-white/5 shadow-inner">
                            <MapPin className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Venue Location</div>
                            {ticket.venue}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-xl uppercase tracking-wider">
                         <CheckCircle2 className="h-4 w-4" />
                         Paid • ₹{ticket.price?.toLocaleString('en-IN') || '0'}
                       </div>
                       
                       <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 text-gray-300 hover:text-white font-medium text-sm px-6 h-10">
                          <Download className="w-4 h-4 mr-2" /> Save Pass
                       </Button>
                    </div>
                  </div>

                  {/* QR Column */}
                  <div className="p-6 md:p-8 bg-[#0a0d14] flex flex-col items-center justify-center border-l border-white/5 min-w-[200px]">
                     <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.15)] mb-4 shrink-0 transition-transform hover:scale-105 duration-500">
                        <img src={ticket.qrCodeUrl} className="w-32 h-32 rounded-lg" alt="Ticket QR Code" />
                     </div>
                     <div className="text-[10px] text-center text-gray-500 uppercase tracking-widest font-bold">
                       Scan at entrance
                     </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
