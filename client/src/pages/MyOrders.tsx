import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useMyOrdersQuery } from '../redux/api/order.api';
import { notify } from '../utils/util';
import { usePageSEO } from '../hooks/usePageSEO';

const MyOrders: React.FC = () => {
    usePageSEO({
        title: 'My Orders | Julina Candles & Melts',
        description: 'Track and view your past orders with Julina Candles & Melts.',
        canonical: '/my-orders',
        noIndex: true,
    });

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Use guestUserId from localStorage for order tracking
    const guestUserId = localStorage.getItem('guestUserId') || '';

    const { data, isLoading, isError } = useMyOrdersQuery(guestUserId);

    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        const orderId = searchParams.get('orderId');
        if (paymentStatus === 'success') {
            notify('Payment successful! Your order has been placed.', 'success');
            if (orderId) {
                navigate(`/order/${orderId}`, { replace: true });
            } else {
                window.history.replaceState({}, '', window.location.pathname);
            }
        } else if (paymentStatus === 'fail') {
            notify('Payment failed or cancelled. Please try again.', 'error');
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [searchParams, navigate]);

    if (!guestUserId) {
        return (
            <div className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-md text-center">
                <BackButton fallback="/" />
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                <p className="text-gray-500">No orders found. Place an order to see it here.</p>
            </div>
        );
    }

    if (isLoading) {
        return <p className="text-center text-lg">Loading...</p>;
    }

    if (isError || !data) {
        return <p className="text-center text-lg text-red-500">Error loading orders</p>;
    }

    return (
        <div className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-md">
            <BackButton />
            <h2 className="text-2xl font-bold mb-6 text-center">My Orders</h2>
            {data.orders.length === 0 ? (
                <p className="text-center text-lg">No orders found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="p-4 text-sm md:text-base">Order ID</th>
                                <th className="p-4 text-sm md:text-base">Date</th>
                                <th className="p-4 text-sm md:text-base">Status</th>
                                <th className="p-4 text-sm md:text-base">Total</th>
                                <th className="p-4 text-sm md:text-base">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.orders.map((order) => (
                                <tr className="border-b hover:bg-gray-100" key={order._id}>
                                    <td className="p-4 text-sm md:text-base">{order._id}</td>
                                    <td className="p-4 text-sm md:text-base">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm md:text-base">{order.status  }</td>
                                    <td className="p-4 text-sm md:text-base font-bold text-[#5C2333]">₹ {order.total.toFixed(2)}</td>
                                    <td className="p-4">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm md:text-base hover:bg-blue-600 transition"
                                            onClick={() => navigate(`/order/${order._id}`)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrders;

