import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useApplyCouponMutation } from '../redux/api/coupon.api';
import { calculatePrice, decrementCartItem, discountApplied, incrementCartItem, removeCartItem, resetCart } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { notify } from '../utils/util';
import { usePageSEO } from '../hooks/usePageSEO';

const Cart: React.FC = () => {
  usePageSEO({
    title: 'Shopping Cart | Julina Candles & Melts',
    description: 'View your shopping cart and selected Artisanal Candles products.',
    canonical: '/cart',
    noIndex: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, subTotal, total, discount } = useSelector((state: RootState) => state.cart);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch, discount]);

  const handleIncrement = (productId: string) => {
    dispatch(incrementCartItem(productId));
  };

  const handleDecrement = (productId: string) => {
    dispatch(decrementCartItem(productId));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  const handleClearCart = () => {
    dispatch(resetCart());
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const response = await applyCoupon({ code: couponCode }).unwrap();
      dispatch(discountApplied(response.coupon.amount));
      setAppliedCoupon(couponCode);
      setCouponCode('');
      notify('Coupon applied successfully!', 'success');
    } catch (error) {
      notify('Invalid coupon code', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(discountApplied(0));
    setAppliedCoupon('');
    notify('Coupon removed', 'info');
  };

  const getPhotoUrl = (photoUrl?: string) => {
    if (!photoUrl) return 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389852/julina_candles/products/logo.png';
    let cleaned = photoUrl.replace('/images/products/', '/images/');
    if (!cleaned.startsWith('/') && !cleaned.startsWith('http')) {
      cleaned = '/' + cleaned;
    }
    return encodeURI(cleaned);
  };

  return (
    <div className="min-h-screen bg-[#FBF6ED] py-6 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <BackButton fallback="/products" />

        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-[#E6DACB]">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#5C2333] mb-6">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <p className="text-5xl">🕯️</p>
              <h2 className="text-xl font-serif font-bold text-[#2A1C22]">Your cart is currently empty</h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto font-light">
                Looks like you haven't added any handcrafted candles to your cart yet.
              </p>
              <Link
                to="/products"
                className="inline-block bg-[#5C2333] hover:bg-[#3E1622] text-[#FBF6ED] font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-colors shadow-md mt-2"
              >
                Browse All Products ➔
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Mobile Cards (Visible below md) */}
                <div className="md:hidden space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="bg-[#FBF6ED] p-4 rounded-2xl border border-[#E6DACB] flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                          <img
                            src={getPhotoUrl(item.photo)}
                            alt={item.name}
                            className="h-16 w-16 object-contain rounded-xl bg-white p-1 border border-[#E6DACB]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389852/julina_candles/products/logo.png';
                            }}
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.productId}`}>
                            <h3 className="font-bold text-sm text-[#5C2333] truncate">{item.name}</h3>
                          </Link>
                          <p className="text-xs text-gray-500">₹ {item.price.toFixed(2)} per unit</p>
                          <p className="text-xs font-bold text-gray-900 mt-0.5">Subtotal: ₹ {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-red-500 hover:text-red-700 p-1 text-xs font-bold"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E6DACB]/60">
                        <span className="text-xs text-gray-500 font-medium">Quantity:</span>
                        <div className="flex items-center gap-2 bg-white border border-[#E6DACB] rounded-full px-3 py-1">
                          <button
                            onClick={() => handleDecrement(item.productId)}
                            className="w-6 h-6 rounded-full bg-gray-100 text-[#5C2333] font-bold text-xs flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrement(item.productId)}
                            className="w-6 h-6 rounded-full bg-gray-100 text-[#5C2333] font-bold text-xs flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table (Hidden below md) */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#E6DACB]">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FBF6ED]">
                      <tr className="border-b border-[#E6DACB] text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="p-4">Product</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Subtotal</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DACB]">
                      {cartItems.map((item) => (
                        <tr className="hover:bg-[#FBF6ED]/50 transition-colors" key={item.productId}>
                          <td className="p-4">
                            <Link to={`/product/${item.productId}`} className="flex items-center space-x-3 group">
                              <img
                                src={getPhotoUrl(item.photo)}
                                alt={item.name}
                                className="h-14 w-14 object-contain rounded-xl bg-[#FBF6ED] p-1 border border-[#E6DACB]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389852/julina_candles/products/logo.png';
                                }}
                              />
                              <span className="font-bold text-sm text-[#5C2333] group-hover:underline">{item.name}</span>
                            </Link>
                          </td>
                          <td className="p-4 text-sm font-medium text-gray-700">₹ {item.price.toFixed(2)}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full px-2 py-1 w-max">
                              <button
                                onClick={() => handleDecrement(item.productId)}
                                className="w-6 h-6 rounded-full bg-white text-[#5C2333] font-bold text-xs flex items-center justify-center shadow-2xs hover:bg-gray-100"
                              >
                                −
                              </button>
                              <span className="text-xs font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleIncrement(item.productId)}
                                className="w-6 h-6 rounded-full bg-white text-[#5C2333] font-bold text-xs flex items-center justify-center shadow-2xs hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-bold text-[#5C2333]">₹ {(item.price * item.quantity).toFixed(2)}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleRemove(item.productId)}
                              className="text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                  <Link
                    to="/products"
                    className="w-full sm:w-auto text-center border border-[#5C2333] text-[#5C2333] font-bold px-5 py-2.5 rounded-full text-xs hover:bg-[#5C2333] hover:text-white transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={handleClearCart}
                    className="w-full sm:w-auto text-center text-red-500 hover:text-red-700 font-semibold text-xs py-2 px-4 underline"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Right Column - Cart Summary */}
              <div className="bg-[#FBF6ED] p-5 sm:p-6 rounded-2xl border border-[#E6DACB] shadow-sm space-y-4">
                <h2 className="font-serif font-bold text-lg text-[#5C2333] pb-3 border-b border-[#E6DACB]">Order Summary</h2>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹ {subTotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#5C2333] font-semibold">
                      <span>Discount Coupon</span>
                      <span>-₹ {discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Charges</span>
                    <span className="text-emerald-700 font-semibold">Calculated at Checkout</span>
                  </div>

                  <div className="pt-3 border-t border-[#E6DACB] flex justify-between items-baseline font-bold text-base text-[#5C2333]">
                    <span>Total Amount</span>
                    <span className="text-xl sm:text-2xl font-extrabold">₹ {(total - discount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Have a Coupon?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="flex-grow px-3 py-2 rounded-xl border border-[#E6DACB] text-xs uppercase font-mono focus:outline-none focus:border-[#5C2333]"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={handleRemoveCoupon}
                        className="bg-red-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                        className="bg-[#C79A56] text-[#2A1C22] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#B58744] transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={() => navigate('/shipping')}
                  className="w-full bg-[#5C2333] hover:bg-[#3E1622] text-[#FBF6ED] font-bold py-3.5 px-4 rounded-full text-sm transition-colors shadow-md text-center block mt-4"
                >
                  Proceed to Checkout ➔
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
