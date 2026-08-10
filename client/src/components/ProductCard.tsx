import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementCartItem, decrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { Product } from '../types/api-types';
import { FaShoppingBag, FaStar } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

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

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-3xl p-5 border border-[#E6DACB] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full group relative cursor-pointer overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative bg-[#FBF6ED] rounded-2xl p-4 flex items-center justify-center h-60 md:h-72 mb-4 border border-[#E6DACB]/60 overflow-hidden group-hover:bg-[#F8EFE0] transition-colors">
        {/* Category Badge */}
        <span className="bg-[#5C2333] text-[#FBF6ED] text-[10px] font-bold px-3 py-1 rounded-full absolute top-3 left-3 z-10 shadow-xs uppercase tracking-wider">
          {product.category || 'Soy Wax Candle'}
        </span>

        {/* Rating Badge */}
        <div className="bg-white/80 backdrop-blur-md text-[#C79A56] text-[10px] font-bold px-2.5 py-1 rounded-full absolute top-3 right-3 z-10 shadow-xs flex items-center gap-1 border border-[#E6DACB]">
          <FaStar className="text-xs" />
          <span>4.9</span>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs z-20 flex items-center justify-center rounded-2xl">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded-full border border-red-200 shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        <img
          src={product.photo || '/images/logo.png'}
          alt={product.name}
          className="w-full h-full object-contain p-2 group-hover:scale-108 transition-transform duration-500 drop-shadow-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1">
        <h3 className="text-base md:text-lg font-serif font-bold text-[#2A1C22] text-center mb-1.5 line-clamp-2 group-hover:text-[#5C2333] transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {hasVariants ? (
            <span className="text-xs font-bold text-[#5C2333] bg-[#5C2333]/10 px-3 py-1 rounded-full border border-[#5C2333]/20">
              {priceLabel}
            </span>
          ) : (
            <span className="text-lg md:text-xl font-bold text-[#5C2333] font-serif">
              ₹ {displayPrice}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {!hasVariants && cartItem ? (
            <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between bg-[#FBF6ED] border border-[#E6DACB] rounded-full px-3 py-1.5">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 rounded-full bg-white text-[#5C2333] font-bold flex items-center justify-center hover:bg-[#5C2333] hover:text-white transition-colors shadow-xs text-sm"
                >
                  −
                </button>
                <span className="text-xs font-bold text-[#2A1C22]">{cartItem.quantity} in Cart</span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 rounded-full bg-white text-[#5C2333] font-bold flex items-center justify-center hover:bg-[#5C2333] hover:text-white transition-colors shadow-xs text-sm"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleGoToCart}
                className="w-full bg-[#5C2333] hover:bg-[#3E1622] text-white font-bold text-xs py-3 rounded-full transition-all shadow-md"
              >
                Go to Cart
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full font-bold text-xs py-3 rounded-full transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-[#5C2333] hover:bg-[#3E1622] text-[#FBF6ED] hover:shadow-lg'
              }`}
            >
              <FaShoppingBag className="text-sm text-[#C79A56]" />
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
