import React from 'react';
import { useNavigate } from 'react-router-dom';

const categoryTiles = [
  {
    title: 'Festive Urli Candles',
    subtitle: 'Transform any space with our traditional hand-poured urlis. From peacock to lotus motifs, illuminate every celebration.',
    img: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389862/julina_candles/products/peacock_pink_wax_urli.png',
    link: '/search?category=Festive%20Urli%20Candles',
    colSpan: 'lg:col-span-4 h-[480px]',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Delve into our exquisite candle creations and illuminate your home with warm luxury.',
    img: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389855/julina_candles/products/lotus_pond_urli.png',
    link: '/products',
    colSpan: 'lg:col-span-4 h-[230px]',
  },
  {
    title: 'Fragrance Collection',
    subtitle: 'Infuse any space with our captivating coffee & floral candle fragrances creating an inviting ambiance.',
    img: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389834/julina_candles/products/caramel_coffee_cream.png',
    link: '/search?category=Fragrances',
    colSpan: 'lg:col-span-4 h-[480px]',
  },
  {
    title: 'Artisanal Collection',
    subtitle: 'Elegant, Fragrant, and Atmosphere-Enhancing Soy Wax Candles for Every Occasion.',
    img: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389859/julina_candles/products/modak_shaped_scented.png',
    link: '/products',
    colSpan: 'lg:col-span-4 h-[230px]',
  },
];

const ProductCategories: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-14 bg-[#FBF6ED]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#5C2333]">
            Featured Collections & Categories
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light mt-1.5 max-w-lg mx-auto">
            Discover our hand-poured soy wax collections crafted to complement your home ambiance.
          </p>
        </div>

        {/* Bento Grid Layout (Banners with Centered Overlay Text & Shop Now Button) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Tall Card) */}
          <div
            onClick={() => navigate(categoryTiles[0].link)}
            className="lg:col-span-4 h-[460px] sm:h-[500px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg border border-[#E6DACB]"
          >
            <img
              src={categoryTiles[0].img}
              alt={categoryTiles[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/55 transition-colors" />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center text-white z-10 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-snug">
                {categoryTiles[0].title}
              </h3>
              <p className="text-xs text-white/85 max-w-xs font-light leading-relaxed">
                {categoryTiles[0].subtitle}
              </p>
              <button className="bg-white hover:bg-[#5C2333] hover:text-white text-[#2A1C22] font-bold px-6 py-2.5 rounded-full text-xs transition-colors shadow-md uppercase tracking-wider">
                Shop Now
              </button>
            </div>
          </div>

          {/* Middle Column (Two Stacked Cards) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div
              onClick={() => navigate(categoryTiles[1].link)}
              className="h-[220px] sm:h-[238px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg border border-[#E6DACB]"
            >
              <img
                src={categoryTiles[1].img}
                alt={categoryTiles[1].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/55 transition-colors" />

              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center text-white z-10 space-y-2">
                <h3 className="text-xl sm:text-2xl font-serif font-bold">
                  {categoryTiles[1].title}
                </h3>
                <p className="text-xs text-white/85 max-w-xs font-light leading-snug line-clamp-2">
                  {categoryTiles[1].subtitle}
                </p>
                <button className="bg-[#1f5133] hover:bg-[#163b26] text-white font-bold px-5 py-2 rounded-full text-xs transition-colors shadow-md uppercase tracking-wider mt-1">
                  Shop Now
                </button>
              </div>
            </div>

            <div
              onClick={() => navigate(categoryTiles[3].link)}
              className="h-[220px] sm:h-[238px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg border border-[#E6DACB]"
            >
              <img
                src={categoryTiles[3].img}
                alt={categoryTiles[3].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/55 transition-colors" />

              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center text-white z-10 space-y-2">
                <h3 className="text-xl sm:text-2xl font-serif font-bold">
                  {categoryTiles[3].title}
                </h3>
                <p className="text-xs text-white/85 max-w-xs font-light leading-snug line-clamp-2">
                  {categoryTiles[3].subtitle}
                </p>
                <button className="bg-white hover:bg-[#5C2333] hover:text-white text-[#2A1C22] font-bold px-5 py-2 rounded-full text-xs transition-colors shadow-md uppercase tracking-wider mt-1">
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Tall Card) */}
          <div
            onClick={() => navigate(categoryTiles[2].link)}
            className="lg:col-span-4 h-[460px] sm:h-[500px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg border border-[#E6DACB]"
          >
            <img
              src={categoryTiles[2].img}
              alt={categoryTiles[2].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/55 transition-colors" />

            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center text-white z-10 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-snug">
                {categoryTiles[2].title}
              </h3>
              <p className="text-xs text-white/85 max-w-xs font-light leading-relaxed">
                {categoryTiles[2].subtitle}
              </p>
              <button className="bg-white hover:bg-[#5C2333] hover:text-white text-[#2A1C22] font-bold px-6 py-2.5 rounded-full text-xs transition-colors shadow-md uppercase tracking-wider">
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
