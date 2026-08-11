import React from 'react';
import { useNavigate } from 'react-router-dom';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimize';

const categoryTiles = [
  {
    title: 'Festive Urli Candles',
    subtitle: 'Traditional hand-poured peacock & lotus urlis.',
    img: optimizeCloudinaryUrl('https://res.cloudinary.com/bzykgznp/image/upload/v1786389862/julina_candles/products/peacock_pink_wax_urli.png', 800),
    link: '/products?category=Festive%20Urli%20Candles',
    btnBg: 'bg-white text-[#2A1C22]',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Exquisite lotus pond & scented jar creations.',
    img: optimizeCloudinaryUrl('https://res.cloudinary.com/bzykgznp/image/upload/v1786389855/julina_candles/products/lotus_pond_urli.png', 600),
    link: '/products',
    btnBg: 'bg-[#1f5133] text-white',
  },
  {
    title: 'Fragrance Collection',
    subtitle: 'Captivating coffee & floral candle aromatics.',
    img: optimizeCloudinaryUrl('https://res.cloudinary.com/bzykgznp/image/upload/v1786389834/julina_candles/products/caramel_coffee_cream.png', 800),
    link: '/products?category=Fragrances',
    btnBg: 'bg-white text-[#2A1C22]',
  },
  {
    title: 'Artisanal Collection',
    subtitle: 'Atmosphere-enhancing modak & dessert wax candles.',
    img: optimizeCloudinaryUrl('https://res.cloudinary.com/bzykgznp/image/upload/v1786389859/julina_candles/products/modak_shaped_scented.png', 600),
    link: '/products',
    btnBg: 'bg-white text-[#2A1C22]',
  },
];

const ProductCategories: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-16 bg-[#FBF6ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#C79A56] uppercase tracking-[0.2em] block mb-1.5">
            ARTISANAL HAND-POURED CREATIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#5C2333]">
            Featured Collections & Categories
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light mt-1 max-w-lg mx-auto">
            Discover our hand-poured soy wax collections crafted to complement your home ambiance.
          </p>
        </div>

        {/* Mobile: 2x2 grid | Desktop: Bento (tall-left, stacked-middle, tall-right) */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-6">
          
          {/* 1. Festive Urli (Mobile: Top Left | Desktop: Left Column) */}
          <div
            onClick={() => navigate(categoryTiles[0].link)}
            className="col-span-1 lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:row-span-2 h-56 sm:h-72 lg:h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden relative group cursor-pointer shadow-md border border-[#E6DACB]"
          >
            <img
              src={categoryTiles[0].img}
              alt={categoryTiles[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-5 lg:p-8 text-center text-white z-10">
              <h3 className="text-sm sm:text-lg lg:text-3xl font-serif font-bold leading-tight">
                {categoryTiles[0].title}
              </h3>
              <p className="hidden lg:block text-xs text-white/85 max-w-xs font-light leading-relaxed mt-2">
                {categoryTiles[0].subtitle}
              </p>
              <button className={`${categoryTiles[0].btnBg} font-bold px-3 py-1 sm:px-5 sm:py-1.5 lg:px-6 lg:py-2 rounded-full text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider shadow-sm mt-2`}>
                Shop Now
              </button>
            </div>
          </div>

          {/* 2. New Arrivals (Mobile: Top Right | Desktop: Middle Column Top) */}
          <div
            onClick={() => navigate(categoryTiles[1].link)}
            className="col-span-1 lg:col-start-5 lg:col-span-4 lg:row-start-1 lg:row-span-1 h-56 sm:h-72 lg:h-[238px] rounded-2xl lg:rounded-3xl overflow-hidden relative group cursor-pointer shadow-md border border-[#E6DACB]"
          >
            <img
              src={categoryTiles[1].img}
              alt={categoryTiles[1].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-5 lg:p-6 text-center text-white z-10">
              <h3 className="text-sm sm:text-lg lg:text-2xl font-serif font-bold leading-tight">
                {categoryTiles[1].title}
              </h3>
              <p className="hidden lg:block text-xs text-white/85 max-w-xs font-light leading-snug mt-1.5 line-clamp-2">
                {categoryTiles[1].subtitle}
              </p>
              <button className={`${categoryTiles[1].btnBg} font-bold px-3 py-1 sm:px-5 sm:py-1.5 lg:px-5 lg:py-2 rounded-full text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider shadow-sm mt-2`}>
                Shop Now
              </button>
            </div>
          </div>

          {/* 3. Artisanal Collection (Mobile: Bottom Left | Desktop: Middle Column Bottom) */}
          <div
            onClick={() => navigate(categoryTiles[3].link)}
            className="col-span-1 lg:col-start-5 lg:col-span-4 lg:row-start-2 lg:row-span-1 h-56 sm:h-72 lg:h-[238px] rounded-2xl lg:rounded-3xl overflow-hidden relative group cursor-pointer shadow-md border border-[#E6DACB]"
          >
            <img
              src={categoryTiles[3].img}
              alt={categoryTiles[3].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-5 lg:p-6 text-center text-white z-10">
              <h3 className="text-sm sm:text-lg lg:text-2xl font-serif font-bold leading-tight">
                {categoryTiles[3].title}
              </h3>
              <p className="hidden lg:block text-xs text-white/85 max-w-xs font-light leading-snug mt-1.5 line-clamp-2">
                {categoryTiles[3].subtitle}
              </p>
              <button className={`${categoryTiles[3].btnBg} font-bold px-3 py-1 sm:px-5 sm:py-1.5 lg:px-5 lg:py-2 rounded-full text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider shadow-sm mt-2`}>
                Shop Now
              </button>
            </div>
          </div>

          {/* 4. Fragrance Collection (Mobile: Bottom Right | Desktop: Right Column) */}
          <div
            onClick={() => navigate(categoryTiles[2].link)}
            className="col-span-1 lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-2 h-56 sm:h-72 lg:h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden relative group cursor-pointer shadow-md border border-[#E6DACB]"
          >
            <img
              src={categoryTiles[2].img}
              alt={categoryTiles[2].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-5 lg:p-8 text-center text-white z-10">
              <h3 className="text-sm sm:text-lg lg:text-3xl font-serif font-bold leading-tight">
                {categoryTiles[2].title}
              </h3>
              <p className="hidden lg:block text-xs text-white/85 max-w-xs font-light leading-relaxed mt-2">
                {categoryTiles[2].subtitle}
              </p>
              <button className={`${categoryTiles[2].btnBg} font-bold px-3 py-1 sm:px-5 sm:py-1.5 lg:px-6 lg:py-2 rounded-full text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider shadow-sm mt-2`}>
                Shop Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
