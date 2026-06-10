import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, Music, Code, Briefcase, Mic, Trophy, Palette, Star, Users, MapPin, PlayCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';


import { Image } from '../components/ui/Image';

const CATEGORIES = [
  { name: 'Tech & AI Summits', icon: Code, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800' },
  { name: 'Startup Mahakumbh', icon: Briefcase, image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800' },
  { name: 'Cultural Festivals', icon: Palette, image: 'https://images.unsplash.com/photo-1604085572502-b06cbafd8d56?auto=format&fit=crop&q=80&w=800' },
  { name: 'Music Concerts', icon: Music, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800' },
  { name: 'Leadership & Govt', icon: Mic, image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800' },
  { name: 'College Fests', icon: Users, image: 'https://images.unsplash.com/photo-1523580494112-071a1727715f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Community Events', icon: Briefcase, image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Networking Events', icon: Users, image: 'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=800' }
];

const COMMUNITY_IMAGES = [
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1523580494112-071a1727715f?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=600"
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', role: 'Event Producer, TechSparks', text: 'EventHub completely transformed how we manage our summits. The analytics are unparalleled and visually stunning.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
  { name: 'Priya Patel', role: 'Founder, DesignIndia', text: 'Booking and hosting design workshops is seamless now. The glassmorphism UI feels incredibly premium and modern.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { name: 'Vikram Singh', role: 'Community Lead', text: 'Our engagement skyrocketed. Attendees love the fluid booking flow and the rich event stories.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
];

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 font-sans selection:bg-indigo-500/30">
      {/* Full-Screen Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=2000" alt="Indian Startup Conference" containerClassName="absolute inset-0 w-full h-full scale-105" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/80 to-gray-950"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-transparent to-purple-900/40 mix-blend-multiply"></div>
        </motion.div>
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full flex flex-col items-center text-center pt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-indigo-300 shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              India's Largest Event Ecosystem
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white max-w-6xl text-balance leading-[0.95] display-font">
              Experience <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Culture & Tech.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl text-balance font-light leading-relaxed">
              Discover, book, and manage premium events across India. From high-energy startup summits to rich cultural festivals.
            </p>
            
            <motion.div 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="pt-8 flex flex-wrap justify-center gap-4"
            >
              <Link to="/events">
                 <button className="h-16 px-10 rounded-full bg-white text-gray-950 text-lg font-bold shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3 group">
                   Explore Events
                   <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                 </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:grid grid-cols-4 gap-8 mt-32 p-6 rounded-[2rem] glass w-full max-w-5xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 mix-blend-overlay pointer-events-none"></div>
            <div className="flex flex-col items-center justify-center p-4 border-r border-white/5 relative z-10">
               <span className="text-5xl font-bold display-font text-white mb-2">5M+</span>
               <span className="text-sm text-gray-400 font-semibold uppercase tracking-widest">Attendees</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-r border-white/5 relative z-10">
               <span className="text-5xl font-bold display-font text-white mb-2">15k+</span>
               <span className="text-sm text-gray-400 font-semibold uppercase tracking-widest">Organizers</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-r border-white/5 relative z-10">
               <span className="text-5xl font-bold display-font text-white mb-2">1.2M+</span>
               <span className="text-sm text-gray-400 font-semibold uppercase tracking-widest">Startups</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 relative z-10">
               <span className="text-5xl font-bold display-font text-white mb-2">4.9</span>
               <span className="text-sm text-gray-400 font-semibold uppercase tracking-widest">Global Rating</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-40 bg-gray-950 relative z-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-20 grid md:grid-cols-2 gap-10 items-end">
             <div>
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter display-font">Curated <br/>Experiences</h2>
             </div>
             <p className="text-xl text-gray-400 max-w-lg mb-4">Find the perfect blend of innovation and tradition tailored to your evolving interests.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category, idx) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative h-[400px] rounded-[2rem] overflow-hidden cursor-pointer bg-gray-900 border border-white/5"
              >
                <Image src={category.image} alt={category.name} containerClassName="absolute inset-0 w-full h-full" className="transition-transform duration-[1.5s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent"></div>
                <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-6 group-hover:-translate-y-3 transition-transform duration-500 shadow-2xl">
                    <category.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2 display-font">{category.name}</h3>
                  <div className="h-[2px] w-0 bg-indigo-400 group-hover:w-12 transition-all duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section / Photo Wall */}
      <section className="py-40 bg-gray-900 border-y border-white/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 mb-20 text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter display-font">The Vibrant Community</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">15,000+ creators, founders, and leaders converging to shape the future of India.</p>
        </div>
        
        <div className="relative w-full overflow-hidden flex flex-col gap-6">
          <motion.div 
             animate={{ x: [0, -1000] }}
             transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
             className="flex gap-6 w-max pl-6"
          >
             {[...COMMUNITY_IMAGES, ...COMMUNITY_IMAGES].map((src, i) => (
                <div key={i} className="w-[400px] h-[300px] rounded-[2rem] overflow-hidden shrink-0 border border-white/10">
                   <Image src={src} className="hover:scale-105 transition-transform duration-700" alt="Community" />
                </div>
             ))}
          </motion.div>
          
          <motion.div 
             animate={{ x: [-1000, 0] }}
             transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
             className="flex gap-6 w-max pl-6"
          >
             {[...COMMUNITY_IMAGES, ...COMMUNITY_IMAGES].reverse().map((src, i) => (
                <div key={i} className="w-[300px] h-[300px] rounded-[2rem] overflow-hidden shrink-0 border border-white/10">
                   <Image src={src} className="hover:scale-105 transition-transform duration-700" alt="Networking" />
                </div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-40 bg-gray-950 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950 pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="mb-20 text-center">
            <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4 block">Success Stories</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter display-font">Built for the Best</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-[2rem] p-10 flex flex-col"
              >
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-indigo-400 text-indigo-400" />
                  ))}
                </div>
                <p className="text-xl text-gray-300 mb-10 flex-1 leading-relaxed font-light hover:text-white transition-colors">"{testimonial.text}"</p>
                <div className="flex items-center gap-5 pt-8 border-t border-white/10">
                  <Image src={testimonial.avatar} alt={testimonial.name} containerClassName="w-14 h-14 rounded-full border border-white/20 shrink-0" className="object-cover" />
                  <div>
                    <h4 className="font-bold text-white text-lg display-font">{testimonial.name}</h4>
                    <p className="text-sm text-indigo-400 font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video / Aftermovie Teaser Section */}
      <section className="py-32 bg-gray-950 px-6">
         <div className="max-w-[1400px] mx-auto glass rounded-[3rem] overflow-hidden relative min-h-[600px] flex items-center justify-center border-white/20 group">
              <Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600" containerClassName="absolute inset-0 w-full h-full opacity-50 group-hover:scale-105 transition-transform duration-1000" className="object-cover" alt="Aftermovie bg" />
             <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-[2px]"></div>
             
             <div className="relative z-10 flex flex-col items-center text-center p-8">
                 <button className="w-24 h-24 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 transition-all hover:scale-110 mb-8 shadow-2xl group-hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                    <PlayCircle className="w-10 h-10 text-white ml-2" />
                 </button>
                 <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 display-font">Relive The Magic</h2>
                 <p className="text-xl text-gray-300 max-w-lg mx-auto">Watch highlights from the official 2025 Mahakumbh Aftermovie.</p>
             </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-gray-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 glass rounded-[3rem] p-16 md:p-24 border border-white/20">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter display-font">Host your legacy.</h2>
          <p className="text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">Join the most prestigious platform to launch and manage remarkable experiences.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register">
               <button className="h-16 px-10 rounded-full bg-white text-gray-950 text-lg font-bold shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] transition-all">
                 Start Creating
               </button>
            </Link>
            <Link to="/events">
               <button className="h-16 px-10 rounded-full bg-white/5 border border-white/20 text-white text-lg font-bold hover:bg-white/10 transition-all">
                 View Gallery
               </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
