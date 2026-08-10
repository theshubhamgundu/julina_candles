import React, { useState } from 'react';
import { useGetAllCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation } from '../../redux/api/coupon.api';
import { notify } from '../../utils/util';
import dayjs from 'dayjs';
import { FaTicketAlt, FaTrash } from 'react-icons/fa';

const AdminCoupons: React.FC = () => {
    const { data, refetch, isLoading: isFetchingCoupons, isError: fetchError } = useGetAllCouponsQuery();
    const [createCoupon] = useCreateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();
    const [code, setCode] = useState('');
    const [amount, setAmount] = useState<number | string>('');

    const handleCreateCoupon = async () => {
        if (!code || !amount) {
            notify('Please fill all fields', 'error');
            return;
        }

        try {
            const trimmedCode = code.trim().toUpperCase();
            await createCoupon({ code: trimmedCode, amount: Number(amount) }).unwrap();
            notify(`Coupon '${trimmedCode}' created successfully`, 'success');
            setCode('');
            setAmount('');
            refetch();
        } catch (error) {
            notify('Failed to create coupon', 'error');
        }
    };

    const handleDeleteCoupon = async (id: string) => {
        try {
            await deleteCoupon(id).unwrap();
            notify('Coupon deleted successfully', 'success');
            refetch();
        } catch (error) {
            notify('Failed to delete coupon', 'error');
        }
    };

    if (isFetchingCoupons) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="loader"></div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="bg-white p-8 rounded-2xl border border-[#efe9db] text-center shadow-sm max-w-md mx-auto">
                <p className="text-red-500 font-semibold mb-2">Error loading coupons</p>
                <p className="text-sm text-gray-500">Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-serif font-bold text-[#1f5133] flex items-center gap-2">
                    <FaTicketAlt /> Coupon Management
                </h1>
                <p className="text-xs text-gray-400">Create, track, and delete discount codes for your customers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Create Coupon Column */}
                <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm h-fit space-y-4">
                    <h2 className="text-md font-bold text-[#1f5133] border-b border-[#efe9db] pb-3 font-serif">Create New Coupon</h2>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Coupon Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="e.g. WELCOME50"
                                className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm placeholder-gray-300 font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount Amount (₹)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="e.g. 150"
                                className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm placeholder-gray-300"
                            />
                        </div>
                        <button
                            onClick={handleCreateCoupon}
                            className="w-full bg-[#1f5133] hover:bg-[#163b26] text-white px-6 py-3 rounded-xl font-medium text-sm transition duration-200 shadow-sm"
                        >
                            Generate Coupon
                        </button>
                    </div>
                </div>

                {/* Existing Coupons Column */}
                <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm lg:col-span-2 space-y-4">
                    <h2 className="text-md font-bold text-[#1f5133] border-b border-[#efe9db] pb-3 font-serif">Existing Coupons</h2>
                    {(!data?.coupons || data.coupons.length === 0) ? (
                        <div className="text-center py-12 text-gray-400 font-medium">No coupons active at the moment.</div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-[#efe9db]">
                            <table className="min-w-full divide-y divide-[#efe9db] text-left">
                                <thead className="bg-[#f7f4ec]">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount Value</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created On</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#efe9db]">
                                    {data?.coupons.map((coupon) => (
                                        <tr key={coupon._id} className="hover:bg-[#f7f4ec]/35 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-gray-900 font-bold">{coupon.code}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">₹{coupon.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{dayjs(coupon.createdAt).format('DD MMM YYYY')}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => handleDeleteCoupon(coupon._id)}
                                                    className="inline-flex items-center gap-1.5 text-red-600 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-medium transition duration-200"
                                                >
                                                    <FaTrash size={10} /> Delete
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
        </div>
    );
};

export default AdminCoupons;

