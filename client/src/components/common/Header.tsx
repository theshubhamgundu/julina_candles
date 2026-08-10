import React, { useState } from 'react';
import { FaBars, FaBox, FaHome, FaSearch, FaShoppingCart, FaTimes, FaWhatsapp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';

const promoOffers = [
  "✨ 100% Handcrafted Scented & Soy Wax Candles • Luxury Home Fragrance & Ambiance",
  "🪔 Exquisite Decorative Urli & Festival Candles • Hand-poured with Premium Aromatherapy Oils",
  "🚢 Trusted Exporter & Supplier of Premium Candles from Maharashtra, India",
  "📦 Express Delivery & Worldwide Shipping Available",
  "📞 Customer Care & Wholesale Inquiries: +91 7304888197",
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const linkClass = "flex flex-col items-center gap-1 text-[#185e33] hover:text-[#c4633c] transition duration-300";

  return (
    <>
      {/* ─── Top Offer & Promo Announcement Marquee Bar ─── */}
      <div className="w-full bg-[#e5c158] text-primaryDark font-bold text-xs py-1.5 px-4 overflow-hidden relative z-50 border-b border-black/10">
        <div className="relative w-full flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {[...promoOffers, ...promoOffers].map((offer, idx) => (
              <span key={idx} className="flex items-center gap-2 tracking-wide font-sans">
                <span>{offer}</span>
                <span className="text-primaryDark/40 ml-6">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className="bg-white/95 text-[#185e33] border-b border-[#efe9db] shadow-sm p-3.5 px-4 md:px-12 relative z-40 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2.5">
              <img src="/images/logo.png" alt="Julina Candles & Melts Logo" className="h-9 md:h-12 w-auto object-contain" />
              <span className="text-lg md:text-2xl font-serif font-bold tracking-wide text-[#185e33]">Julina Candles & Melts</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={linkClass}>
              <FaHome />
              <span className="text-xs font-sans">Home</span>
            </Link>

            <Link to="/search" className={linkClass}>
              <FaSearch />
              <span className="text-xs">Search</span>
            </Link>

            <Link to="/products" className={linkClass}>
              <FaBox />
              <span className="text-xs">Products</span>
            </Link>

            <Link to="/cart" className={`${linkClass} relative`}>
              <FaShoppingCart />
              <span className="text-xs">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center bg-[#c4633c] text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/search" className="text-[#185e33] hover:text-[#c4633c] transition-colors p-1" aria-label="Search">
              <FaSearch className="text-lg" />
            </Link>

            <Link to="/cart" className="text-[#185e33] hover:text-[#c4633c] transition-colors p-1 relative" aria-label="Cart">
              <FaShoppingCart className="text-lg" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs bg-[#c4633c] text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={toggleMobileMenu} className="text-xl focus:outline-none p-1 ml-1 text-[#185e33]" aria-label="Toggle Menu">
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeMobileMenu}
        >
          <div
            className={`fixed top-0 right-0 w-[82%] max-w-sm h-full bg-gradient-to-b from-[#144f2b] to-[#185e33] text-white shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drawer Header */}
            <div>
              <div className="flex justify-between items-center pb-5 border-b border-white/15 mb-6">
                <div className="flex items-center gap-2.5">
                  <img src="/images/logo.png" alt="Logo" className="h-9 w-auto" />
                  <span className="font-serif font-bold text-lg text-cream">Julina Candles & Melts</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-base transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 text-white font-medium text-base transition-colors"
                >
                  <FaHome className="text-[#e5c158]" />
                  <span>Home</span>
                </Link>

                <Link
                  to="/products"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 text-white font-medium text-base transition-colors"
                >
                  <FaBox className="text-[#e5c158]" />
                  <span>All Products</span>
                </Link>

                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 text-white font-medium text-base transition-colors"
                >
                  <span className="text-[#e5c158] font-bold text-lg leading-none">🌾</span>
                  <span>Our Story & Mission</span>
                </Link>

                <Link
                  to="/search"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 text-white font-medium text-base transition-colors"
                >
                  <FaSearch className="text-[#e5c158]" />
                  <span>Search Products</span>
                </Link>

                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-white/10 text-white font-medium text-base transition-colors justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <FaShoppingCart className="text-[#e5c158]" />
                    <span>Shopping Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-[#e5c158] text-primaryDark font-bold text-xs px-2.5 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Bottom Drawer Footer */}
            <div className="pt-6 border-t border-white/15 flex flex-col gap-3">
              <a
                href="https://wa.me/917304888197"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 text-sm shadow-md transition-colors"
              >
                <FaWhatsapp className="text-lg" />
                <span>WhatsApp Support</span>
              </a>

              <p className="text-[11px] text-cream/70 text-center mt-1">
                Julina Candles & Melts © 2026 • Luxury Decorative & Scented Candle Exporter
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

