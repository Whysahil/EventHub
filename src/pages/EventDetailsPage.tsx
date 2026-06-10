import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Loader2, MapPin, Calendar, Users, Star, Mic, Camera, Award, ArrowLeft, PlayCircle, Handshake, CheckCircle2, Ticket, X } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Image } from '../components/ui/Image';
import { useAuthStore } from '../store/authStore';

// Mock Gallery arrays to ensure 15-30 images total
const GALLERY_STAGE = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1475721025505-c31da16c6d09?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=800"
];
const GALLERY_AUDIENCE = [
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1523580494112-071a1727715f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"
];
const GALLERY_NETWORKING = [
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1604085572502-b06cbafd8d56?auto=format&fit=crop&q=80&w=800"
];
const GALLERY_BTS = [
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800"
];

const METRICS = [
  { label: "Attendees", value: "5000+", icon: Users },
  { label: "Speakers", value: "100+", icon: Mic },
  { label: "Partners", value: "50+", icon: Handshake },
  { label: "Satisfaction", value: "95%", icon: Star },
];

function BookingModal({ event, onClose }: { event: any, onClose: () => void }) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const total = event.price * (selectedSeats.length || 1);

  // Generate mock seat layout
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  // Stable random logic to mark some seats as booked
  const isBooked = (seat: string) => {
    let hash = 0;
    const str = `${event.id}-${seat}`;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % 10 > 6; // ~30% booked
  };

  const toggleSeat = (seat: string) => {
    if (isBooked(seat)) return;
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleConfirm = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    setIsProcessing(true);
    try {
      await api.post('/bookings', { eventId: event.id, tickets: selectedSeats.length, selectedSeats });
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      setStep(2);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to book ticket');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg max-h-[90vh] flex flex-col glass rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white z-20 transition-colors bg-black/50 backdrop-blur-md rounded-full p-2">
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <>
            <div className="p-8 overflow-y-auto">
              <h2 className="text-3xl font-bold display-font tracking-tight mb-2 pr-10">Select Your Seats</h2>
              <p className="text-gray-400 font-light mb-8">Choose your preferred spots for {event.title}.</p>

              <div className="flex gap-4 items-center mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
                 <Image src={event.bannerUrl || undefined} category={event.category?.name} alt="Event thumbnail" containerClassName="w-20 h-20 rounded-xl" className="object-cover w-full h-full" />
                 <div className="flex-1">
                   <h4 className="font-bold text-lg leading-tight mb-1">{event.title}</h4>
                   <div className="text-sm text-gray-400 flex items-center gap-1.5 mb-1">
                     <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                     {new Date(event.date).toLocaleDateString()}
                   </div>
                   <div className="text-sm text-gray-400 flex items-center gap-1.5">
                     <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                     {event.venue}
                   </div>
                 </div>
              </div>

              <div className="mb-4">
                <div className="w-full h-8 bg-gradient-to-b from-white/20 to-transparent rounded-t-full mb-8 border-t border-white/30 flex items-center justify-center text-xs text-gray-500 font-bold uppercase tracking-widest pt-2">
                  Stage
                </div>
                
                <div className="flex flex-col gap-3 items-center">
                  {rows.map(row => (
                    <div key={row} className="flex gap-3 items-center">
                      <div className="w-6 text-center text-sm font-bold text-gray-500">{row}</div>
                      <div className="flex gap-2">
                        {cols.map(col => {
                          const seat = `${row}${col}`;
                          const booked = isBooked(seat);
                          const selected = selectedSeats.includes(seat);
                          return (
                            <button
                              key={seat}
                              disabled={booked}
                              onClick={() => toggleSeat(seat)}
                              className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${
                                booked 
                                  ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                                  : selected 
                                    ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110' 
                                    : 'bg-gray-900 border-white/20 text-gray-300 hover:border-indigo-500/50 hover:bg-gray-800'
                              }`}
                            >
                              {col}
                            </button>
                          );
                        })}
                      </div>
                      <div className="w-6 text-center text-sm font-bold text-gray-500">{row}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <div className="w-4 h-4 rounded-md border border-white/20 bg-gray-900"></div> Available
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <div className="w-4 h-4 rounded-md border border-indigo-400 bg-indigo-500"></div> Selected
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <div className="w-4 h-4 rounded-md border border-gray-700 bg-gray-800 opacity-50"></div> Booked
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-gray-900/80 border-t border-white/10 backdrop-blur-xl shrink-0 mt-auto shadow-[0_-20px_40px_rgba(0,0,0,0.5)] z-10 sticky bottom-0">
               <div className="flex justify-between items-center mb-4">
                 <div>
                   <div className="text-xs md:text-sm text-gray-400 font-medium tracking-widest uppercase mb-1">Total Due</div>
                   <div className="text-3xl md:text-4xl font-bold display-font">₹{selectedSeats.length > 0 ? (event.price * selectedSeats.length).toLocaleString('en-IN') : '0'}</div>
                 </div>
                 <Button onClick={handleConfirm} disabled={selectedSeats.length === 0} isLoading={isProcessing} className="h-12 md:h-14 px-6 md:px-8 rounded-xl font-bold bg-white text-gray-950 hover:bg-gray-200 disabled:opacity-50">
                   Confirm Booking
                 </Button>
               </div>
               {selectedSeats.length > 0 && (
                 <div className="text-sm text-gray-400 text-center">
                   {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} selected: <span className="text-white font-medium">{selectedSeats.join(', ')}</span>
                 </div>
               )}
            </div>
          </>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-8 self-center relative">
               <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
               <CheckCircle2 className="w-12 h-12 text-emerald-500 relative z-10" />
            </div>
            <h2 className="text-4xl font-bold display-font tracking-tight mb-4">You're going!</h2>
            <p className="text-gray-400 font-light text-lg mb-8 max-w-sm">
              Your {selectedSeats.length} pass(es) ({selectedSeats.join(', ')}) for {event.title} have been confirmed. An email receipt has been sent.
            </p>
            <Button onClick={() => navigate('/my-tickets')} className="h-14 w-full rounded-xl font-bold text-base shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              View My Tickets
            </Button>
            <button onClick={onClose} className="mt-4 text-gray-400 hover:text-white font-medium transition-colors">
              Continue Browsing
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4 bg-gray-950 text-white">
        <p className="text-2xl font-bold">Event not found.</p>
        <Button onClick={() => navigate('/events')} className="rounded-full px-8 bg-white text-gray-950">Back to Gallery</Button>
      </div>
    );
  }

  // Ensure similar events skip the active event and provide 3 options.
  const similarEvents: any[] = [];

  return (
    <div className="min-h-screen bg-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-gray-950 to-gray-950 text-white font-sans selection:bg-indigo-500/30">
      
      {showBookingModal && (
        <BookingModal event={event} onClose={() => setShowBookingModal(false)} />
      )}

      {/* Hero Banner */}
      <section className="relative h-[80vh] flex items-end pb-24 overflow-hidden border-b border-white/5">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image 
            src={event.bannerUrl || undefined} 
            alt={event.title} 
            category={event.category?.name}
            containerClassName="absolute inset-0 w-full h-full scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-indigo-900/20 mix-blend-overlay"></div>
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
           <Link to="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest bg-gray-950/60 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 w-max hover:bg-gray-900 shadow-xl group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Discover
           </Link>

           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="max-w-4xl"
             >
                <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                  {event.category?.name || "Premium Experience"}
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 display-font leading-none text-balance">{event.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-300 text-lg">
                  <div className="flex items-center gap-2 bg-gray-950/40 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md font-medium">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    {new Date(event.date).toLocaleDateString("en-US", { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-950/40 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md font-medium">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    {event.venue}
                  </div>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="glass p-8 rounded-[2rem] w-full md:w-[400px] flex-shrink-0 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px]"></div>
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <p className="text-sm text-gray-400 font-semibold uppercase tracking-widest">Registration</p>
                  <p className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5"><Ticket className="w-3 h-3" /> Available</p>
                </div>
                <div className="text-5xl font-bold text-white mb-6 display-font relative z-10">
                  {event.price === 0 ? "Free" : `₹${event.price.toLocaleString('en-IN')}`}
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                   <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                   <p className="text-xs text-gray-400 mt-2 text-right">Selling fast: 65% booked</p>
                </div>
                <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] bg-white text-gray-950 hover:bg-gray-200 relative z-10" onClick={() => setShowBookingModal(true)}>
                  Reserve Seat
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1.5 relative z-10">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Instant Booking
                </p>
             </motion.div>
           </div>
        </div>
      </section>

      {/* Event Story & Highlights */}
      <section className="py-32">
        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-[1fr_350px] gap-16">
          <div className="space-y-20">
            {/* Intro */}
            <div>
              <h2 className="text-4xl font-bold mb-8 display-font tracking-tight">The Event Journey</h2>
              <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-light leading-relaxed">
                 <p className="text-2xl text-gray-200 mb-8 leading-normal font-medium">
                   {event.description}
                 </p>
                 <p>Join the ecosystem's most ambitious minds. This isn't just an event; it's a movement catalyzing innovation across the nation. Experience immersive keynotes, high-stakes networking, and workshops that redefine building products for the next billion users.</p>
              </div>
            </div>

            {/* Video Aftermovie Showcase */}
            <div className="glass rounded-[2rem] overflow-hidden relative min-h-[400px] flex items-center justify-center group cursor-pointer border-white/10 shadow-2xl">
               <Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200" containerClassName="absolute inset-0 w-full h-full" className="opacity-60 group-hover:scale-105 transition-transform duration-[1.5s]" alt="Aftermovie" />
               <div className="absolute inset-0 bg-gray-950/30 backdrop-blur-[1px]"></div>
               <div className="relative z-10 flex flex-col items-center">
                   <button className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 transition-transform group-hover:scale-110 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                      <PlayCircle className="w-8 h-8 text-white ml-1" />
                   </button>
                   <h3 className="text-3xl font-bold mt-6 display-font text-white drop-shadow-lg">Relive Highlights</h3>
               </div>
            </div>

            {/* Premium Photo Timeline / Gallery Categories */}
            <div>
              <div className="flex items-center justify-between mb-12">
                 <h2 className="text-4xl font-bold display-font tracking-tight flex items-center gap-4">
                   <Camera className="w-8 h-8 text-indigo-400" />
                   Visual Documentary
                 </h2>
                 <div className="text-indigo-400 font-semibold tracking-widest uppercase text-sm">Rich Media Gallery</div>
              </div>
              
              <div className="space-y-16">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-200 flex items-center gap-3 display-font"><Award className="w-6 h-6 text-indigo-400" /> Main Stage & Keynotes</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {GALLERY_STAGE.map((src, i) => (
                      <div key={i} className={`rounded-2xl overflow-hidden border border-white/10 relative group ${i === 0 ? "col-span-2 row-span-2 lg:col-span-2" : "aspect-square"}`}>
                         <Image src={src} className="group-hover:scale-110 transition-transform duration-700" alt="Main stage" />
                         <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-200 flex items-center gap-3 display-font"><Users className="w-6 h-6 text-indigo-400" /> The Audience</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {GALLERY_AUDIENCE.map((src, i) => (
                      <div key={i} className={`rounded-2xl overflow-hidden border border-white/10 relative group aspect-video ${i === 0 ? "lg:col-span-2 lg:row-span-2 h-full" : ""}`}>
                         <Image src={src} className="group-hover:scale-110 transition-transform duration-700" alt="Audience" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-200 flex items-center gap-3 display-font"><Handshake className="w-6 h-6 text-indigo-400" /> Networking & Behind The Scenes</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                    {[...GALLERY_NETWORKING, ...GALLERY_BTS].slice(0, 7).map((src, i) => (
                      <div key={i} className={`rounded-2xl overflow-hidden border border-white/10 relative group aspect-square ${i === 3 ? "col-span-2 aspect-auto" : ""}`}>
                         <Image src={src} className="group-hover:scale-110 transition-transform duration-700" alt="Networking" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <div className="space-y-8">
            {/* Organized By */}
            <div className="glass p-8 rounded-[2rem]">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6">Hosted By</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold shadow-lg text-white">
                  {event.organizer?.name?.charAt(0) || "O"}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white display-font">{event.organizer?.name}</h4>
                  <p className="text-sm text-indigo-400 font-medium">Verified Organizer</p>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="glass p-8 rounded-[2rem]">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6">Event Scale</h3>
              <div className="space-y-6">
                {METRICS.map((metric, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <metric.icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white display-font">{metric.value}</div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{metric.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Explore Similar Events */}
      <section className="py-24 border-t border-white/5 bg-gray-950">
         <div className="max-w-[1400px] mx-auto px-6">
             <h2 className="text-4xl font-bold text-white mb-12 display-font">Explore Similar Events</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {similarEvents.map((sim: any, idx: number) => (
                  <Link key={sim.id} to={`/events/${sim.id}`} onClick={() => window.scrollTo(0,0)} className="block group">
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all">
                       <div className="h-48 relative overflow-hidden bg-gray-900 border-b border-white/10">
                          <Image src={sim.bannerUrl || undefined} category={sim.category?.name} alt={sim.title} className="group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest border border-white/10">{sim.category.name}</div>
                       </div>
                       <div className="p-6 bg-gray-950/50 backdrop-blur-lg">
                          <h4 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors display-font line-clamp-1">{sim.title}</h4>
                          <div className="text-sm text-gray-400 font-medium mb-4 flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-indigo-400" />
                             {new Date(sim.date).toLocaleDateString()}
                          </div>
                          <div className="font-bold text-xl text-white">₹{sim.price.toLocaleString('en-IN')}</div>
                       </div>
                    </div>
                  </Link>
                ))}
             </div>
         </div>
      </section>
    </div>
  );
}
