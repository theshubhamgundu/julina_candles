import React from 'react';
import { FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#185e33] text-white font-sans relative">

      {/* ─── Main Footer Content ─── */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
        
        {/* Column 1: Brand & Social (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-start">
          {/* Circular Logo Badge */}
          <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center p-3.5 shadow-lg mb-6 border-2 border-[#e5c158]">
            <img src="/images/logo.png" alt="Julina Candles & Melts Logo" className="w-full h-full object-contain" />
          </div>

          {/* Social Icons */}
          <div className="flex gap-3.5 mb-6">
            {[
              { icon: <FaInstagram className="text-[#E1306C]" />, href: 'https://instagram.com/julinacandles.in', label: 'Instagram' },
              { icon: <FaWhatsapp className="text-[#25D366]" />, href: 'https://wa.me/917304888197', label: 'WhatsApp' },
              { icon: <FaYoutube className="text-[#FF0000]" />, href: 'http://www.youtube.com/@julinacandles.1', label: 'YouTube' },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-xl shadow-md transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>

          <p className="text-sm text-cream/90 leading-relaxed">
            Copyright 2026 Julina Candles & Melts.<br />
            Luxury Decorative & Scented Candle Exporter
          </p>
        </div>

        {/* 2-Column Side-by-Side Wrapper for Mobile (Company on Left, Policies on Right) */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-6 w-full">
          {/* Column 2: Essential Quick Links */}
          <div>
            <h4 className="font-bold text-white text-lg mb-4 font-serif">Company</h4>
            <ul className="space-y-3 text-sm text-cream/95 font-medium">
              <li><Link to="/" className="hover:text-white transition flex items-center gap-2"><span className="text-[#e5c158] text-base">•</span> Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition flex items-center gap-2"><span className="text-[#e5c158] text-base">•</span> About Us</Link></li>
              <li><Link to="/products" className="hover:text-white transition flex items-center gap-2"><span className="text-[#e5c158] text-base">•</span> All Products</Link></li>
              <li><Link to="/search" className="hover:text-white transition flex items-center gap-2"><span className="text-[#e5c158] text-base">•</span> Search</Link></li>
              <li><Link to="/cart" className="hover:text-white transition flex items-center gap-2"><span className="text-[#e5c158] text-base">•</span> Cart</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies List */}
          <div>
            <h4 className="font-bold text-white text-lg mb-4 font-serif">Policies</h4>
            <ul className="space-y-3 text-sm text-cream/95 font-medium">
              <li><Link to="/terms" className="hover:text-white transition flex items-center gap-2"><span className="text-[#e5c158] text-base">•</span> Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition flex items-center gap-2"><span className="text-[#e5c158] text-base">•</span> Privacy Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition flex items-center gap-2"><span className="text-[#e5c158] text-base">•</span> Shipping Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition flex items-center gap-2"><span className="text-[#e5c158] text-base">•</span> Refund & Returns</Link></li>
            </ul>
          </div>
        </div>

        {/* Column 4: Contact & Inquiries (4 cols) */}
        <div className="lg:col-span-4 text-sm text-cream/95 space-y-4">
          <div>
            <h4 className="font-bold text-white text-lg mb-1.5 font-serif">Get in Touch:</h4>
            <p className="leading-snug"><a href="mailto:pranita311096@gmail.com" className="hover:underline">pranita311096@gmail.com</a> (Order queries)</p>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg font-serif">Customer Care:</h4>
            <p className="mt-1">+91 73048 88197</p>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg font-serif">Timings:</h4>
            <p className="mt-1">10 AM - 7 PM (Monday to Saturday)</p>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg font-serif">Location:</h4>
            <p className="leading-relaxed text-cream/90 mt-1">
              Room No. 28, Sai Shraddha Apartment, Sai Nagari, Ashelegaon, Ulhasnagar, Maharashtra - 421004
            </p>
          </div>
        </div>

      </div>

      {/* ─── Bottom Artisanal Candles Decorative Banner ─── */}
      <div className="w-full -mt-16 md:-mt-24 relative z-20 pointer-events-none">
        <img
          src="/images/candles_footer_banner.png"
          alt="Artisanal Candles Footer Decoration"
          className="w-full h-auto block"
        />
      </div>

    </footer>
  );
};

export default Footer;

