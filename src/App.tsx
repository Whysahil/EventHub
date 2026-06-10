import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useRouteError } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuthStore } from './store/authStore';
import { Loader2 } from 'lucide-react';

const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const EventsPage = React.lazy(() => import('./pages/EventsPage'));
const EventDetailsPage = React.lazy(() => import('./pages/EventDetailsPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const MyTicketsPage = React.lazy(() => import('./pages/MyTicketsPage'));
const StoriesPage = React.lazy(() => import('./pages/StoriesPage'));
const InfoPage = React.lazy(() => import('./pages/InfoPage'));

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/events" replace />;
  }
  
  return <>{children}</>;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
          <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4 tracking-tight">Something went wrong</h1>
            <p className="text-gray-400 font-light mb-8 font-mono text-xs text-left bg-black/50 p-4 rounded-xl border border-white/5 overflow-auto max-h-48">
              {this.state.error?.message}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white text-gray-950 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:id" element={<EventDetailsPage />} />
              <Route path="stories" element={<StoriesPage />} />
              
              <Route path="how-it-works" element={<InfoPage />} />
              <Route path="categories" element={<InfoPage />} />
              <Route path="organizer" element={<InfoPage />} />
              <Route path="host-event" element={<InfoPage />} />
              <Route path="partnerships" element={<InfoPage />} />
              <Route path="about" element={<InfoPage />} />
              <Route path="careers" element={<InfoPage />} />
              <Route path="press" element={<InfoPage />} />
              <Route path="blog" element={<InfoPage />} />
              <Route path="faq" element={<InfoPage />} />
              <Route path="support" element={<InfoPage />} />
              <Route path="privacy" element={<InfoPage />} />
              <Route path="terms" element={<InfoPage />} />
              <Route path="cookies" element={<InfoPage />} />
              <Route path="contact" element={<InfoPage />} />
              
              <Route path="my-tickets" element={
                <ProtectedRoute>
                  <MyTicketsPage />
                </ProtectedRoute>
              } />
              
              <Route path="admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
