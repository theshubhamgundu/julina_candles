import React, { useRef } from 'react';
import { Product } from '../types/api-types';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
}

const FeaturedVariants: React.FC<Props> = ({ products }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const candidates = (products || []).filter(p => p.isActive !== false && ((Array.isArray(p.variants) && p.variants.length > 1) || p.featured));
  const display = candidates.slice(0, 8);

  if (display.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#FBF6ED]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#C79A56] uppercase tracking-[0.2em] block mb-2">
            DESIGN SPOTLIGHT
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#2A1C22]">
            Featured Designs & Multi-Variant Collections
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-3 font-light leading-relaxed">
            Handpicked pieces with multiple size/pack options and standout designs.
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div />
            <div className="hidden sm:flex gap-3">
              <button
                aria-label="Previous"
                onClick={() => {
                  const el = (containerRef.current as HTMLDivElement | null);
                  if (!el) return;
                  el.scrollBy({ left: -Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
                }}
                className="w-10 h-10 rounded-full bg-white border border-[#E6DACB] shadow-sm flex items-center justify-center text-[#5C2333] hover:bg-[#FBF6ED]"
              >
                ‹
              </button>
              <button
                aria-label="Next"
                onClick={() => {
                  const el = (containerRef.current as HTMLDivElement | null);
                  if (!el) return;
                  el.scrollBy({ left: Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
                }}
                className="w-10 h-10 rounded-full bg-white border border-[#E6DACB] shadow-sm flex items-center justify-center text-[#5C2333] hover:bg-[#FBF6ED]"
              >
                ›
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className="overflow-x-hidden whitespace-no-wrap scroll-smooth -mx-4 px-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex gap-6">
              {display.map(product => (
                <div key={product._id} className="flex-shrink-0 w-[320px] sm:w-[380px] lg:w-[420px] h-[520px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVariants;
