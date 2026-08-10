import 'chart.js/auto';
import dayjs from 'dayjs';
import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { useTable, Column } from 'react-table';
import { useGetStatsQuery } from '../../redux/api/stats.api';
import { FaRupeeSign, FaShoppingBag, FaTicketAlt, FaBox } from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
    const { data: statsData, isLoading, isError } = useGetStatsQuery();
    const stats = statsData?.stats;

    // Memoize table data and columns to avoid re-calculating on every render
    const data = React.useMemo(() => {
        return stats?.latestOrders?.map((order) => ({
            ...order,
            orderItems: order.orderItems?.length ?? 0,
        })) ?? [];
    }, [stats]);

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

    const columns: Column[] = React.useMemo(() => [
        { 
            Header: 'Order ID', 
            accessor: '_id',
            Cell: ({ value }) => <span className="font-mono text-xs text-gray-500">{value}</span>
        },
        { 
            Header: 'Date', 
            accessor: 'createdAt', 
            Cell: ({ value }) => <span>{dayjs(value).format('DD MMM YYYY')}</span> 
        },
        { 
            Header: 'Status', 
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusBadge(value)}`}>
                    {value}
                </span>
            )
        },
        { 
            Header: 'Total Items', 
            accessor: 'orderItems',
            Cell: ({ value }) => <span className="font-medium text-gray-700">{value} {Number(value) === 1 ? 'item' : 'items'}</span>
        },
        { 
            Header: 'Amount', 
            accessor: 'total',
            Cell: ({ value }) => <span className="font-semibold text-gray-900">₹{Number(value).toFixed(2)}</span>
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    // Custom Options for line chart
    const lineChartOptions = React.useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#24291f',
                titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' as const },
                bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { family: 'Plus Jakarta Sans', size: 11 },
                    color: '#9ca3af',
                }
            },
            y: {
                grid: {
                    color: '#efe9db',
                },
                ticks: {
                    font: { family: 'Plus Jakarta Sans', size: 11 },
                    color: '#9ca3af',
                }
            }
        }
    }), []);

    // Memoize chart data to avoid re-calculating on every render
    const chartData = React.useMemo(() => ({
        labels: Object.keys(stats?.revenueByMonth || {}),
        datasets: [
            {
                label: 'Revenue',
                data: Object.values(stats?.revenueByMonth || {}),
                fill: true,
                backgroundColor: 'rgba(31, 81, 51, 0.05)',
                borderColor: '#1f5133',
                borderWidth: 2.5,
                pointBackgroundColor: '#1f5133',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#c4633c',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2,
                tension: 0.4,
            },
        ],
    }), [stats]);

    const pieChartData = React.useMemo(() => ({
        labels: (stats as any)?.orderStatusDemographic?.map((g: any) => g._id) ?? ['Processing'],
        datasets: [
            {
                data: (stats as any)?.orderStatusDemographic?.map((g: any) => g.count) ?? [1],
                backgroundColor: ['#1f5133', '#c4633c', '#2f7d43'],
                hoverBackgroundColor: ['#163b26', '#b0542e', '#235f32'],
                borderWidth: 2,
                borderColor: '#ffffff',
            },
        ],
    }), [stats]);

    const pieChartOptions = React.useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    font: { family: 'Plus Jakarta Sans', size: 12 },
                    color: '#24291f',
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'circle',
                }
            },
            tooltip: {
                backgroundColor: '#24291f',
                titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' as const },
                bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
                padding: 12,
                cornerRadius: 8,
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
            <div className="bg-white p-8 rounded-2xl border border-[#efe9db] text-center shadow-sm max-w-md mx-auto">
                <p className="text-red-500 font-semibold mb-2">Error loading dashboard stats</p>
                <p className="text-sm text-gray-500">Please try refreshing the page or contact support.</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="bg-white p-8 rounded-2xl border border-[#efe9db] text-center shadow-sm max-w-md mx-auto">
                <p className="text-gray-500">No dashboard data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Widgets section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Widget 
                    heading="Total Revenue" 
                    value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} 
                    description="Overall gross revenue" 
                    icon={<FaRupeeSign className="text-xl" />}
                    accentClass="bg-[#1f5133]/10 text-[#1f5133]"
                />
                <Widget 
                    heading="Total Orders" 
                    value={(stats.totalOrders || 0).toLocaleString('en-IN')} 
                    description="Total orders processed" 
                    icon={<FaShoppingBag className="text-xl" />}
                    accentClass="bg-[#c4633c]/10 text-[#c4633c]"
                />
                <Widget 
                    heading="Active Coupons" 
                    value={(stats.totalCoupons || 0).toLocaleString('en-IN')} 
                    description="Currently active promo codes" 
                    icon={<FaTicketAlt className="text-xl" />}
                    accentClass="bg-[#b28c2e]/10 text-[#b28c2e]"
                />
                <Widget 
                    heading="Total Products" 
                    value={(stats.totalProducts || 0).toLocaleString('en-IN')} 
                    description="Total items in catalog" 
                    icon={<FaBox className="text-xl" />}
                    accentClass="bg-[#2f7d43]/10 text-[#2f7d43]"
                />
            </section>

            {/* Charts section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm lg:col-span-2">
                    <h3 className="text-base font-bold text-[#1f5133] mb-4 uppercase tracking-wider font-serif">Revenue Trends</h3>
                    <div className="h-[300px]">
                        <Line data={chartData} options={lineChartOptions} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm">
                    <h3 className="text-base font-bold text-[#1f5133] mb-4 uppercase tracking-wider font-serif">Order Status Distribution</h3>
                    <div className="h-[300px] flex items-center justify-center relative">
                        <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                </div>
            </section>

            {/* Most Sold Items section */}
            <section className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm">
                <h2 className="text-lg font-serif font-bold text-[#1f5133] mb-4 uppercase tracking-wider">Most Sold Items</h2>
                <div className="overflow-x-auto rounded-xl border border-[#efe9db]">
                    <table className="min-w-full divide-y divide-[#efe9db]">
                        <thead className="bg-[#f7f4ec]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#efe9db] bg-white">
                            {stats?.bestSellingProducts?.map((product, index) => (
                                <tr key={index} className="hover:bg-[#f7f4ec]/35 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <Link to={`/admin/products/${product.productId}`} className="text-[#c4633c] hover:underline font-mono text-xs">
                                            {product.productId}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-sans">{product.quantity} units</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Latest Orders section */}
            <section className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm">
                <h2 className="text-lg font-serif font-bold text-[#1f5133] mb-4 uppercase tracking-wider">Latest Orders</h2>
                <div className="overflow-x-auto rounded-xl border border-[#efe9db]">
                    <table {...getTableProps()} className="min-w-full divide-y divide-[#efe9db]">
                        <thead className="bg-[#f7f4ec]">
                            {headerGroups.map((headerGroup, idx) => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()} key={column.id} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()} className="divide-y divide-[#efe9db] bg-white">
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} key={row.id} className="hover:bg-[#f7f4ec]/35 transition-colors">
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()} key={cell.column.id} className="px-6 py-4 text-sm text-gray-900">
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

// Define the Widget component
interface WidgetProps {
    heading: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    accentClass: string;
}

const Widget: React.FC<WidgetProps> = ({ heading, value, description, icon, accentClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group">
        <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{heading}</h3>
            <p className="text-3xl font-bold font-serif text-[#24291f] tracking-tight">{value}</p>
            <p className="text-xs text-gray-500 font-sans">{description}</p>
        </div>
        <div className={`p-4 rounded-xl ${accentClass} transition-transform duration-200 group-hover:scale-105`}>
            {icon}
        </div>
    </div>
);

export default AdminDashboard;

