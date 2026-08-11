import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f6f1e7] py-10 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-[#ede3cf] overflow-hidden">
        {/* Left Side - Julina Candles & Melts Brand Showcase */}
        <div className="hidden md:flex flex-col md:w-1/2 items-center justify-center p-8 bg-gradient-to-br from-[#185e33]/5 to-[#e5c158]/10 border-r border-[#ede3cf]">
          <img src="https://res.cloudinary.com/bzykgznp/image/upload/v1786389852/julina_candles/products/logo.png" alt="Julina Candles & Melts Logo" className="h-12 w-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-center mb-2 text-[#185e33] font-serif">
            Julina Candles & Melts
          </h1>
          <p className="text-gray-600 text-center text-sm mb-6 max-w-xs leading-relaxed font-medium">
            Hand-poured artisanal soy wax candles to illuminate your space with warmth and elegance.
          </p>
          <div className="relative group max-w-xs">
            <img
              src="/images/mainImage.png"
              alt="Julina Candles & Melts Artisanal Candles"
              className="object-contain max-h-72 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="mt-6 flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-amber-200 text-xs font-semibold text-amber-900 shadow-sm">
            <span>🕯️ 100% Pure Soy Wax • Hand-poured</span>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
          {isSignUp ? <Signup /> : <Login />}
          <div className="mt-6 text-center">
            <button
              className="text-sm font-bold text-[#185e33] hover:text-[#134b28] transition duration-300 underline underline-offset-4"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

