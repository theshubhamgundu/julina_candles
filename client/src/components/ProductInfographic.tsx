import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaShieldAlt, FaWeight, FaHeartbeat } from 'react-icons/fa';

const ProductInfographic: React.FC = () => {
  return (
    <div className="w-full my-12 bg-[#faf6ee] rounded-3xl border border-[#ede3cf] overflow-hidden shadow-xl font-sans">
      
      {/* ─── Top Header Banner ─── */}
      <div className="bg-[#185e33] text-white text-center py-6 px-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
          Introducing Julina Candles & Melts Artisanal Candles
        </h2>
        <p className="text-[#e5c158] text-sm sm:text-base font-semibold mt-1 tracking-wide uppercase">
          Smart carbs. Stronger you
        </p>
      </div>

      <div className="p-6 sm:p-10 space-y-10">
        
        {/* ─── Top Showcase Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Rice Image & Doctor Endorsement */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#ede3cf] shadow-sm relative overflow-hidden">
              <div className="bg-[#185e33]/10 text-[#185e33] font-bold text-xs px-3.5 py-1.5 rounded-full inline-block mb-3">
                ⭐ Doctor Approved & Clinically Tested
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#185e33] leading-snug">
                Clinically tested, doctor-approved, and packed with essential nutrition — safe and beneficial for the entire family
              </h3>
              <div className="mt-4 flex justify-center">
                <img
                  src="/images/mainImage.png"
                  alt="Julina Candles & Melts Rice Bowl"
                  className="h-56 sm:h-64 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Pain points & Features */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Pain Points Chips */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#ede3cf] shadow-2xs text-xs font-bold text-gray-700">
                <FaHeartbeat className="text-[#c4633c]" /> Worried about Diabetes?
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#ede3cf] shadow-2xs text-xs font-bold text-gray-700">
                <FaWeight className="text-[#c4633c]" /> Concerned about Increased Weight?
              </div>
            </div>

            {/* We Have An Answer Box */}
            <div className="bg-white p-6 rounded-2xl border border-[#ede3cf] shadow-sm space-y-4">
              <span className="inline-block bg-[#185e33] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                We have an Answer!
              </span>

              <h4 className="text-xl font-serif font-bold text-[#185e33]">
                Julina Candles & Melts Artisanal Candles
              </h4>

              <ul className="space-y-2.5 text-sm font-semibold text-gray-800">
                <li className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-[#185e33] shrink-0" /> Enriched with Zinc for Immunity
                </li>
                <li className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-[#185e33] shrink-0" /> High Dietary Fiber (Aids Weight Loss)
                </li>
                <li className="flex items-center gap-2.5">
                  <FaCheckCircle className="text-[#185e33] shrink-0" /> High Protein (Strengthens Muscle)
                </li>
              </ul>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pack Weights Available:</span>
                <span className="text-xs font-extrabold bg-[#e5c158]/30 text-[#185e33] px-3 py-1 rounded-full border border-[#e5c158]">
                  1 kg • 5 kg • 10 kg • 25 kg
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* ─── Fact Banner ─── */}
        <div className="bg-[#185e33] text-white p-4 sm:p-5 rounded-2xl text-center shadow-md border border-[#e5c158]/30">
          <p className="text-xs sm:text-sm md:text-base font-bold leading-relaxed">
            💡 Did you know? <span className="text-[#e5c158]">Regular White Rice (GI: 70–80)</span> releases more glucose into your bloodstream than table sugar (GI: 65)!
          </p>
        </div>

        {/* ─── Detailed Comparison Table ─── */}
        <div>
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#185e33]">
              Nutritional Comparison Matrix
            </h3>
            <p className="text-xs text-gray-500 mt-1">See how Julina Candles & Melts compares to ordinary market white rice.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-6">
            
            {/* Julina Candles & Melts Column */}
            <div className="bg-white rounded-2xl border-2 border-[#185e33] shadow-md overflow-hidden flex flex-col">
              <div className="bg-[#185e33] text-white p-2.5 sm:p-4 text-center">
                <h4 className="text-xs sm:text-lg font-serif font-bold flex items-center justify-center gap-1 sm:gap-2">
                  <FaShieldAlt className="text-[#e5c158] text-xs sm:text-base" /> <span className="hidden sm:inline">Julina Candles & Melts Artisanal Candles</span><span className="sm:hidden">Julina Candles & Melts</span>
                </h4>
                <span className="text-[9px] sm:text-xs text-[#e5c158] font-bold block">premium (51)</span>
              </div>

              <div className="p-2 sm:p-5 flex-1 space-y-2 sm:space-y-3.5 text-[10px] sm:text-xs font-medium">
                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#faf6ee] p-2 sm:p-3 rounded-xl border border-[#ede3cf]">
                  <FaCheckCircle className="text-[#185e33] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">premium (51)</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">Diabetic Friendly & Prevents Glucose Spikes</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#faf6ee] p-2 sm:p-3 rounded-xl border border-[#ede3cf]">
                  <FaCheckCircle className="text-[#185e33] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">Rich in Zinc</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">Immunity Booster</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#faf6ee] p-2 sm:p-3 rounded-xl border border-[#ede3cf]">
                  <FaCheckCircle className="text-[#185e33] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">Higher Fiber</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">Aids Weight Control</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#faf6ee] p-2 sm:p-3 rounded-xl border border-[#ede3cf]">
                  <FaCheckCircle className="text-[#185e33] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">Rich in Protein</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">Strengthens Muscle</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#faf6ee] p-2 sm:p-3 rounded-xl border border-[#ede3cf]">
                  <FaCheckCircle className="text-[#185e33] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">Rich in Bran</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">Loaded with Anti-Oxidants</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#faf6ee] p-2 sm:p-3 rounded-xl border border-[#ede3cf]">
                  <FaCheckCircle className="text-[#185e33] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">Natural Farming</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">Enriches Soil Integrity</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-[#faf6ee] p-2 sm:p-3 rounded-xl border border-[#ede3cf]">
                  <FaCheckCircle className="text-[#185e33] mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-900 block text-[10px] sm:text-xs font-bold leading-snug">Global US/EU Certified</strong>
                    <span className="text-gray-600 text-[9px] sm:text-xs block leading-tight">Free from Pesticides</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Rice Column */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gray-800 text-white p-2.5 sm:p-4 text-center">
                <h4 className="text-xs sm:text-lg font-serif font-bold text-gray-200">
                  <span className="hidden sm:inline">Regular White Rice</span><span className="sm:hidden">Regular Rice</span>
                </h4>
                <span className="text-[9px] sm:text-xs text-gray-400 block">High GI (70–80)</span>
              </div>

              <div className="p-2 sm:p-5 flex-1 space-y-2 sm:space-y-3.5 text-[10px] sm:text-xs font-medium">
                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">High GI (70–80)</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Causes Blood Sugar Spikes</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">Negligible Zinc</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Immune Deficient</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">Lacks Fiber</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Increases Body Weight</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">Low Protein</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Minimal Muscle Support</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">Bran Stripped Off</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Nutrient Deficient</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">Chemical Farming</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Pesticides Employed</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-150">
                  <FaTimesCircle className="text-red-500 mt-0.5 text-xs sm:text-base shrink-0" />
                  <div>
                    <strong className="text-gray-800 block text-[10px] sm:text-xs font-bold leading-snug">No Quality Testing</strong>
                    <span className="text-gray-500 text-[9px] sm:text-xs block leading-tight">Harmful Residue Risks</span>
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

