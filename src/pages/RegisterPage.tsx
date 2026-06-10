import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm as useRHForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'motion/react';
import { Github, PlayCircle } from 'lucide-react';
import { Image } from '../components/ui/Image';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useRHForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      const response = await api.post('/auth/register', data);
      login(response.data, response.data.token);
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleOAuth = async (provider: string) => {
    try {
      setOauthLoading(provider);
      setError('');
      const response = await api.get(`/auth/oauth-url?provider=${provider.toLowerCase()}`);
      
      const authWindow = window.open(
        response.data.url,  
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        setError('Please allow popups for this site to connect your account.');
      }
    } catch (err: any) {
      setError('OAuth initialization failed. Please try again.');
    } finally {
      setOauthLoading(null);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { user, token } = event.data.payload;
        login(user, token);
        navigate('/events');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login, navigate]);

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-[#0a0a0a] font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a0a0a] flex-col items-center justify-center overflow-hidden border-r border-white/5">
         
         <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none opacity-50 mix-blend-screen"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none opacity-40 mix-blend-screen"></div>

         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 w-full max-w-lg px-12"
         >
            <div className="mb-12">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-purple-300 mb-6 font-mono">
                  Registration
               </div>
               <h2 className="text-5xl font-bold text-white mb-6 tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
                 Create your legacy.
               </h2>
               <p className="text-gray-400 font-light text-lg tracking-wide leading-relaxed">
                 India's most successful summits, hackathons, and festivals start here.
               </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer aspect-video bg-gray-900">
               <Image src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200" containerClassName="absolute inset-0 w-full h-full" className="group-hover:scale-105 transition-transform duration-1000 opacity-80" alt="Networking" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
               <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl group-hover:bg-white/20 transition-colors">
                     <PlayCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <p className="text-white font-semibold text-sm">Tech Founders Meetup</p>
                     <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">Curated Community</p>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/5 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none z-0"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-10 lg:hidden">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter">EventHub</h1>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tighter text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Join EventHub.</h1>
            <p className="text-base text-gray-400 font-light tracking-wide">Create an account to book your next premium event.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              type="button" 
              onClick={() => handleOAuth('Google')} 
              disabled={oauthLoading !== null}
              className="flex-1 h-12 bg-[#121212] hover:bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-white transition-all hover:border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.02)] active:scale-95 disabled:opacity-50"
            >
               <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
               {oauthLoading === 'Google' ? 'Connecting...' : 'Google'}
            </button>
            <button 
              type="button" 
              onClick={() => handleOAuth('GitHub')} 
              disabled={oauthLoading !== null}
              className="flex-1 h-12 bg-[#121212] hover:bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-white transition-all hover:border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.02)] active:scale-95 disabled:opacity-50"
            >
               <Github className="w-4 h-4" />
               {oauthLoading === 'GitHub' ? 'Connecting...' : 'GitHub'}
            </button>
          </div>
          
          <div className="relative mb-8">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
             <div className="relative flex justify-center text-xs"><span className="px-4 bg-[#0a0a0a] text-gray-500 font-medium tracking-widest uppercase">Or email</span></div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl text-sm text-center font-medium shadow-lg backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                  <p className="text-red-400">{error}</p>
              </div>
            )}
            
            <Input 
              label="Full Name" 
              placeholder="John Doe"
              {...register('name')}
              error={errors.name?.message}
              className="bg-[#121212] border-white/10 focus:border-indigo-500/50 focus:bg-[#1a1a1a] transition-all"
            />

            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@company.com"
              {...register('email')}
              error={errors.email?.message}
              className="bg-[#121212] border-white/10 focus:border-indigo-500/50 focus:bg-[#1a1a1a] transition-all"
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
              className="bg-[#121212] border-white/10 focus:border-indigo-500/50 focus:bg-[#1a1a1a] transition-all"
            />
            
            <Button type="submit" className="w-full h-14 text-base font-bold rounded-xl mt-8 bg-white text-gray-950 hover:bg-gray-200 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98]" isLoading={isSubmitting}>
              Create Account
            </Button>
            
            <p className="text-center text-sm font-medium text-gray-400 mt-10">
              Already have an account? <Link to="/login" className="text-white hover:text-indigo-400 ml-1 transition-colors underline underline-offset-4">Log in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
