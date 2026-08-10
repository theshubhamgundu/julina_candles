import React from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useOrderDetailsQuery } from '../redux/api/order.api';
import { usePageSEO } from '../hooks/usePageSEO';

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    usePageSEO({
        title: `Order #${id || ''} | Julina Candles & Melts`,
        description: 'View order details and status.',
        canonical: `/order/${id || ''}`,
        noIndex: true,
    });

    const { data, isLoading, isError } = useOrderDetailsQuery(id!);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-[#f6f1e7]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#5C2333]/20 border-t-[#5C2333] rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-sans">Loading order invoice...</p>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#f6f1e7] p-4 text-center">
                <BackButton fallback="/my-orders" />
                <p className="text-4xl mb-3">📄</p>
                <h2 className="text-xl font-serif font-bold text-[#5C2333] mb-2">Order Not Found</h2>
                <p className="text-sm text-gray-500 max-w-sm mb-4">Could not find order details for ID: {id}</p>
            </div>
        );
    }

    const { order } = data;

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'shipped':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'processing':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'delivered':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f1e7] py-6 sm:py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <BackButton fallback="/my-orders" />

                <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-[#ede3cf] space-y-6">
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-[#ede3cf] gap-3">
                        <div>
                            <span className="text-xs font-mono text-gray-400 block">ORDER RECEIPT</span>
                            <h1 className="text-lg sm:text-2xl font-serif font-bold text-[#5C2333] break-all">ID: {order._id}</h1>
                            <p className="text-xs text-gray-500 mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                            <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    {/* Shipping & Customer Details Card */}
                    <div className="bg-[#faf6ee] p-4 sm:p-5 rounded-2xl border border-[#ede3cf] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                        <div>
                            <h3 className="font-bold text-[#5C2333] text-xs uppercase tracking-wider mb-2">Delivery Address</h3>
                            <p className="font-semibold text-gray-900">{order.shippingInfo.address}</p>
                            <p className="text-gray-600">{order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pinCode}</p>
                            <p className="text-gray-600">{order.shippingInfo.country}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#5C2333] text-xs uppercase tracking-wider mb-2">Customer Details</h3>
                            <p className="text-gray-700">Phone: <span className="font-semibold text-gray-900">{order.shippingInfo.phone}</span></p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-[#5C2333] mb-4">Order Items</h3>
                        
                        {/* Mobile Item Cards (Visible on small screens) */}
                        <div className="md:hidden space-y-3">
                            {order.orderItems.map((item, index) => (
                                <div key={item._id || index} className="bg-[#faf6ee] p-3.5 rounded-xl border border-[#ede3cf] flex items-center gap-3">
                                    <img src={item.photo} alt={item.name} className="h-14 w-14 object-contain rounded-lg bg-white p-1 border border-[#ede3cf] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs text-[#5C2333] truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                                        <p className="text-xs font-bold text-gray-900 mt-0.5">₹ {(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table (Hidden on small screens) */}
                        <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#ede3cf]">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#faf6ee]">
                                    <tr className="border-b border-[#ede3cf] text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="p-4">Product</th>
                                        <th className="p-4">Quantity</th>
                                        <th className="p-4">Unit Price</th>
                                        <th className="p-4 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#ede3cf] text-sm">
                                    {order.orderItems.map((item, index) => (
                                        <tr className="hover:bg-[#faf6ee]/50 transition-colors" key={item._id || `item-${index}`}>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <img src={item.photo} alt={item.name} className="h-12 w-12 object-contain rounded-xl bg-[#faf6ee] p-1 border border-[#ede3cf]" />
                                                    <span className="font-bold text-[#5C2333]">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-gray-700">{item.quantity}</td>
                                            <td className="p-4 font-medium text-gray-700">₹ {item.price.toFixed(2)}</td>
                                            <td className="p-4 font-bold text-[#5C2333] text-right">₹ {(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Summary Box */}
                    <div className="bg-[#faf6ee] p-5 rounded-2xl border border-[#ede3cf] space-y-2 text-xs sm:text-sm">
                        <h3 className="font-serif font-bold text-base text-[#5C2333] pb-2 border-b border-[#ede3cf]">Payment Breakdown</h3>
                        <div className="flex justify-between text-gray-600 pt-1">
                            <span>Subtotal</span>
                            <span className="font-semibold text-gray-900">₹ {order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.tax > 0 && (
                            <div className="flex justify-between text-gray-600">
                                <span>Taxes</span>
                                <span className="font-semibold text-gray-900">₹ {order.tax.toFixed(2)}</span>
                            </div>
                        )}
                        {order.shippingCharges > 0 && (
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Charges</span>
                                <span className="font-semibold text-gray-900">₹ {order.shippingCharges.toFixed(2)}</span>
                            </div>
                        )}
                        {order.discount > 0 && (
                            <div className="flex justify-between text-[#c4633c] font-semibold">
                                <span>Discount</span>
                                <span>-₹ {order.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-[#ede3cf] flex justify-between items-baseline font-bold text-base text-[#185e33]">
                            <span>Total Paid</span>
                            <span className="text-xl sm:text-2xl font-extrabold">₹ {order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

