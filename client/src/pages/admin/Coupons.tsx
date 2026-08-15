import React, { useMemo, useState } from 'react';
import { useGetAllCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation } from '../../redux/api/coupon.api';
import { notify } from '../../utils/util';
import dayjs from 'dayjs';
import { 
  FaTicketAlt, 
  FaTrash, 
  FaCopy, 
  FaCheck, 
  FaMagic, 
  FaSearch, 
  FaRupeeSign, 
  FaPlus 
} from 'react-icons/fa';

const AdminCoupons: React.FC = () => {
  const { data, refetch, isLoading: isFetchingCoupons, isError: fetchError } = useGetAllCouponsQuery();
  const [createCoupon] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coupons = useMemo(() => data?.coupons || [], [data]);

  const generateRandomCode = () => {
    const prefixes = ['JULINA', 'FESTIVE', 'SPECIAL', 'SPARKLE', 'CANDLE'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setCode(`${randomPrefix}${randomNum}`);
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    notify(`Coupon code '${couponCode}' copied!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !amount || Number(amount) <= 0) {
      notify('Please enter a valid coupon code and discount amount', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const trimmedCode = code.trim().toUpperCase();
      await createCoupon({ code: trimmedCode, amount: Number(amount) }).unwrap();
      notify(`Coupon '${trimmedCode}' created successfully`, 'success');
      setCode('');
      setAmount('');
      refetch();
    } catch (error: any) {
      notify(error?.data?.message || 'Failed to create coupon', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (window.confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) {
      try {
        await deleteCoupon(id).unwrap();
        notify(`Coupon '${couponCode}' deleted`, 'success');
        refetch();
      } catch (error) {
        notify('Failed to delete coupon', 'error');
      }
    }
  };

  const filteredCoupons = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return coupons;
    return coupons.filter(c => c.code?.toLowerCase().includes(q));
  }, [coupons, searchQuery]);

  if (isFetchingCoupons) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loader"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-[#efe9db] text-center shadow-sm max-w-md mx-auto my-12">
        <p className="text-red-500 font-semibold mb-2">Error loading coupons.</p>
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
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#185e33]">Coupon & Promo Codes</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Create promotional discount codes for customer checkouts and marketing campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Coupon Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#efe9db] shadow-sm space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-[#efe9db] pb-4">
            <h2 className="text-base font-bold text-[#185e33] font-serif">Create New Promo</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A56] bg-[#C79A56]/10 px-2.5 py-1 rounded-full">
              Checkout Discount
            </span>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  Coupon Code
                </label>
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="text-[10px] font-bold text-[#C79A56] hover:text-[#b38543] flex items-center gap-1"
                >
                  <FaMagic /> Suggest Code
                </button>
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FESTIVE100"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede3cf] text-sm focus:outline-none focus:ring-2 focus:ring-[#185e33]/20 bg-[#faf6ee] font-mono uppercase font-bold tracking-wider placeholder-gray-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Discount Amount (₹ Flat Off)
              </label>
              <div className="relative">
                <FaRupeeSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#ede3cf] text-sm focus:outline-none focus:ring-2 focus:ring-[#185e33]/20 bg-[#faf6ee] placeholder-gray-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#185e33] hover:bg-[#134b28] text-white px-5 py-3 rounded-xl font-bold text-xs transition shadow-md shadow-[#185e33]/20 flex items-center justify-center gap-2"
            >
              <FaPlus /> Create Coupon
            </button>
          </form>
        </div>

        {/* Coupon List Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#efe9db] shadow-sm flex items-center gap-3">
            <FaSearch className="text-gray-400 text-sm pl-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active coupon codes..."
              className="flex-1 text-xs bg-transparent focus:outline-none placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* List Card */}
          <div className="bg-white rounded-3xl border border-[#efe9db] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#efe9db] flex items-center justify-between">
              <h3 className="font-serif font-bold text-[#185e33] text-base">
                Active Promo Codes ({filteredCoupons.length})
              </h3>
            </div>

            {filteredCoupons.length === 0 ? (
              <div className="text-center py-14 px-4">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-[#C79A56] text-xl flex items-center justify-center mx-auto mb-2.5">
                  <FaTicketAlt />
                </div>
                <p className="text-gray-900 font-semibold text-sm mb-1">No coupons available</p>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Create a new promotional code on the left to offer customer checkout discounts.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#efe9db]">
                {filteredCoupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="p-5 flex items-center justify-between gap-4 hover:bg-[#faf6ee]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#C79A56]/10 text-[#C79A56] flex items-center justify-center text-lg shrink-0 border border-[#C79A56]/20">
                        <FaTicketAlt />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900 text-sm tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            className="p-1 rounded text-gray-400 hover:text-[#185e33] transition"
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <FaCheck className="text-emerald-600 text-xs" />
                            ) : (
                              <FaCopy className="text-xs" />
                            )}
                          </button>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          Created {coupon.createdAt ? dayjs(coupon.createdAt).format('DD MMM YYYY') : 'Recently'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-serif font-bold text-emerald-700 text-sm">
                        ₹{Number(coupon.amount).toFixed(2)} OFF
                      </span>
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition text-xs"
                        title="Delete coupon"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
