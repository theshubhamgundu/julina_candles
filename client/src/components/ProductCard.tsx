import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementCartItem, decrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { Product } from '../types/api-types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  // Prices come directly from DB — no hardcoded values
  let displayPrice = product.price;
  let originalPrice = product.price;
  let priceLabel = '';

  if (hasVariants) {
    const prices = product.variants.map((v: any) => v.salePrice || v.price || 0).filter((p: number) => p > 0);
    const mrps = product.variants.map((v: any) => v.mrp || v.salePrice || v.price || 0).filter((p: number) => p > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      displayPrice = minPrice;
      originalPrice = mrps.length > 0 ? Math.max(...mrps) : maxPrice;
      priceLabel = minPrice !== maxPrice ? `₹${minPrice} – ₹${maxPrice}` : `₹${minPrice}`;
    }
  }

  const discountPercent = originalPrice > displayPrice
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  // Stock from DB
  const isOutOfStock = product.stock <= 0;

  const cartItem = cartItems.find(item => item.productId === product._id);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isOutOfStock) return;

    if (hasVariants) {
      // Redirect to product page to select variant
      navigate(`/product/${product._id}`);
      return;
    }

    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: displayPrice,
      quantity: 1,
      stock: product.stock,
      photo: product.photo,
    }));
  };

  const handleIncrement = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(incrementCartItem(product._id));
  };

  const handleDecrement = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(decrementCartItem(product._id));
  };

  const handleGoToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate('/cart');
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-[#185e33]/15 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group relative cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative bg-[#faf6ee] rounded-2xl p-4 flex items-center justify-center h-56 sm:h-72 md:h-80 mb-4 border border-[#ede3cf] overflow-hidden">
        {/* Discount / Variant Badge */}
        {hasVariants ? (
          <span className="bg-[#185e33] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full absolute top-2.5 left-2.5 z-10 shadow-xs">
            {product.variants!.length} Weight Options
          </span>
        ) : discountPercent > 0 ? (
          <span className="bg-[#e5c158] text-[#144f2b] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full absolute top-2.5 left-2.5 z-10 shadow-xs">
            {discountPercent}% OFF
          </span>
        ) : null}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-2xl">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded-full border border-red-200">
              Out of Stock
            </span>
          </div>
        )}

        <img
          src={product.photo || '/images/mainImage.png'}
          alt={product.name}
          className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 px-0.5">
        <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-[#185e33] text-center mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Category Badge */}
        <div className="text-center mb-2">
          <span className="inline-block bg-[#185e33]/10 text-[#185e33] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full capitalize">
            {product.category}
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-center gap-2 mb-3 min-h-[32px]">
          {hasVariants ? (
            <span className="text-xs sm:text-sm font-bold text-[#185e33] bg-[#185e33]/10 px-3 py-1 rounded-full border border-[#185e33]/20">
              {priceLabel}
            </span>
          ) : (
            <>
              <span className="text-base sm:text-lg md:text-xl font-bold text-ink">₹ {displayPrice}</span>
              {discountPercent > 0 && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">₹ {originalPrice}</span>
              )}
            </>
          )}
        </div>

        {/* Stock indicator for low stock */}
        {!isOutOfStock && product.stock <= 10 && product.stock > 0 && (
          <div className="text-center mb-2">
            <span className="text-[10px] font-bold text-red-600">
              Only {product.stock} left!
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto">
          {!hasVariants && cartItem ? (
            <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between bg-white border border-[#185e33]/30 rounded-full px-3 py-1 sm:py-1.5">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 text-[#185e33] font-bold flex items-center justify-center hover:bg-gray-200 text-sm"
                >
                  −
                </button>
                <span className="text-xs sm:text-sm font-bold text-ink">{cartItem.quantity} in Cart</span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 text-[#185e33] font-bold flex items-center justify-center hover:bg-gray-200 text-sm"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleGoToCart}
                className="w-full bg-[#185e33] hover:bg-[#134b28] text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 rounded-full transition-colors shadow-xs"
              >
                Go to Cart
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full font-bold text-xs sm:text-sm py-2.5 sm:py-3 rounded-full transition-colors shadow-xs flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#185e33] hover:bg-[#134b28] text-white'
              }`}
            >
              <span>
                {isOutOfStock
                  ? 'Out of Stock'
                  : hasVariants
                    ? 'Select Options ➔'
                    : 'Add to Cart'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
