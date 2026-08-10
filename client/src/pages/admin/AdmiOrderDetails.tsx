import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackBtn';
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderStatusMutation } from '../../redux/api/order.api';
import { notify } from '../../utils/util';
import { FaTrash, FaTimes } from 'react-icons/fa';

const AdminOrderDetails: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { data, isLoading, isError, refetch } = useOrderDetailsQuery(orderId!);
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [deleteOrder] = useDeleteOrderMutation();
    const navigate = useNavigate();

    // Tracking Modal State
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [awbNumber, setAwbNumber] = useState('');
    const [senderMobile, setSenderMobile] = useState('');
    const [receiverMobile, setReceiverMobile] = useState(data?.order?.shippingInfo?.phone || '');

    const handleStatusChange = (status: string) => {
        // If status is "Shipped", show tracking modal
        if (status === 'Shipped') {
            setSelectedStatus(status);
            setReceiverMobile(data?.order?.shippingInfo?.phone || '');
            setShowTrackingModal(true);
        } else {
            // For other statuses, update directly
            handleStatusUpdate(status);
        }
    };

    const handleStatusUpdate = async (status: string, trackingData?: { awbNumber: string; senderMobile: string; receiverMobile: string }) => {
        try {
            const updatePayload: any = { 
                orderId: orderId!, 
                status 
            };
            
            // Add tracking data if provided
            if (trackingData) {
                updatePayload.awbNumber = trackingData.awbNumber;
                updatePayload.senderMobile = trackingData.senderMobile;
                updatePayload.receiverMobile = trackingData.receiverMobile;
            }

            await updateOrderStatus(updatePayload).unwrap();
            notify('Order status updated successfully', 'success');
            refetch();
        } catch (error) {
            notify('Failed to update order status', 'error');
        }
    };

    const handleTrackingSubmit = () => {
        // Validate inputs
        if (!awbNumber.trim()) {
            notify('Please enter AWB Number', 'error');
            return;
        }
        if (!senderMobile.trim() || senderMobile.length !== 10) {
            notify('Please enter valid 10-digit Sender Mobile Number', 'error');
            return;
        }
        if (!receiverMobile.trim() || receiverMobile.length !== 10) {
            notify('Please enter valid 10-digit Receiver Mobile Number', 'error');
            return;
        }

        // Update status with tracking data
        handleStatusUpdate(selectedStatus, {
            awbNumber: awbNumber.trim(),
            senderMobile: senderMobile.trim(),
            receiverMobile: receiverMobile.trim()
        });

        // Close modal and reset
        setShowTrackingModal(false);
        setAwbNumber('');
        setSenderMobile('');
        setReceiverMobile('');
    };

    const handleDeleteOrder = async () => {
        try {
            await deleteOrder(orderId!).unwrap();
            notify('Order deleted successfully', 'success');
            navigate('/admin/orders');
        } catch (error) {
            notify('Failed to delete order', 'error');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'dispatched':
                return 'bg-purple-50 text-purple-700 border border-purple-200';
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
                <p className="text-red-500 font-semibold mb-2">Error loading order details</p>
                <p className="text-sm text-gray-500">Could not find or retrieve order data.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <BackButton fallback="/admin/orders" />
                <div>
                    <span className="text-xs text-gray-400 font-mono">ID: {data?.order?._id}</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#efe9db] pb-4 gap-4">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-[#1f5133]">Order Information</h2>
                        <p className="text-xs text-gray-400">Review client information, total purchase value, and items list.</p>
                    </div>
                    <div>
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusBadge(data?.order?.status || '')}`}>
                            {data?.order?.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="p-4 rounded-xl bg-[#f7f4ec]/40 border border-[#efe9db]/50">
                        <strong className="block text-xs uppercase text-gray-400 mb-1 tracking-wider">Customer Details</strong>
                        <span className="text-gray-900 font-semibold block">
                            {data?.order?.shippingInfo?.name || (typeof data?.order?.user === 'object' ? (data?.order?.user as any)?.name : '') || data?.order?.shippingInfo?.email?.split('@')[0] || 'Customer'}
                        </span>
                        <span className="text-gray-500 text-xs block font-mono">
                            {data?.order?.shippingInfo?.email || (typeof data?.order?.user === 'object' ? (data?.order?.user as any)?.email : '') || 'N/A'}
                        </span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#f7f4ec]/40 border border-[#efe9db]/50">
                        <strong className="block text-xs uppercase text-gray-400 mb-1 tracking-wider">Total Value</strong>
                        <span className="text-[#1f5133] font-bold text-lg block">₹{data?.order?.total.toFixed(2)}</span>
                        <span className="text-gray-500 text-xs block">Inclusive of all taxes & delivery charges</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#f7f4ec]/40 border border-[#efe9db]/50">
                        <strong className="block text-xs uppercase text-gray-400 mb-1 tracking-wider">Shipping Details</strong>
                        <span className="text-gray-900 block font-medium">
                            {data?.order?.shippingInfo?.address || 'N/A'}, {data?.order?.shippingInfo?.city || 'N/A'}
                        </span>
                        <span className="text-gray-500 text-xs block mt-1">
                            PIN: {data?.order?.shippingInfo?.pinCode || 'N/A'} | Mob: {data?.order?.shippingInfo?.phone || 'N/A'}
                        </span>

                        {/* GPS Coordinates & Google Maps Link */}
                        {data?.order?.shippingInfo?.latitude && data?.order?.shippingInfo?.longitude ? (
                            <div className="mt-3 pt-2 border-t border-[#efe9db] space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-[#1f5133] font-semibold">
                                    <span>📍 GPS:</span>
                                    <span className="font-mono text-gray-800">
                                        {data.order.shippingInfo.latitude.toFixed(5)}, {data.order.shippingInfo.longitude.toFixed(5)}
                                    </span>
                                </div>
                                <a
                                    href={`https://www.google.com/maps?q=${data.order.shippingInfo.latitude},${data.order.shippingInfo.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#c4633c] hover:underline mt-1"
                                >
                                    🗺️ Open Location on Google Maps ➔
                                </a>
                            </div>
                        ) : data?.order?.shippingInfo?.landmark ? (
                            <span className="text-xs text-gray-500 block mt-1">
                                Landmark: {data.order.shippingInfo.landmark}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div>
                    <h3 className="text-md font-serif font-bold text-[#1f5133] mb-3">Order Items</h3>
                    <div className="overflow-x-auto rounded-xl border border-[#efe9db]">
                        <table className="min-w-full divide-y divide-[#efe9db] text-left">
                            <thead className="bg-[#f7f4ec]">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#efe9db]">
                                {data?.order.orderItems.map((item) => (
                                    <tr key={item.productId} className="hover:bg-[#f7f4ec]/35 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{item.quantity} units</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">₹{item.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#efe9db] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Update Order Status:</label>
                        <select
                            className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-2.5 bg-white text-sm font-semibold"
                            value={data?.order?.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                    <button
                        onClick={handleDeleteOrder}
                        className="inline-flex items-center gap-2 text-red-600 border border-red-100 hover:bg-red-50 px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-sm"
                    >
                        <FaTrash size={12} /> Delete Order Record
                    </button>
                </div>

                {/* Display Tracking Info if Available */}
                {data?.order?.awbNumber && (
                    <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <h4 className="text-sm font-bold text-blue-900 mb-2">📦 Shipment Tracking Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div>
                                <span className="text-blue-600 font-semibold">AWB Number:</span>
                                <p className="text-blue-900 font-mono">{data.order.awbNumber}</p>
                            </div>
                            <div>
                                <span className="text-blue-600 font-semibold">Sender Mobile:</span>
                                <p className="text-blue-900 font-mono">{data.order.senderMobile}</p>
                            </div>
                            <div>
                                <span className="text-blue-600 font-semibold">Receiver Mobile:</span>
                                <p className="text-blue-900 font-mono">{data.order.receiverMobile}</p>
                            </div>
                        </div>
                        {data.order.trackingUrl && (
                            <a 
                                href={data.order.trackingUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block mt-3 text-blue-700 hover:text-blue-900 underline text-xs font-medium"
                            >
                                🔗 Track Shipment
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Tracking Modal */}
            {showTrackingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#efe9db]">
                        <div className="flex items-center justify-between mb-4 border-b border-[#efe9db] pb-3">
                            <h3 className="text-lg font-bold text-[#1f5133] font-serif">📦 Enter Shipment Tracking Details</h3>
                            <button
                                onClick={() => setShowTrackingModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">
                            Please provide the AWB number and mobile numbers to enable shipment tracking (similar to APSRTC Logistics).
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                    AWB Number *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 79732207"
                                    value={awbNumber}
                                    onChange={(e) => setAwbNumber(e.target.value)}
                                    className="w-full border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 text-sm font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                    Sender Mobile Number *
                                </label>
                                <input
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    value={senderMobile}
                                    onChange={(e) => setSenderMobile(e.target.value.replace(/\D/g, ''))}
                                    className="w-full border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 text-sm font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                    Receiver Mobile Number *
                                </label>
                                <input
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    value={receiverMobile}
                                    onChange={(e) => setReceiverMobile(e.target.value.replace(/\D/g, ''))}
                                    className="w-full border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 text-sm font-mono"
                                />
                                <p className="text-xs text-gray-500 mt-1">Pre-filled from order details</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowTrackingModal(false)}
                                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium text-sm transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTrackingSubmit}
                                className="flex-1 bg-[#1f5133] text-white hover:bg-[#163b26] px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-sm"
                            >
                                Update & Send Tracking Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderDetails;

