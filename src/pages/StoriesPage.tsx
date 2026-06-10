import { Sparkles, Calendar, Users, Mic, Star, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Image } from '../components/ui/Image';

const PAST_EVENTS = [
  {
    title: 'Bengaluru AI Summit 2025',
    date: 'March 2025',
    attendees: '5000+',
    speakers: '120+',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Keynote by Google AI', 'Founders Panel', 'Deep Learning Workshops', 'Exclusive VIP Dinner']
  },
  {
    title: 'Startup Connect India 2025',
    date: 'January 2025',
    attendees: '8500+',
    speakers: '150+',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Mega Pitch Session', 'VC Matchmaking', 'Unicorn Fireside Chat', 'SaaS Networking Lounge']
  },
  {
    title: 'Hyderabad Cloud Summit 2025',
    date: 'November 2024',
    attendees: '3000+',
    speakers: '80+',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Cloud Native Deep Dives', 'AWS vs GCP Debates', 'Serverless Masterclass', 'Kubernetes Architecture']
  }
];

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white pb-32 pt-20 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950 -z-10"></div>
      
      {/* Global Impact Header */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center mb-24">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6 mx-auto shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <Sparkles className="h-4 w-4" /> Global Impact & Reach
         </motion.div>
         <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-black tracking-tighter mb-8 display-font text-balance">
            Defining the Future <br className="hidden md:block"/> of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">Live Experiences.</span>
         </motion.h1>
         <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
            Discover the landmark summits, elite masterclasses, and global festivals scaled seamlessly on our premium infrastructure over the past year.
         </motion.p>
      </div>

      {/* Global Stats Grid */}
      <div className="max-w-[1400px] mx-auto px-6 mb-32 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
           {[
             { label: 'Total Attendees', value: '5000+', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
             { label: 'Global Speakers', value: '100+', icon: Mic, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
             { label: 'Enterprise Partners', value: '50+', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
             { label: 'Satisfaction Rate', value: '98%', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
           ].map((stat, i) => (
             <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-6`}>
                 <stat.icon className={`w-8 h-8 ${stat.color}`} />
               </div>
               <div className="text-4xl md:text-5xl font-black display-font text-white mb-2">{stat.value}</div>
               <div className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">{stat.label}</div>
             </motion.div>
           ))}
        </div>
      </div>

      {/* Narrative Section */}
      <div className="max-w-[1400px] mx-auto px-6 space-y-32">
        {PAST_EVENTS.map((event, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}
          >
            {/* Visual Column */}
            <div className="w-full lg:w-1/2 relative group">
               <div className="rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] aspect-[4/3]">
                  <Image src={event.image} alt={event.title} containerClassName="absolute inset-0 w-full h-full" className="group-hover:scale-105 transition-transform duration-1000 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                  
                  {/* Floating Date Badge */}
                  <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl rounded-2xl px-6 py-3 flex items-center gap-3 border border-white/10 shadow-xl">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-bold uppercase tracking-widest text-white">{event.date}</span>
                  </div>

                  {/* Floating Attendee Faces */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center">
                      <div className="flex -space-x-4">
                        {['1534528741775-53994a69daeb', '1506794778202-cad84cf45f1d', '1494790108377-be9c29b29330', '1507003211169-0a1dd7228f2d'].map((id, i) => (
                          <div key={i} className="w-12 h-12 rounded-full border-2 border-gray-900 relative shadow-xl overflow-hidden bg-gray-800">
                             <Image src={`https://images.unsplash.com/photo-${id}?w=100&h=100&fit=crop`} containerClassName="w-full h-full" className="object-cover" />
                          </div>
                        ))}
                      </div>
                      <div className="ml-4 text-xs font-bold text-gray-300 uppercase tracking-widest">
                        Joined by <span className="text-white">{event.attendees}</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-yellow-400 text-sm font-bold tracking-widest">
                       {event.rating}/5.0 <Star className="w-4 h-4 fill-yellow-400" />
                    </div>
                  </div>
               </div>
               
               {/* Decorative Element */}
               <div className="absolute -z-10 inset-0 -m-8 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-1000 rounded-[4rem]"></div>
            </div>
            
            {/* Content Column */}
            <div className={`w-full lg:w-1/2 flex flex-col justify-center ${idx % 2 !== 0 ? 'lg:pr-16 text-left lg:items-start' : 'lg:pl-16 text-left lg:items-start'}`}>
               <h2 className="text-5xl lg:text-6xl font-black mb-8 display-font tracking-tight leading-none text-white drop-shadow-sm">{event.title}</h2>
               
               <p className="text-xl text-gray-400 font-light leading-relaxed mb-10">
                 This flagship gathering brought together the brightest minds and industry pioneers. Powered by EventHub's robust architecture, attendees experienced flawless registration, networking, and content delivery.
               </p>
               
               <div className="w-full">
                 <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-6">Event Highlights</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {event.highlights.map((highlight, hIdx) => (
                     <div key={hIdx} className="flex items-start gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl">
                       <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                       <span className="text-sm font-bold text-gray-300">{highlight}</span>
                     </div>
                   ))}
                 </div>
               </div>
               
               <div className="mt-12 pt-10 border-t border-white/10 w-full flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black display-font">{event.speakers}</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Featured Speakers</span>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black display-font text-emerald-400">Zero</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Downtime</span>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black display-font text-indigo-400">100%</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Digital Secure</span>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
