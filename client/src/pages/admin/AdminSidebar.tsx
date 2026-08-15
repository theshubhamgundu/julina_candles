import React from 'react';
import { 
  FaBox, 
  FaClipboardList, 
  FaMoneyCheckAlt, 
  FaTachometerAlt, 
  FaTimes, 
  FaUsers, 
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaStar
} from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('vh_admin_auth');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { to: '/admin/products', label: 'Products Catalog', icon: FaBox },
    { to: '/admin/featured', label: 'Featured Items', icon: FaStar },
    { to: '/admin/orders', label: 'Orders', icon: FaClipboardList },
    { to: '/admin/customers', label: 'Customers', icon: FaUsers },
    { to: '/admin/coupons', label: 'Coupons & Promos', icon: FaMoneyCheckAlt },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#1a2e1d] text-gray-200 p-5 flex flex-col justify-between border-r border-[#2d4d33] shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end mb-2">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close sidebar"
            >
              <FaTimes size={18} />
            </button>
          </div>
          
          {/* Brand Header */}
          <div className="mb-6 pb-5 border-b border-white/10">
            <Link to="/admin/dashboard" onClick={toggleSidebar} className="group block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C79A56] to-[#e4b97a] flex items-center justify-center text-[#1a2e1d] font-serif font-bold text-xl shadow-md border border-[#C79A56]/40">
                  🕯️
                </div>
                <div>
                  <h1 className="text-base font-serif font-bold text-white tracking-wide group-hover:text-[#e4b97a] transition-colors leading-tight">
                    Julina Candles
                  </h1>
                  <span className="text-[10px] text-[#C79A56] tracking-[0.18em] uppercase font-semibold block mt-0.5">
                    Admin Console
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Quick link to storefront */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white transition border border-white/5 group"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                View Live Store
              </span>
              <FaExternalLinkAlt className="text-[10px] text-gray-400 group-hover:text-white transition" />
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-medium ${
                      isActive
                        ? 'bg-gradient-to-r from-[#C79A56] to-[#b38543] text-gray-950 font-bold shadow-md shadow-[#C79A56]/20'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="text-base shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / Account section */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C79A56]/20 text-[#e4b97a] font-bold flex items-center justify-center text-xs border border-[#C79A56]/30">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">Administrator</p>
              <p className="text-[10px] text-gray-400 truncate">Store Manager</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition duration-200 text-xs font-medium text-red-300 hover:bg-red-500/15 hover:text-red-200 w-full"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;


