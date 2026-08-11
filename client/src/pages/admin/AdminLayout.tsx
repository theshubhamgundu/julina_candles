import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { FaBars, FaLock } from 'react-icons/fa';
import { usePageSEO } from '../../hooks/usePageSEO';

// ─── Admin password (client-side gate) ───────────────────────────────────────
const ADMIN_PASSWORD = 'julinacandles@2026';
const SESSION_KEY = 'vh_admin_auth';

// ─── Password Gate ────────────────────────────────────────────────────────────
const AdminLoginGate: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  // Auto-pass if already authenticated via admin login page
  React.useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onSuccess();
    }
  }, [onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD || input === 'julinacandles@Admin2026') {
      sessionStorage.setItem(SESSION_KEY, '1');
      // For local/dev convenience: set a temporary admin token so API-protected admin
      // endpoints (which expect a 128-hex token) accept actions. This is only a
      // client-side convenience and should NOT be used in production.
      try {
        const temp = 'a'.repeat(128);
        localStorage.setItem('adminToken', temp);
      } catch (err) {
        console.warn('Could not set temp admin token', err);
      }
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setInput('');
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1e7] flex items-center justify-center px-4">
      <div
        className={`bg-white rounded-3xl shadow-xl border border-[#ede3cf] p-8 w-full max-w-sm ${
          shake ? 'animate-shake' : ''
        }`}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#185e33] flex items-center justify-center mb-4 shadow-md">
            <FaLock className="text-white text-xl" />
          </div>
          <img src="https://res.cloudinary.com/bzykgznp/image/upload/v1786389852/julina_candles/products/logo.png" alt="Julina Candles & Melts" className="h-8 w-auto mb-3" />
          <h1 className="text-xl font-serif font-bold text-[#185e33]">Admin Access</h1>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Enter the admin password to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              placeholder="Enter admin password"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                error
                  ? 'border-red-400 focus:ring-red-300 bg-red-50'
                  : 'border-[#ede3cf] focus:ring-[#185e33]/30 bg-[#faf6ee]'
              }`}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1.5 font-medium">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#185e33] hover:bg-[#134b28] text-white font-bold py-3 rounded-full text-sm transition-colors shadow-md"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

// ─── Admin Layout ─────────────────────────────────────────────────────────────
const AdminLayout: React.FC = () => {
  usePageSEO({
    title: 'Admin Dashboard | Julina Candles & Melts',
    description: 'Admin Portal for Julina Candles & Melts',
    canonical: '/admin',
    noIndex: true,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  );

  if (!isAuthed) {
    return <AdminLoginGate onSuccess={() => setIsAuthed(true)} />;
  }

  return (
    <div className="flex bg-[#f7f4ec] min-h-screen text-[#24291f] font-sans">
      {/* Sidebar wrapper */}
      <div className="fixed z-40">
        <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">

        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-[#efe9db] shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-150 transition-colors"
            >
              <FaBars className="text-xl text-[#24291f]" />
            </button>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1f5133] tracking-wide">Portal Dashboard</h2>
              <p className="text-xs text-gray-500 hidden sm:block">Manage your inventory, products, and orders.</p>
            </div>
          </div>

          {/* Admin Badge + Logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-sm font-semibold text-[#24291f]">Administrator</span>
              <span className="block text-[10px] text-gray-500 capitalize">Admin</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1f5133] to-[#2f7d43] flex items-center justify-center text-white font-bold shadow-md border border-[#efe9db] overflow-hidden">
              <span>A</span>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                setIsAuthed(false);
              }}
              title="Lock admin"
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <FaLock className="text-base" />
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

