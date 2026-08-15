import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllOrdersQuery, useUpdateOrderStatusMutation } from '../../redux/api/order.api';
import { Order } from '../../types/api-types';
import { 
  FaClipboardList, 
  FaEye, 
  FaSearch, 
  FaWhatsapp, 
  FaCopy, 
  FaCheck, 
  FaRupeeSign, 
  FaShoppingBag, 
  FaClock, 
  FaTruck
} from 'react-icons/fa';
import dayjs from 'dayjs';
import { notify } from '../../utils/util';

const AdminOrders: React.FC = () => {
  const { data, isLoading, isError, refetch } = useAllOrdersQuery('');
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.orders) {
      setOrders(data.orders);
    }
  }, [data]);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    notify('Order ID copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      notify(`Order updated to ${newStatus}`, 'success');
      refetch();
    } catch (err) {
      notify('Failed to update order status', 'error');
    }
  };

  // Status Badge Colors
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  // Customer Name & Location Helper
  const getCustomerInfo = (order: Order) => {
    const info: any = order.shippingInfo || {};
    let rawName = info.name || info.fullName || info.customerName || '';
    if (!rawName && typeof order.user === 'object' && (order.user as any)?.name) {
      rawName = (order.user as any).name;
    }

    let name = 'Guest Customer';
    if (rawName && typeof rawName === 'string' && rawName.trim()) {
      name = rawName.trim();
    } else if (info.email && typeof info.email === 'string' && info.email.includes('@')) {
      const parts = info.email.split('@')[0].replace(/[._\-\d]+/g, ' ').trim();
      name = parts.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    const phone = info.phone || info.mobile || '';
    const city = info.city || '';
    const state = info.state || '';
    const address = info.address || '';

    return { name, phone, city, state, address, email: info.email };
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase().trim();
      const customer = getCustomerInfo(order);

      const matchesSearch = !q || 
        order._id?.toLowerCase().includes(q) ||
        customer.name.toLowerCase().includes(q) ||
        customer.phone.toLowerCase().includes(q) ||
        customer.city.toLowerCase().includes(q) ||
        customer.email?.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === 'All' || order.status?.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  // Order Metrics
  const metrics = useMemo(() => {
    const total = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const pendingProcessing = orders.filter(o => ['pending', 'processing'].includes(o.status?.toLowerCase())).length;
    const delivered = orders.filter(o => o.status?.toLowerCase() === 'delivered').length;
    return { total, totalRevenue, pendingProcessing, delivered };
  }, [orders]);

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loader"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-[#efe9db] text-center shadow-sm max-w-md mx-auto my-12">
        <p className="text-red-500 font-semibold mb-2">Error loading orders.</p>
        <p className="text-xs text-gray-500 mb-4">Please verify database connectivity and try again.</p>
        <button
          onClick={() => refetch()}
          className="bg-[#185e33] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#134b28] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#185e33]">Order Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track customer orders, manage real-time dispatch statuses, and communicate with buyers.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="self-start sm:self-auto bg-[#faf6ee] hover:bg-[#ede3cf] text-[#185e33] font-bold px-4 py-2 rounded-xl text-xs border border-[#ede3cf] transition"
        >
          Refresh Orders
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#efe9db] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#C79A56]/10 text-[#C79A56] flex items-center justify-center text-sm font-bold">
              <FaRupeeSign />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 font-serif mt-2">
            ₹{metrics.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">From all {metrics.total} orders</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#efe9db] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#185e33]/10 text-[#185e33] flex items-center justify-center text-sm">
              <FaShoppingBag />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 font-serif mt-2">{metrics.total}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Lifetime orders count</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#efe9db] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Action Required</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              <FaClock />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 font-serif mt-2">{metrics.pendingProcessing}</p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Pending or Processing</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#efe9db] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Delivered</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <FaTruck />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-serif mt-2">{metrics.delivered}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Successfully fulfilled</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-5 rounded-2xl border border-[#efe9db] shadow-sm space-y-4">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer name, phone number or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ede3cf] text-sm focus:outline-none focus:ring-2 focus:ring-[#185e33]/20 bg-[#faf6ee]/50 placeholder-gray-400 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {statuses.map((st) => {
            const count = st === 'All' 
              ? orders.length 
              : orders.filter(o => o.status?.toLowerCase() === st.toLowerCase()).length;
            
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedStatus === st
                    ? 'bg-[#185e33] text-white shadow-sm font-semibold'
                    : 'bg-[#faf6ee] text-gray-600 hover:bg-[#ede3cf] border border-[#ede3cf]'
                }`}
              >
                <span>{st}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedStatus === st ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#efe9db] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#efe9db] flex items-center justify-between">
          <h2 className="font-serif font-bold text-[#185e33] text-base">
            Orders ({filteredOrders.length})
          </h2>
          {(searchQuery || selectedStatus !== 'All') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedStatus('All'); }}
              className="text-xs font-semibold text-[#C79A56] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-[#faf6ee] text-[#185e33] text-2xl flex items-center justify-center mx-auto mb-3">
              <FaClipboardList />
            </div>
            <p className="text-gray-900 font-semibold mb-1">No orders found</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No orders matched your filter criteria or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#efe9db] text-left text-xs">
              <thead className="bg-[#faf6ee] text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Order ID & Date</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efe9db] bg-white">
                {filteredOrders.map((order) => {
                  const customer = getCustomerInfo(order);
                  const items = Array.isArray(order.orderItems) ? order.orderItems : [];
                  const itemCount = items.reduce((sum: number, it: any) => sum + (Number(it.quantity) || 1), 0);

                  return (
                    <tr key={order._id} className="hover:bg-[#faf6ee]/50 transition-colors">
                      {/* Order ID & Date */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-gray-900">
                            #{order._id ? order._id.slice(0, 8) : 'N/A'}
                          </span>
                          <button
                            onClick={() => handleCopy(order._id)}
                            className="text-gray-400 hover:text-[#185e33] transition"
                            title="Copy full Order ID"
                          >
                            {copiedId === order._id ? (
                              <FaCheck className="text-emerald-600 text-[10px]" />
                            ) : (
                              <FaCopy className="text-[10px]" />
                            )}
                          </button>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {order.createdAt ? dayjs(order.createdAt).format('DD MMM YYYY, hh:mm A') : 'Recent'}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="px-5 py-3.5">
                        <div className="min-w-0">
                          <span className="font-bold text-gray-900 block text-sm">
                            {customer.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {customer.city && (
                              <span className="text-[11px] text-gray-500">
                                📍 {customer.city}{customer.state ? `, ${customer.state}` : ''}
                              </span>
                            )}
                            {order.shippingInfo?.latitude && order.shippingInfo?.longitude && (
                              <a
                                href={`https://www.google.com/maps?q=${order.shippingInfo.latitude},${order.shippingInfo.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-[#185e33] border border-green-200 px-1.5 py-0.2 rounded hover:bg-green-100"
                              >
                                GPS
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-gray-700 text-xs">
                          {itemCount} {itemCount === 1 ? 'candle' : 'candles'}
                        </span>
                        {items[0]?.name && (
                          <span className="text-[10px] text-gray-400 block truncate max-w-[150px] mt-0.5">
                            {items[0].name}
                          </span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-[#185e33] text-sm block">
                          ₹{Number(order.total || 0).toFixed(2)}
                        </span>
                        {Number(order.discount || 0) > 0 && (
                          <span className="text-[10px] text-rose-600 block">
                            -₹{Number(order.discount).toFixed(2)} off
                          </span>
                        )}
                      </td>

                      {/* Status Selector */}
                      <td className="px-5 py-3.5">
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => handleQuickStatusChange(order._id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${getStatusBadge(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {customer.phone && (
                            <a
                              href={`https://wa.me/91${customer.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(customer.name)},%20regarding%20your%20Julina%20Candles%20order%20%23${order._id ? order._id.slice(0, 8) : ''}...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition"
                              title="Chat with Customer on WhatsApp"
                            >
                              <FaWhatsapp className="text-sm" />
                            </a>
                          )}
                          <button
                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                            className="px-3 py-1.5 rounded-xl bg-[#faf6ee] hover:bg-[#ede3cf] text-[#185e33] font-bold text-xs border border-[#ede3cf] transition flex items-center gap-1.5"
                          >
                            <FaEye className="text-xs" /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;


