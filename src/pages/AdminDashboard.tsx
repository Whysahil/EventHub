import { useState, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, Calendar as CalendarIcon, Ticket, DollarSign, Loader2, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';

// ... Keep existing chart mock ...
const mockChartData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  const { data: eventsData } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data } = await api.get('/events?limit=50');
      return data;
    },
  });

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    date: '',
    venue: '',
    price: '',
    capacity: '',
    description: '',
    bannerUrl: ''
  });

  const createEventMutation = useMutation({
    mutationFn: (newEvent: any) => api.post('/events', newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setFormData({
        title: '', categoryId: '', date: '', venue: '', price: '', capacity: '', description: '', bannerUrl: ''
      });
      alert('Event created successfully!');
    },
    onError: (err) => {
      alert('Failed to create event. Make sure you are an admin.');
      console.error(err);
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    }
  });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-950 text-white pb-32 pt-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 display-font">Platform Intelligence</h1>
            <p className="text-gray-400 text-lg font-light">Real-time metrics and revenue performance for your events.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Stats Cards ... kept from original */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-white/10 hover:border-indigo-500/30 transition-colors shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-none">
                <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Users className="h-5 w-5 text-indigo-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-1">{stats?.totalUsers || 0}</div>
                <div className="text-sm text-emerald-400 font-medium tracking-wide">+12.4% vs Last Month</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-white/10 hover:border-purple-500/30 transition-colors shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-none">
                <CardTitle className="text-sm font-medium text-gray-400">Active Events</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <CalendarIcon className="h-5 w-5 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-1">{stats?.totalEvents || 0}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-white/10 hover:border-pink-500/30 transition-colors shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-none">
                <CardTitle className="text-sm font-medium text-gray-400">Total Bookings</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                  <Ticket className="h-5 w-5 text-pink-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-1">{stats?.totalBookings || 0}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:border-emerald-500/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-none">
                <CardTitle className="text-sm font-medium text-gray-400">Gross Revenue</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-1 text-emerald-300 tracking-tight display-font">₹{stats?.revenue?.toLocaleString('en-IN') || '0'}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="col-span-2 bg-gray-900 border-white/10 shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Revenue Trajectory</CardTitle>
              </div>
              <div className="flex bg-gray-950 rounded-xl p-1 border border-white/5">
                <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-white transition-colors">1W</button>
                <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white/10 text-white shadow-sm border border-white/5">1M</button>
                <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-white transition-colors">1Y</button>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 13, fontWeight: 500}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 13, fontWeight: 500}} dx={-15} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip cursor={{fill: '#1f2937', opacity: 0.6}} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(17,24,39,0.9)', backdropFilter: 'blur(12px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#fff', fontWeight: 'bold' }} />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="col-span-1 space-y-8">
             <Card className="border border-indigo-500/20 bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col items-center justify-center p-10 text-center shadow-[0_0_50px_rgba(99,102,241,0.05)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
               
               <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(99,102,241,0.3)] relative z-10">
                 <CalendarIcon className="h-10 w-10 text-indigo-400" />
               </div>
               
               <h3 className="text-2xl font-bold text-white mb-4 relative z-10 tracking-tight">Host Next Event</h3>
               <p className="text-gray-400 text-base mb-10 leading-relaxed max-w-xs relative z-10">Launch a new premium experience and open ticket sales instantly to our global audience.</p>
               <Button className="w-full rounded-2xl h-14 text-base font-bold bg-white text-gray-950 hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] relative z-10" onClick={() => document.getElementById('create-event')?.scrollIntoView({ behavior: 'smooth' })}>
                  Create Event Workspace
               </Button>
             </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div id="manage-events" className="glass rounded-[2rem] p-8">
               <h2 className="text-2xl font-bold mb-6 display-font">Manage Events</h2>
               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                 {eventsData?.events?.map((ev: any) => (
                   <div key={ev.id} className="bg-gray-900/50 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-white/10 transition-colors">
                     <div>
                       <h4 className="font-bold text-white mb-1 line-clamp-1">{ev.title}</h4>
                       <p className="text-sm text-gray-400">{new Date(ev.date).toLocaleDateString()}</p>
                     </div>
                     <Button 
                       variant="outline" 
                       className="border-red-500/30 text-red-400 hover:bg-red-500/10 shrink-0"
                       onClick={() => {
                         if(confirm('Are you sure you want to delete this event?')) {
                            deleteEventMutation.mutate(ev.id);
                         }
                       }}
                       disabled={deleteEventMutation.isPending}
                     >
                       <Trash2 className="w-4 h-4 mr-2" /> Delete
                     </Button>
                   </div>
                 ))}
                 {(!eventsData?.events || eventsData.events.length === 0) && (
                   <p className="text-gray-400">No events found.</p>
                 )}
               </div>
            </div>

            <div id="create-event" className="glass rounded-[2rem] p-8 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-8 display-font">Create New Event</h2>
              <form className="space-y-6" onSubmit={handleCreate}>
                 <div className="grid sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-300">Event Title</label>
                     <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Startup Mahakumbh 2026" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-300">Category</label>
                     <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                       <option value="">Select a category</option>
                       {categories?.map((c: any) => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                       ))}
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-300">Date & Time</label>
                     <input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} type="datetime-local" className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-300">Location / Venue</label>
                     <input required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Jio World Convention Centre" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-300">Ticket Price (₹)</label>
                     <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} type="number" min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 4999" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-300">Total Capacity</label>
                     <input required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} type="number" min="1" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 1000" />
                   </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Description</label>
                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]" placeholder="Detailed overview of the event..."></textarea>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Cover Banner URL (Optional)</label>
                    <input value={formData.bannerUrl} onChange={e => setFormData({...formData, bannerUrl: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://images.unsplash.com/..." />
                 </div>
                 <div className="pt-2">
                   <Button type="submit" disabled={createEventMutation.isPending} className="w-full px-8 h-12 text-base font-bold bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl">
                     {createEventMutation.isPending ? 'Publishing...' : 'Publish Event'}
                   </Button>
                 </div>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
}
