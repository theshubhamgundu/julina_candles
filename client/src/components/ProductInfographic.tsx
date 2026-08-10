import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaShieldAlt, FaFire, FaSmile } from 'react-icons/fa';

const ProductInfographic: React.FC = () => {
  return (
    <div className="w-full my-12 bg-[#FBF6ED] rounded-3xl border border-[#E6DACB] overflow-hidden shadow-xl font-sans">
      
      {/* ─── Top Header Banner ─── */}
      <div className="bg-[#5C2333] text-white text-center py-6 px-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
          Julina Candles & Melts Craftsmanship Difference
        </h2>
        <p className="text-[#C79A56] text-sm sm:text-base font-semibold mt-1 tracking-wide uppercase">
          100% Pure Soy Wax • Non-Toxic • Hand-poured in India
        </p>
      </div>

      <div className="p-6 sm:p-10 space-y-10">
        
        {/* ─── Top Showcase Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Image & Endorsement */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E6DACB] shadow-sm relative overflow-hidden">
              <div className="bg-[#C79A56]/15 text-[#5C2333] font-bold text-xs px-3.5 py-1.5 rounded-full inline-block mb-3">
                ✨ Handcrafted Artisanal Quality
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2A1C22] leading-snug">
                Hand-poured with natural soy wax, pure aromatherapy oils, and decorative floral embeds for long-lasting clean burn
              </h3>
              <div className="mt-4 flex justify-center">
                <img
                  src="/images/products/julina candles melts artisanal rituals 1.png"
                  alt="Julina Artisanal Candle Showcase"
                  className="h-56 sm:h-64 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389852/julina_candles/products/logo.png';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Key Benefits */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Chips */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#E6DACB] shadow-xs text-xs font-bold text-gray-700">
                <FaFire className="text-[#C79A56]" /> Long & Clean Burn Time
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#E6DACB] shadow-xs text-xs font-bold text-gray-700">
                <FaSmile className="text-[#C79A56]" /> Therapeutic Aromatherapy
              </div>
            </div>

            {/* Answers Box */}
            <div className="bg-white p-6 rounded-2xl border border-[#E6DACB] shadow-sm space-y-4">
              <span className="inline-block bg-[#5C2333] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                The Julina Promise
              </span>

              <h4 className="text-xl font-serif font-bold text-[#2A1C22]">
                Why Choose Our Handcrafted Candles?
              </h4>

              <ul className="space-y-2.5 text-sm font-semibold text-gray-800">
                <li className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-[#C79A56] shrink-0" /> 100% Natural Soy Wax (Biodegradable & Non-toxic)
                </li>
                <li className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-[#C79A56] shrink-0" /> Lead-free Cotton & Wooden Wicks
                </li>
                <li className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-[#C79A56] shrink-0" /> Premium Essential & Fragrance Oils
                </li>
                <li className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-[#C79A56] shrink-0" /> Export Quality Festive & Urli Designs
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* ─── Detailed Comparison Table ─── */}
        <div>
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2A1C22]">
              Candle Quality Comparison Matrix
            </h3>
            <p className="text-xs text-gray-500 mt-1">See how Julina Candles & Melts compare to cheap mass-market paraffin candles.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-6">
            
            {/* Julina Column */}
            <div className="bg-white rounded-2xl border-2 border-[#5C2333] shadow-md overflow-hidden flex flex-col">
              <div className="bg-[#5C2333] text-white p-2.5 sm:p-4 text-center">
                <h4 className="text-xs sm:text-lg font-serif font-bold flex items-center justify-center gap-1 sm:gap-2">
                  <FaShieldAlt className="text-[#C79A56] text-xs sm:text-base" /> <span>Julina Candles & Melts</span>
                </h4>
                <span className="text-[9px] sm:text-xs text-[#C79A56] font-bold block">100% Natural Soy Wax</span>
              </div>

              <div className="p-2 sm:p-5 flex-1 space-y-2 sm:space-y-3.5 text-[10px] sm:text-xs font-medium">
                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#FBF6ED] p-2 sm:p-3 rounded-xl border border-[#E6DACB]">
                  <FaCheckCircle className="text-[#C79A56] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">Pure Soy Wax</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">Soot-free, clean burn safe for children & pets</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#FBF6ED] p-2 sm:p-3 rounded-xl border border-[#E6DACB]">
                  <FaCheckCircle className="text-[#C79A56] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">Essential Oils</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">Rich aroma throw that lingers pleasantly</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#FBF6ED] p-2 sm:p-3 rounded-xl border border-[#E6DACB]">
                  <FaCheckCircle className="text-[#C79A56] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">Lead-free Wicks</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">100% cotton wicks with stable flame</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#FBF6ED] p-2 sm:p-3 rounded-xl border border-[#E6DACB]">
                  <FaCheckCircle className="text-[#C79A56] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">Artisanal Designs</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">Lotus urlis, coffee beans & floral embeds</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Paraffin Column */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gray-800 text-white p-2.5 sm:p-4 text-center">
                <h4 className="text-xs sm:text-lg font-serif font-bold text-gray-200">
                  Mass Market Paraffin Candles
                </h4>
                <span className="text-[9px] sm:text-xs text-gray-400 block">Petroleum Byproduct</span>
              </div>

              <div className="p-2 sm:p-5 flex-1 space-y-2 sm:space-y-3.5 text-[10px] sm:text-xs font-medium">
                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">Petroleum Paraffin</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Emits toxic black soot & chemical fumes</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">Synthetic Fragrances</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Harsh chemical scent causing headaches</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">Cheap Metal Wicks</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Flickering flame and smoke pollution</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">Generic Moulds</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Fast-melting low quality finish</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductInfographic;
