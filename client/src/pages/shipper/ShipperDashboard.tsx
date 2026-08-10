import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaShippingFast, FaBox, FaMapMarkerAlt, FaPhone, FaUser, FaCheck } from 'react-icons/fa';
import { useShipperOrdersQuery, useShipperLogoutMutation, useDispatchOrderMutation } from '../../redux/api/shipper.api';
import { notify } from '../../utils/util';
import { usePageSEO } from '../../hooks/usePageSEO';

const ShipperDashboard: React.FC = () => {
    usePageSEO({
        title: 'Shipper Dashboard | Julina Candles & Melts',
        description: 'Shipper Portal for Julina Candles & Melts dispatch management',
        canonical: '/shipper/dashboard',
        noIndex: true,
    });

    const navigate = useNavigate();
    const { data, isLoading, error, refetch } = useShipperOrdersQuery();
    const [logout] = useShipperLogoutMutation();
    const [dispatchOrder] = useDispatchOrderMutation();

    const shipperData = JSON.parse(localStorage.getItem('shipperData') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('shipperToken');
        if (!token) {
            navigate('/shipper/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (error) {
            notify('Session expired. Please login again.', 'error');
            handleLogout();
        }
    }, [error]);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (e) {
            // Ignore error
        }
        localStorage.removeItem('shipperToken');
        localStorage.removeItem('shipperData');
        navigate('/shipper/login');
    };

    const handleDispatch = async (orderId: string) => {
        if (!window.confirm('Mark this order as dispatched?')) return;

        try {
            await dispatchOrder(orderId).unwrap();
            notify('Order marked as dispatched!', 'success');
            refetch();
        } catch (error: any) {
            notify(error?.data?.message || 'Failed to update order', 'error');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'dispatched':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'shipped':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'processing':
                return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'delivered':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f4ec]">
            {/* Header */}
            <div className="bg-white border-b border-[#efe9db] shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1f5133] flex items-center justify-center text-white">
                                <FaShippingFast size={20} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-[#1f5133] font-serif">Shipper Portal</h1>
                                <p className="text-xs text-gray-500">{shipperData.name || 'Shipper'}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"
                        >
                            <FaSignOutAlt size={16} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-[#1f5133] to-[#2d7a4d] rounded-2xl shadow-lg p-6 mb-8 text-white">
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {shipperData.name}!</h2>
                    <p className="text-green-100">Manage your assigned delivery orders below</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-[#efe9db] p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Orders</p>
                                <p className="text-3xl font-bold text-[#1f5133] mt-1">{data?.orders?.length || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaBox className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-[#efe9db] p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Processing</p>
                                <p className="text-3xl font-bold text-amber-600 mt-1">
                                    {data?.orders?.filter(o => o.status === 'Processing').length || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                <FaShippingFast className="text-amber-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-[#efe9db] p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Shipped</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {data?.orders?.filter(o => o.status === 'Shipped').length || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <FaBox className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-[#efe9db] p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Dispatched</p>
                                <p className="text-3xl font-bold text-purple-600 mt-1">
                                    {data?.orders?.filter(o => o.status === 'Dispatched').length || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <FaCheck className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-2xl border border-[#efe9db] shadow-sm">
                    <div className="p-6 border-b border-[#efe9db]">
                        <h3 className="text-xl font-bold text-[#1f5133] font-serif">All Orders</h3>
                        <p className="text-sm text-gray-500 mt-1">View order details and mark as dispatched after delivery</p>
                    </div>

                    <div className="divide-y divide-[#efe9db]">
                        {data?.orders && data.orders.length > 0 ? (
                            data.orders.map((order) => (
                                <div key={order.id} className="p-6 hover:bg-[#f7f4ec]/30 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        {/* Order Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-xs text-gray-500 font-mono">#{order.id.slice(0, 8)}</span>
                                            </div>

                                            {/* Customer Details */}
                                            <div className="bg-[#f7f4ec] rounded-xl p-4 mb-3">
                                                <h4 className="text-sm font-bold text-[#1f5133] mb-2 flex items-center gap-2">
                                                    <FaUser size={14} /> Customer Details
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-600">Name:</span>
                                                        <span className="ml-2 font-semibold text-gray-900">{order.customer.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaPhone size={12} className="text-gray-600" />
                                                        <span className="font-mono text-gray-900">{order.customer.phone}</span>
                                                    </div>
                                                    <div className="col-span-2 flex items-start gap-2">
                                                        <FaMapMarkerAlt size={12} className="text-gray-600 mt-1" />
                                                        <span className="text-gray-900">
                                                            {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pinCode}
                                                            {order.customer.landmark && ` (Near: ${order.customer.landmark})`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Products */}
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-700 mb-2">Products ({order.items.length})</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-2 border border-[#efe9db]">
                                                            <img
                                                                src={item.photo || '/placeholder.png'}
                                                                alt={item.name}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <div className="lg:w-64 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Order Summary</p>
                                            <p className="text-2xl font-bold text-[#1f5133] mb-3">₹{order.total.toFixed(2)}</p>
                                            
                                            {order.tracking.awbNumber && (
                                                <div className="mt-3 pt-3 border-t border-gray-300">
                                                    <p className="text-xs text-gray-600 font-semibold mb-2">📦 Tracking</p>
                                                    <p className="text-xs text-gray-700 mb-1">
                                                        <span className="font-semibold">AWB:</span> {order.tracking.awbNumber}
                                                    </p>
                                                    {order.tracking.trackingUrl && (
                                                        <a
                                                            href={order.tracking.trackingUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-600 hover:underline block mt-2"
                                                        >
                                                            🔗 Track Shipment
                                                        </a>
                                                    )}
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-400 mt-3">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>

                                            {/* Dispatch Button - Only show if not already dispatched */}
                                            {order.status !== 'Dispatched' && (
                                                <button
                                                    onClick={() => handleDispatch(order.id)}
                                                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm"
                                                >
                                                    <FaCheck size={14} />
                                                    Mark as Dispatched
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <FaBox size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-semibold">No orders assigned yet</p>
                                <p className="text-sm mt-1">New orders will appear here when assigned by admin</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipperDashboard;

