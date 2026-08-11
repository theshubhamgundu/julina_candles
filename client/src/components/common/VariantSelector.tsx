import React from 'react';
import { WeightVariant } from '../../utils/weightVariants';

type Props = {
  variants: WeightVariant[];
  selectedVariantId?: string;
  onSelect: (id: string) => void;
};

const VariantSelector: React.FC<Props> = ({ variants, selectedVariantId, onSelect }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="my-4 bg-[#faf6ee] p-4 rounded-2xl border border-[#ede3cf] space-y-2.5">
      <label className="block text-xs font-bold text-[#5C2333] uppercase tracking-wider">
        Select Pack Quantity / Weight:
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {variants.map((variant) => {
          const isVariantOutOfStock = variant.inStock === false;
          const isSelected = selectedVariantId === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => !isVariantOutOfStock && onSelect(variant.id)}
              disabled={isVariantOutOfStock}
              aria-pressed={isSelected}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 relative ${
                isVariantOutOfStock
                  ? 'border-red-200 bg-red-50/40 cursor-not-allowed opacity-70'
                  : isSelected
                    ? 'border-2 border-[#5C2333] bg-[#5C2333] text-white shadow-md'
                    : 'border-[#ede3cf] bg-white text-gray-800 hover:border-[#5C2333]/50'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className={`text-xs font-bold ${isVariantOutOfStock ? 'text-red-400' : isSelected ? 'text-white/80' : 'text-[#5C2333]'}`}>
                  {variant.label || variant.pack || variant.name}
                </span>

                {isVariantOutOfStock ? (
                  <span className="text-[9px] font-bold text-red-500 mt-1">Out of Stock</span>
                ) : (
                  <>
                    <span className={`text-lg font-extrabold mt-1 ${isSelected ? 'text-white' : 'text-[#5C2333]'}`}>₹{variant.salePrice ?? variant.price ?? 0}</span>
                    {variant.mrp > (variant.salePrice ?? variant.price ?? 0) && (
                      <span className={`text-[10px] line-through ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                        MRP ₹{variant.mrp}
                      </span>
                    )}
                    {variant.bulkPrice && (
                      <span className={`text-[10px] mt-1 block ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        Bulk: ₹{variant.bulkPrice} (MOQ {variant.bulkMOQ ?? '—'})
                      </span>
                    )}
                    {variant.pack && (
                      <span className={`text-[10px] mt-0.5 block ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {variant.pack}
                      </span>
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
