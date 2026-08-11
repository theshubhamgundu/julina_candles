import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementCartItem, decrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { Product } from '../types/api-types';
import { FaShoppingBag } from 'react-icons/fa';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimize';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  let displayPrice = product.price;
  let priceLabel = '';

  if (hasVariants) {
    const prices = product.variants.map((v: any) => v.salePrice || v.price || 0).filter((p: number) => p > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      displayPrice = minPrice;
      priceLabel = minPrice !== maxPrice ? `₹${minPrice} – ₹${maxPrice}` : `₹${minPrice}`;
    }
  }

  const isOutOfStock = product.stock <= 0;
  const cartItem = cartItems.find(item => item.productId === product._id);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isOutOfStock) return;

    if (hasVariants) {
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

  const getPhotoUrl = (photoUrl?: string) => {
    if (!photoUrl) return optimizeCloudinaryUrl('https://res.cloudinary.com/bzykgznp/image/upload/v1786389852/julina_candles/products/logo.png', 400);
    let cleaned = photoUrl.replace('/images/products/', '/images/');
    if (!cleaned.startsWith('/') && !cleaned.startsWith('http')) {
      cleaned = '/' + cleaned;
    }
    return optimizeCloudinaryUrl(encodeURI(cleaned), 400);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-2xl p-2.5 sm:p-4 border border-[#E6DACB] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group relative cursor-pointer overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative bg-[#FBF6ED] rounded-xl flex items-center justify-center aspect-square mb-2.5 border border-[#E6DACB]/60 overflow-hidden group-hover:bg-[#F8EFE0] transition-colors">
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs z-20 flex items-center justify-center rounded-xl">
            <span className="bg-red-100 text-red-700 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-red-200 shadow-xs">
              Out of Stock
            </span>
          </div>
        )}

        <img
          src={getPhotoUrl(product.photo)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1">
        <h3 className="text-xs sm:text-base font-serif font-bold text-[#2A1C22] text-center mb-1 line-clamp-2 group-hover:text-[#5C2333] transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Price Row (hidden on homepage) */}
        {!isHomePage && (
          <div className="flex items-center justify-center gap-1.5 mb-2.5">
            {hasVariants ? (
              <span className="text-[10px] sm:text-xs font-bold text-[#5C2333] bg-[#5C2333]/10 px-2 py-0.5 rounded-full border border-[#5C2333]/20">
                {priceLabel}
              </span>
            ) : (
              <span className="text-sm sm:text-lg font-bold text-[#5C2333] font-serif">
                ₹ {displayPrice}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto">
          {!hasVariants && cartItem ? (
            <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between bg-[#FBF6ED] border border-[#E6DACB] rounded-full px-2 py-1">
                <button
                  onClick={handleDecrement}
                  className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white text-[#5C2333] font-bold flex items-center justify-center hover:bg-[#5C2333] hover:text-white transition-colors shadow-xs text-xs"
                >
                  −
                </button>
                <span className="text-[10px] sm:text-xs font-bold text-[#2A1C22]">{cartItem.quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white text-[#5C2333] font-bold flex items-center justify-center hover:bg-[#5C2333] hover:text-white transition-colors shadow-xs text-xs"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleGoToCart}
                className="w-full bg-[#5C2333] hover:bg-[#3E1622] text-white font-bold text-[10px] sm:text-xs py-2 rounded-full transition-all shadow-md"
              >
                Go to Cart
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full font-bold text-[10px] sm:text-xs py-2 sm:py-2.5 rounded-full transition-all shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wider ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-[#5C2333] hover:bg-[#3E1622] text-[#FBF6ED] hover:shadow-lg'
              }`}
            >
              <FaShoppingBag className="text-xs text-[#C79A56]" />
              <span>
                {isOutOfStock
                  ? 'Out of Stock'
                  : hasVariants
                    ? 'Select Options'
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
