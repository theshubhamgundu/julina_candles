import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BackButton from '../components/common/BackBtn';
import { useNewOrderMutation } from '../redux/api/order.api';
import { useCreatePaymentIntentMutation } from '../redux/api/payment.api';
import { resetCart } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { NewOrderRequest } from '../types/api-types';
import { notify } from '../utils/util';
import { usePageSEO } from '../hooks/usePageSEO';

const CheckoutForm: React.FC = () => {
  usePageSEO({
    title: 'Checkout | Julina Candles & Melts',
    description: 'Complete your checkout securely on Julina Candles & Melts.',
    canonical: '/checkout',
    noIndex: true,
  });

  const dispatch = useDispatch();

  const {
    shippingInfo,
    cartItems,
    subTotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cart);

  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [newOrder] = useNewOrderMutation();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const merchantTxnNo = ('VH' + Date.now()).slice(0, 20);

    // Use a guest user ID based on the phone number for order tracking
    const guestUserId = 'guest_' + (shippingInfo.phone || Date.now());

    const orderData: NewOrderRequest = {
      shippingCharges,
      shippingInfo: {
        ...shippingInfo,
        merchantTxnNo,
        clientOrigin: window.location.origin,
      } as any,
      tax,
      discount,
      total,
      subTotal,
      orderItems: cartItems,
      userId: guestUserId,
    };

    try {
      // Save order to DB first
      const orderRes: any = await newOrder(orderData).unwrap();

      if (orderRes && orderRes.success && orderRes.order) {
        // Call Initiate Sale API with orderId and customer details
        const res: any = await createPaymentIntent({
          amount: total,
          email: shippingInfo.email || undefined,
          phone: shippingInfo.phone,
          name: shippingInfo.name || undefined,
          orderId: orderRes.order.id || orderRes.order._id,
          merchantTxnNo,
        }).unwrap();

        if (res && res.paymentURL) {
          // Save guestUserId to localStorage so MyOrders can retrieve orders
          localStorage.setItem('guestUserId', guestUserId);
          dispatch(resetCart());

          notify('Redirecting to secure payment portal...', 'info');

          // Direct Browser Redirect to Gateway URL
          setTimeout(() => {
            window.location.href = res.paymentURL;
          }, 800);
        } else {
          notify('Failed to connect to payment gateway. Please try again.', 'error');
          setIsProcessing(false);
        }
      } else {
        notify('Failed to create order. Please try again.', 'error');
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.data?.message || error?.message || 'Order creation or payment gateway connection error';
      notify(errMsg, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1e7] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-xl mb-4">
        <BackButton fallback="/products" />
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-[#ede3cf] max-w-xl w-full">
        {/* Merchant Branding Header */}
        <div className="flex flex-col items-center mb-6 text-center border-b border-gray-100 pb-5">
          <img src="/images/logo.png" alt="Julina Candles & Melts" className="h-12 w-auto mb-2" />
          <h1 className="text-xl font-bold text-ink">Julina Candles & Melts</h1>
          <p className="text-xs text-gray-500 mt-0.5">Order Checkout & Payment</p>
        </div>

        {/* Customer Info Summary */}
        <div className="bg-[#f7f4ec]/60 p-4 rounded-xl mb-4 border border-[#ede3cf] text-sm">
          <p className="font-semibold text-[#185e33] mb-1">Shipping Details:</p>
          <p className="text-gray-700 font-medium">{shippingInfo.name}</p>
          <p className="text-gray-500 text-xs">{shippingInfo.email} • {shippingInfo.phone}</p>
          <p className="text-gray-600 text-xs mt-1">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pinCode}</p>
          {shippingInfo.landmark && (
            <p className="text-xs text-[#c4633c] font-semibold mt-1">📍 Landmark: {shippingInfo.landmark}</p>
          )}
          {shippingInfo.latitude && shippingInfo.longitude && (
            <p className="text-[11px] text-gray-500 font-mono mt-0.5">GPS Pin: {shippingInfo.latitude.toFixed(4)}, {shippingInfo.longitude.toFixed(4)}</p>
          )}
        </div>

        {/* Order Amount Summary Box */}
        <div className="bg-[#faf6ee] p-5 rounded-xl mb-6 border border-[#ede3cf]">
          <div className="flex justify-between items-center text-sm font-bold text-ink mb-1">
            <span>Total Amount Payable</span>
            <span className="text-2xl font-extrabold text-[#185e33]">₹ {total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500">Includes all taxes, packing & express shipping</p>
        </div>

        {/* Informational Message Box */}
        <div className="bg-[#faf6ee] p-4 rounded-xl mb-6 border border-[#ede3cf] text-xs text-gray-600 leading-relaxed text-center">
          <span>ℹ️ Upon clicking <strong>Proceed to Payment</strong>, you will be redirected to the secure payment portal to complete your transaction via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking.</span>
        </div>

        {/* Direct Payment Action Form */}
        <form onSubmit={submitHandler}>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#185e33] hover:bg-[#134b28] text-white font-bold py-4 rounded-full transition-colors shadow-lg text-base flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Connecting to Payment Gateway...</span>
            ) : (
              <span>Proceed to Payment ➔</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;

