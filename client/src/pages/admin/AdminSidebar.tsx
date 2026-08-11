import React from 'react';
import { FaBox, FaClipboardList, FaMoneyCheckAlt, FaTachometerAlt, FaTimes, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-[#0a180e] text-gray-300 p-6 border-r border-[#16301d]/30 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block z-40`}
      >
        {/* Close button for mobile */}
        <div className="md:hidden mb-6 flex justify-end">
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-white transition duration-200">
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Logo and Home Link */}
        <Link to="/" onClick={toggleSidebar}>
          <div className="mb-10 cursor-pointer border-b border-[#16301d]/50 pb-5">
            <h1 className="text-xl font-serif font-bold text-white tracking-widest flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-secondary rounded-full animate-pulse"></span>
              Julina Candles & Melts
            </h1>
            <span className="text-[10px] text-gray-500 tracking-[0.2em] font-sans uppercase block mt-1">Admin Console</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1 flex flex-col h-[calc(100vh-200px)]">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-sans ${
                isActive
                  ? 'bg-gradient-to-r from-[#1f5133] to-[#2f7d43]/10 text-white font-semibold shadow-inner border-l-4 border-primaryMid'
                  : 'text-gray-400 hover:bg-[#16301d]/30 hover:text-gray-200 border-l-4 border-transparent'
              }`
            }
            onClick={toggleSidebar}
          >
            <FaTachometerAlt className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-sans ${
                isActive
                  ? 'bg-gradient-to-r from-[#1f5133] to-[#2f7d43]/10 text-white font-semibold shadow-inner border-l-4 border-primaryMid'
                  : 'text-gray-400 hover:bg-[#16301d]/30 hover:text-gray-200 border-l-4 border-transparent'
              }`
            }
            onClick={toggleSidebar}
          >
            <FaBox className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200" />
            Products
          </NavLink>

          <NavLink
            to="/admin/featured"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-sans ${
                isActive
                  ? 'bg-gradient-to-r from-[#1f5133] to-[#2f7d43]/10 text-white font-semibold shadow-inner border-l-4 border-primaryMid'
                  : 'text-gray-400 hover:bg-[#16301d]/30 hover:text-gray-200 border-l-4 border-transparent'
              }`
            }
            onClick={toggleSidebar}
          >
            <FaBox className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200" />
            Featured Products
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-sans ${
                isActive
                  ? 'bg-gradient-to-r from-[#1f5133] to-[#2f7d43]/10 text-white font-semibold shadow-inner border-l-4 border-primaryMid'
                  : 'text-gray-400 hover:bg-[#16301d]/30 hover:text-gray-200 border-l-4 border-transparent'
              }`
            }
            onClick={toggleSidebar}
          >
            <FaUsers className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200" />
            Customers
          </NavLink>


          <NavLink
            to="/admin/coupons"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-sans ${
                isActive
                  ? 'bg-gradient-to-r from-[#1f5133] to-[#2f7d43]/10 text-white font-semibold shadow-inner border-l-4 border-primaryMid'
                  : 'text-gray-400 hover:bg-[#16301d]/30 hover:text-gray-200 border-l-4 border-transparent'
              }`
            }
            onClick={toggleSidebar}
          >
            <FaMoneyCheckAlt className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200" />
            Coupons
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-sans ${
                isActive
                  ? 'bg-gradient-to-r from-[#1f5133] to-[#2f7d43]/10 text-white font-semibold shadow-inner border-l-4 border-primaryMid'
                  : 'text-gray-400 hover:bg-[#16301d]/30 hover:text-gray-200 border-l-4 border-transparent'
              }`
            }
            onClick={toggleSidebar}
          >
            <FaClipboardList className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200" />
            Orders
          </NavLink>



          {/* Logout Button */}
          <div className="flex-grow"></div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-sans text-gray-400 hover:bg-red-900/20 hover:text-red-400 border-l-4 border-transparent hover:border-red-500 mt-auto w-full"
          >
            <FaSignOutAlt className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200" />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;

