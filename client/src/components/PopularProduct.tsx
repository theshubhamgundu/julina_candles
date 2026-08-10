import React from 'react';
import { Product } from '../types/api-types';
import ProductCard from './ProductCard';

interface PopularProductsProps {
  products: Product[];
}

const PopularProducts: React.FC<PopularProductsProps> = ({ products }) => {
  const isCombo = (p: Product) => p.category?.toLowerCase().includes('combo') || p.name?.toLowerCase().includes('combo');

  // Ensure exactly 2 catalog products: 1 Single Unit & 1 Combo Pack
  const singleUnit = products.find(p => !isCombo(p)) || products[0];
  const comboUnit = products.find(p => isCombo(p));

  const displayProducts: Product[] = [];
  if (singleUnit) displayProducts.push(singleUnit);
  if (comboUnit) displayProducts.push(comboUnit);

  return (
    <section className="py-16 md:py-20 bg-[#f6f1e7]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs font-sans font-semibold text-secondary uppercase tracking-[0.2em] mb-2">
            Clinically Formulated
          </p>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary">
            Our premium Products
          </h2>
        </div>

        {/* Product grid - 2 Centered Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {displayProducts.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;

