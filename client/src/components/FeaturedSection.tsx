import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    id: 1,
    src: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786390164/julina_candles/banners/rs6rik4jqjtcuui39pml.png',
    link: '/products',
  },
  {
    id: 2,
    src: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786390168/julina_candles/banners/nsfdae32uf5wreongyhi.png',
    link: '/products',
  },
  {
    id: 3,
    src: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786390175/julina_candles/banners/x8cnldatj2wep0hloffn.png',
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
    <section className="w-full relative overflow-hidden bg-[#2A1C22]">
      <div
        className="w-full relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={heroSlides[currentIndex].link} className="block w-full overflow-hidden">
          <img
            src={heroSlides[currentIndex].src}
            alt={`Julina Banner ${currentIndex + 1}`}
            className="w-full h-auto object-contain max-h-[75vh] mx-auto block transition-all duration-700 ease-in-out"
          />
        </Link>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10"
          aria-label="Previous Slide"
        >
          <FaChevronLeft className="text-lg" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10"
          aria-label="Next Slide"
        >
          <FaChevronRight className="text-lg" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                currentIndex === index
                  ? 'w-8 bg-[#C79A56]'
                  : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
