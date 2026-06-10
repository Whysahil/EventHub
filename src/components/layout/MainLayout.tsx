import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Calendar, UserCircle, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';

export const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white selection:bg-indigo-500/30 font-sans">
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isLandingPage ? 'bg-transparent border-transparent' : 'bg-gray-950/80 backdrop-blur-xl border-b border-white/5'}`}>
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12 max-w-[1400px]">
          <Link to="/" className="font-bold text-xl tracking-tight text-white display-font">
            EventHub<span className="text-indigo-400">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300 relative">
            <div className="group relative py-8">
              <span className="cursor-pointer flex items-center gap-1 hover:text-white transition-colors">Platform <ChevronDown className="h-3 w-3" /></span>
              <div className="absolute top-full left-0 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
                <Link to="/how-it-works" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">How It Works</Link>
                <Link to="/categories" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Categories</Link>
                <Link to="/stories" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Success Stories</Link>
              </div>
            </div>
            <div className="group relative py-8">
              <span className="cursor-pointer flex items-center gap-1 hover:text-white transition-colors">Events <ChevronDown className="h-3 w-3" /></span>
              <div className="absolute top-full left-0 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
                <Link to="/events?category=technology" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Technology</Link>
                <Link to="/events?category=startup" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Startup</Link>
                <Link to="/events?category=ai" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">AI</Link>
                <Link to="/events?category=cultural" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Cultural</Link>
                <Link to="/events?category=hackathons" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Hackathons</Link>
              </div>
            </div>
            <div className="group relative py-8">
              <span className="cursor-pointer flex items-center gap-1 hover:text-white transition-colors">Organizers <ChevronDown className="h-3 w-3" /></span>
              <div className="absolute top-full left-0 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
                <Link to="/organizer" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Become Organizer</Link>
                <Link to="/host-event" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Host Event</Link>
                <Link to="/partnerships" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Partnerships</Link>
              </div>
            </div>
            <div className="group relative py-8">
              <span className="cursor-pointer flex items-center gap-1 hover:text-white transition-colors">Company <ChevronDown className="h-3 w-3" /></span>
              <div className="absolute top-full left-0 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
                <Link to="/about" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">About Us</Link>
                <Link to="/careers" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Careers</Link>
                <Link to="/press" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Press</Link>
                <Link to="/blog" className="px-4 py-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors">Blog</Link>
              </div>
            </div>

            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="hover:text-white transition-colors text-indigo-400 py-8">Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/my-tickets')} className="hidden text-gray-300 sm:flex hover:text-white hover:bg-white/5">
                  My Tickets
                </Button>
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center overflow-hidden border border-white/10 relative group">
                     <span className="text-xs font-medium text-white">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-red-400 px-2 hover:bg-red-400/10 rounded-lg">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-white text-gray-950 hover:bg-gray-200">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className={isLandingPage ? "flex-1 w-full" : "flex-1 w-full pt-20"}>
        <Outlet />
      </main>
      
      <footer className="border-t border-white/5 pt-20 pb-10 bg-gray-950 mt-auto">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1400px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
           <div className="lg:col-span-2">
             <Link to="/" className="font-bold text-2xl tracking-tight text-white mb-6 display-font inline-block">
               EventHub<span className="text-indigo-400">.</span>
             </Link>
             <p className="text-base text-gray-400 leading-relaxed max-w-sm font-light">India's premier platform to discover, book, and manage extraordinary experiences globally. Built for builders, creators, and communities.</p>
           </div>
           
           <div>
             <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest display-font">Platform</h4>
             <ul className="space-y-4 text-sm text-gray-400 font-medium">
               <li><Link to="/how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</Link></li>
               <li><Link to="/categories" className="hover:text-indigo-400 transition-colors">Categories</Link></li>
               <li><Link to="/stories" className="hover:text-indigo-400 transition-colors">Success Stories</Link></li>
             </ul>
           </div>

           <div>
             <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest display-font">Events</h4>
             <ul className="space-y-4 text-sm text-gray-400 font-medium">
               <li><Link to="/events?category=technology" className="hover:text-indigo-400 transition-colors">Technology</Link></li>
               <li><Link to="/events?category=startup" className="hover:text-indigo-400 transition-colors">Startup</Link></li>
               <li><Link to="/events?category=ai" className="hover:text-indigo-400 transition-colors">AI</Link></li>
               <li><Link to="/events?category=cultural" className="hover:text-indigo-400 transition-colors">Cultural</Link></li>
             </ul>
           </div>

           <div>
             <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest display-font">Organizers</h4>
             <ul className="space-y-4 text-sm text-gray-400 font-medium">
               <li><Link to="/organizer" className="hover:text-indigo-400 transition-colors">Become Organizer</Link></li>
               <li><Link to="/host-event" className="hover:text-indigo-400 transition-colors">Host Event</Link></li>
               <li><Link to="/partnerships" className="hover:text-indigo-400 transition-colors">Partnerships</Link></li>
             </ul>
           </div>

           <div>
             <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest display-font">Company</h4>
             <ul className="space-y-4 text-sm text-gray-400 font-medium">
               <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
               <li><Link to="/careers" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
               <li><Link to="/press" className="hover:text-indigo-400 transition-colors">Press</Link></li>
               <li><Link to="/support" className="hover:text-indigo-400 transition-colors">Support & FAQ</Link></li>
             </ul>
           </div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 max-w-[1400px] pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 font-medium gap-4">
          <p>© {new Date().getFullYear()} EventHub India. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6 justify-center">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Information</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
