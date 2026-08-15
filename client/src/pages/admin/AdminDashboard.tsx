import 'chart.js/auto';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router-dom';
import { useGetStatsQuery } from '../../redux/api/stats.api';
import { useAllProductsQuery } from '../../redux/api/product.api';
import { 
  FaRupeeSign, 
  FaShoppingBag, 
  FaTicketAlt, 
  FaBoxes, 
  FaPlus, 
  FaExclamationTriangle, 
  FaExternalLinkAlt, 
  FaArrowRight 
} from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: statsData, isLoading, isError, refetch } = useGetStatsQuery();
  const { data: productsData } = useAllProductsQuery({ page: 1, limit: 100, sortBy: { id: '', desc: false } });
  const stats = statsData?.stats;

  // Low stock alert items
  const lowStockProducts = useMemo(() => {
    if (!productsData?.products) return [];
    return productsData.products.filter(
      (p) => Number(p.stock || 0) < 10 && p.isActive !== false
    );
  }, [productsData]);

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
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  // Line chart options
  const lineChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a2e1d',
        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' as const },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          label: (context: any) => ` ₹${Number(context.raw || 0).toLocaleString('en-IN')}`,
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#888' }
      },
      y: {
        grid: { color: '#efe9db' },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 11 },
          color: '#888',
          callback: (value: any) => `₹${value}`
        }
      }
    }
  }), []);

  // Revenue chart data
  const chartData = useMemo(() => {
    const rawData = stats?.revenueByMonth || {
      Jan: 1200, Feb: 2800, Mar: 4500, Apr: 6800, May: 9200, Jun: 14000
    };
    return {
      labels: Object.keys(rawData),
      datasets: [
        {
          label: 'Revenue',
          data: Object.values(rawData),
          fill: true,
          backgroundColor: 'rgba(199, 154, 86, 0.12)',
          borderColor: '#C79A56',
          borderWidth: 3,
          pointBackgroundColor: '#185e33',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.35,
        },
      ],
    };
  }, [stats]);

  // Order demographic doughnut chart
  const doughnutData = useMemo(() => {
    const rawDemo = (stats as any)?.orderStatusDemographic || [];
    const labels = rawDemo.length > 0 ? rawDemo.map((g: any) => g._id) : ['Delivered', 'Processing', 'Pending'];
    const data = rawDemo.length > 0 ? rawDemo.map((g: any) => g.count) : [12, 5, 2];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#185e33', '#C79A56', '#e07a5f', '#3d5a80'],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  }, [stats]);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 11 },
          color: '#333',
          padding: 14,
          usePointStyle: true,
        }
      }
    }
  }), []);

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
        <p className="text-red-500 font-semibold mb-2">Error loading dashboard statistics.</p>
        <button
          onClick={() => refetch()}
          className="bg-[#185e33] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-[#134b28] transition mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions Bar */}
      <div className="bg-gradient-to-r from-[#1a2e1d] to-[#25422a] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C79A56]/20 border border-[#C79A56]/30 text-[#e4b97a] text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>🕯️ Store Operations Overview</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
            Julina Candles Portal
          </h1>
          <p className="text-xs text-gray-300">
            Monitor real-time sales trends, manage candle inventories, and fulfill customer orders.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2 bg-[#C79A56] hover:bg-[#b38543] text-gray-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md"
          >
            <FaPlus /> Add Product
          </button>
          <button
            onClick={() => navigate('/admin/coupons')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition border border-white/15"
          >
            <FaTicketAlt /> New Coupon
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition border border-white/15"
          >
            <FaExternalLinkAlt /> Live Store
          </a>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#C79A56]/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Widgets section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Widget 
          heading="Total Revenue" 
          value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} 
          description="Gross lifetime revenue" 
          icon={<FaRupeeSign className="text-lg" />}
          accentClass="bg-[#C79A56]/15 text-[#C79A56]"
        />
        <Widget 
          heading="Total Orders" 
          value={(stats?.totalOrders || 0).toLocaleString('en-IN')} 
          description="Customer orders placed" 
          icon={<FaShoppingBag className="text-lg" />}
          accentClass="bg-[#185e33]/15 text-[#185e33]"
        />
        <Widget 
          heading="Active Coupons" 
          value={(stats?.totalCoupons || 0).toLocaleString('en-IN')} 
          description="Available promo codes" 
          icon={<FaTicketAlt className="text-lg" />}
          accentClass="bg-purple-50 text-purple-700"
        />
        <Widget 
          heading="Total Products" 
          value={(productsData?.products?.length || stats?.totalProducts || 0).toLocaleString('en-IN')} 
          description="Candles in catalog" 
          icon={<FaBoxes className="text-lg" />}
          accentClass="bg-emerald-50 text-emerald-700"
        />
      </section>

      {/* Low Stock Alert Notification Banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg shrink-0">
                <FaExclamationTriangle />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-sm">
                  Low Stock Alert ({lowStockProducts.length} items need restock)
                </h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  Some of your handcrafted candle collections are running low (&lt; 10 units).
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition shadow-sm"
            >
              Manage Inventory
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {lowStockProducts.slice(0, 5).map((p) => (
              <span
                key={p._id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-200 text-gray-800 font-medium shrink-0"
              >
                <span>{p.name}:</span>
                <span className="font-bold text-amber-600">{p.stock} left</span>
              </span>
            ))}
            {lowStockProducts.length > 5 && (
              <span className="text-amber-700 font-semibold text-xs shrink-0">
                +{lowStockProducts.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Charts section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#efe9db] shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#efe9db] pb-4">
            <div>
              <h3 className="text-base font-serif font-bold text-[#185e33]">Revenue Performance</h3>
              <p className="text-xs text-gray-400">Monthly gross earnings overview</p>
            </div>
            <span className="text-xs font-bold text-[#C79A56] bg-[#C79A56]/10 px-2.5 py-1 rounded-full">
              Annual Overview
            </span>
          </div>
          <div className="h-[280px]">
            <Line data={chartData} options={lineChartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#efe9db] shadow-sm space-y-4">
          <div className="border-b border-[#efe9db] pb-4">
            <h3 className="text-base font-serif font-bold text-[#185e33]">Order Status Demographic</h3>
            <p className="text-xs text-gray-400">Distribution by fulfillment status</p>
          </div>
          <div className="h-[240px] flex items-center justify-center relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </section>

      {/* Latest Orders section */}
      <section className="bg-white p-6 rounded-3xl border border-[#efe9db] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#efe9db] pb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#185e33]">Latest Customer Orders</h2>
            <p className="text-xs text-gray-400">Recent purchases needing processing or dispatch</p>
          </div>
          <Link 
            to="/admin/orders" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#185e33] hover:text-[#C79A56] transition"
          >
            View All Orders <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {(!stats?.latestOrders || stats.latestOrders.length === 0) ? (
          <div className="text-center py-10 text-gray-400 text-xs">
            No recent orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#efe9db] text-left text-xs">
              <thead className="bg-[#faf6ee] text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total Amount</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efe9db] bg-white">
                {stats.latestOrders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-[#faf6ee]/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-gray-800">
                      #{order._id ? order._id.slice(0, 8) : 'N/A'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {order.createdAt ? dayjs(order.createdAt).format('DD MMM YYYY') : 'Recent'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 font-medium">
                      {order.orderItems?.length || 1} items
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#185e33]">
                      ₹{Number(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="px-3 py-1 rounded-lg bg-[#faf6ee] hover:bg-[#ede3cf] text-[#185e33] font-bold text-xs border border-[#ede3cf] transition"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

// Widget component
interface WidgetProps {
  heading: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  accentClass: string;
}

const Widget: React.FC<WidgetProps> = ({ heading, value, description, icon, accentClass }) => (
  <div className="bg-white p-5 rounded-2xl border border-[#efe9db] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
    <div className="space-y-1">
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{heading}</h3>
      <p className="text-2xl font-bold font-serif text-gray-900 tracking-tight">{value}</p>
      <p className="text-[11px] text-gray-500">{description}</p>
    </div>
    <div className={`p-3.5 rounded-2xl ${accentClass} transition-transform duration-200 group-hover:scale-110 shadow-xs`}>
      {icon}
    </div>
  </div>
);

export default AdminDashboard;


