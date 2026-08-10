import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const heroSlides = [
    { id: 1, src: '/images/hero_slide1.jpg', alt: 'Julina Candles & Melts Banner 1' },
    { id: 2, src: '/images/hero_slide2.jpg', alt: 'Julina Candles & Melts Banner 2' },
    { id: 3, src: '/images/hero_slide3.jpg', alt: 'Julina Candles & Melts Banner 3' },
];

const FeaturedSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [isHovered]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    };

    return (
        <section className="w-full relative overflow-hidden bg-[#f6f1e7]">
            {/* ─── DESKTOP VIEW (UNTOUCHED) ─── */}
            <div
                className="hidden md:block w-full relative overflow-hidden bg-cream leading-none group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative w-full overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-in-out w-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {heroSlides.map((slide) => (
                            <div key={slide.id} className="w-full flex-shrink-0">
                                <img
                                    src={slide.src}
                                    alt={slide.alt}
                                    className="w-full h-auto object-cover block"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                    <FaChevronLeft className="text-base" />
                </button>

                <button
                    onClick={nextSlide}
                    aria-label="Next Slide"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                    <FaChevronRight className="text-base" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                currentIndex === index ? 'w-8 bg-[#e5c158]' : 'w-2.5 bg-white/60 hover:bg-white'
                            }`}
                        />
                    ))}
                </div>

                {/* ─── Floating Explore Products CTA ─── */}
                <div className="absolute bottom-8 right-8 z-20">
                    <Link
                        to="/products"
                        className="bg-[#185e33] hover:bg-[#134b28] text-white px-6 py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:shadow-2xl border-2 border-[#e5c158] transition-all transform hover:-translate-y-1 flex items-center gap-2 group animate-pulse"
                    >
                        <span>Click here to explore our products</span>
                        <span className="text-[#e5c158] text-base group-hover:translate-x-1.5 transition-transform duration-200">➔</span>
                    </Link>
                </div>
            </div>

            {/* ─── MOBILE VIEW (NEXT-LEVEL REDESIGN) ─── */}
            <div className="block md:hidden w-full bg-[#f6f1e7]">
                {/* Mobile Slider Container — natural image height, no crop */}
                <div className="relative w-full overflow-hidden bg-[#185e33]">
                    <div
                        className="flex transition-transform duration-500 ease-out w-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {heroSlides.map((slide) => (
                            <div key={slide.id} className="w-full flex-shrink-0">
                                <img
                                    src={slide.src}
                                    alt={slide.alt}
                                    className="w-full h-auto block"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Mobile Slide Indicator Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    currentIndex === index ? 'w-6 bg-[#e5c158]' : 'w-2 bg-white/70'
                                }`}
                            />
                        ))}
                    </div>
                </div>


            </div>
        </section>
    );
};

export default FeaturedSection;

