import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllOrdersQuery } from '../../redux/api/order.api';
import { Order } from '../../types/api-types';
import { FaClipboardList, FaEye } from 'react-icons/fa';

const AdminOrders: React.FC = () => {
    const { data, isLoading, isError } = useAllOrdersQuery('');
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (data && data.orders) {
            setOrders(data.orders);
        }
    }, [data]);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'shipped':
                return 'bg-green-50 text-green-700 border border-green-200';
            case 'processing':
                return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'delivered':
                return 'bg-blue-50 text-blue-700 border border-blue-200';
            default:
                return 'bg-gray-50 text-gray-600 border border-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="loader"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white p-8 rounded-2xl border border-[#efe9db] text-center shadow-sm max-w-md mx-auto">
                <p className="text-red-500 font-semibold mb-2">Error loading orders</p>
                <p className="text-sm text-gray-500">Please try again later.</p>
            </div>
        );
    }

    const handleViewDetails = (orderId: string) => {
        navigate(`/admin/orders/${orderId}`);
    };

    const getCustomerDetails = (order: Order) => {
        const info: any = order.shippingInfo || {};
        let rawName = info.name || info.fullName || info.customerName || '';

        if (!rawName && typeof order.user === 'object' && (order.user as any)?.name) {
            rawName = (order.user as any).name;
        }

        let nameStr = 'Customer';
        if (rawName && typeof rawName === 'string') {
            const trimmed = rawName.trim();
            if (trimmed !== '' && trimmed !== 'Guest Customer' && !/^\d+$/.test(trimmed)) {
                nameStr = trimmed;
            }
        } else if (info.email && typeof info.email === 'string' && info.email.includes('@')) {
            const nameFromEmail = info.email.split('@')[0].replace(/[._\-\d]+/g, ' ').trim();
            if (nameFromEmail) {
                nameStr = nameFromEmail.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            }
        }

        const locationParts: string[] = [];
        if (info.address && String(info.address).trim() !== '') locationParts.push(String(info.address).trim());
        if (info.city && String(info.city).trim() !== '') locationParts.push(String(info.city).trim());
        if (info.state && String(info.state).trim() !== '' && String(info.state).trim() !== String(info.city).trim()) locationParts.push(String(info.state).trim());

        if (locationParts.length > 0) {
            return `${nameStr} , ${locationParts.join(', ')}`;
        }

        return nameStr;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-serif font-bold text-[#1f5133] flex items-center gap-2">
                    <FaClipboardList /> Order Management
                </h1>
                <p className="text-xs text-gray-400">Track shipping, update status, and manage client invoices.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm">
                {orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-medium">No customer orders available.</div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-[#efe9db]">
                        <table className="min-w-full divide-y divide-[#efe9db] text-left">
                            <thead className="bg-[#f7f4ec]">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer & Shipping Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#efe9db]">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-[#f7f4ec]/35 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-gray-500 text-xs">{order._id}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <span>{getCustomerDetails(order)}</span>
                                                {order.shippingInfo?.latitude && order.shippingInfo?.longitude && (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${order.shippingInfo.latitude},${order.shippingInfo.longitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-[#1f5133] border border-green-200 px-2 py-0.5 rounded-full hover:bg-green-100"
                                                        title="Click to view GPS location on Google Maps"
                                                    >
                                                        📍 GPS Map
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">₹{order.total.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleViewDetails(order._id)}
                                                className="text-secondary hover:bg-secondary/10 px-3.5 py-1.5 rounded-lg border border-secondary/20 font-medium text-xs transition flex items-center gap-1"
                                            >
                                                <FaEye /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;

