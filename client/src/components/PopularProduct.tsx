import React from 'react';
import { Product } from '../types/api-types';
import ProductCard from './ProductCard';

interface PopularProductsProps {
  products: Product[];
}

const PopularProducts: React.FC<PopularProductsProps> = ({ products }) => {
  // Take up to 6 active products to display in a grid
  const activeProducts = (products || []).filter(p => p.isActive !== false);
  const displayProducts = activeProducts.length > 0 ? activeProducts.slice(0, 6) : [];

  return (
    <section className="py-16 md:py-24 bg-[#FBF6ED]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#C79A56] uppercase tracking-[0.2em] block mb-2">
            ARTISANAL HAND-POURED CREATIONS
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#2A1C22]">
            Popular Candle & Urli Collections
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-3 font-light leading-relaxed">
            Discover our bestselling 100% soy wax candles, coffee aromatics, lotus pond urlis, and festive gift boxes.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {displayProducts.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
