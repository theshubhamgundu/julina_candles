import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaMagic } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    id: 1,
    title: 'Exquisite Peacock & Lotus Urli Collection',
    subtitle: 'Handcrafted Decorative Soy Wax Urlis for Festive Living',
    badge: 'FESTIVE COLLECTION',
    src: '/images/peacock pink wax urli.png',
    link: '/products',
  },
  {
    id: 2,
    title: 'Warm Espresso & Caramel Coffee Candles',
    subtitle: 'Infused with Real Roasted Coffee Beans & Cream Notes',
    badge: 'BESTSELLER',
    src: '/images/caramel coffee cream.png',
    link: '/products',
  },
  {
    id: 3,
    title: 'Julina Artisanal Rituals & Gift Sets',
    subtitle: '100% Eco-Friendly Soy Wax • Hand-poured in Maharashtra, India',
    badge: 'LUXURY EXPORT',
    src: '/images/julina candles melts artisanal rituals 1.png',
    link: '/products',
  },
];

const FeaturedSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section className="w-full relative overflow-hidden bg-[#2A1C22] text-white py-12 md:py-20">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C79A56]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5C2333]/40 rounded-full blur-3xl pointer-events-none" />

      <div
        className="max-w-7xl mx-auto px-6 relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C79A56]/20 border border-[#C79A56]/40 text-[#C79A56] text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              <FaMagic className="text-sm" />
              <span>{heroSlides[currentIndex].badge}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#FBF6ED] leading-tight transition-all duration-500">
              {heroSlides[currentIndex].title}
            </h1>

            <p className="text-sm md:text-base text-[#F4EADA]/80 leading-relaxed font-light">
              {heroSlides[currentIndex].subtitle}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="bg-gradient-to-r from-[#C79A56] to-[#D8AC66] hover:from-[#B58744] hover:to-[#C79A56] text-[#2A1C22] font-bold px-8 py-4 rounded-full text-xs md:text-sm tracking-wider uppercase shadow-lg shadow-[#C79A56]/20 hover:shadow-xl hover:shadow-[#C79A56]/30 transition-all transform hover:-translate-y-0.5"
              >
                Explore Collection
              </Link>
              <a
                href="https://wa.me/917304888197"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-[#FBF6ED] border border-white/20 font-bold px-6 py-4 rounded-full text-xs md:text-sm tracking-wider uppercase backdrop-blur-md transition-all"
              >
                Bulk & Wholesale Inquiry
              </a>
            </div>

            {/* Slider Dots & Nav */}
            <div className="flex items-center gap-4 pt-6">
              <div className="flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index ? 'w-8 bg-[#C79A56]' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all"
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image Showcase */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-4 shadow-2xl backdrop-blur-sm group">
              <img
                src={heroSlides[currentIndex].src}
                alt={heroSlides[currentIndex].title}
                className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
