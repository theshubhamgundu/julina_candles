import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShippingFast, FaEnvelope, FaLock } from 'react-icons/fa';
import { useShipperLoginMutation } from '../../redux/api/shipper.api';
import { notify } from '../../utils/util';
import { usePageSEO } from '../../hooks/usePageSEO';

const ShipperLogin: React.FC = () => {
    usePageSEO({
        title: 'Shipper Login | Julina Candles & Melts',
        description: 'Login to the Shipper Portal.',
        canonical: '/shipper/login',
        noIndex: true,
    });

    const navigate = useNavigate();
    const [login, { isLoading }] = useShipperLoginMutation();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            notify('Please enter email and password', 'error');
            return;
        }

        try {
            const response = await login(formData).unwrap();
            
            if (response.success && response.token) {
                localStorage.setItem('shipperToken', response.token);
                localStorage.setItem('shipperData', JSON.stringify(response.shipper));
                notify('Login successful!', 'success');
                navigate('/shipper/dashboard');
            }
        } catch (error: any) {
            notify(error?.data?.message || 'Login failed', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f7f4ec] to-white flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1f5133] text-white mb-4 shadow-lg">
                        <FaShippingFast size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-[#1f5133] font-serif mb-2">Shipper Portal</h1>
                    <p className="text-gray-600">Login to access your delivery dashboard</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-[#efe9db] p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400" size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="shipper@example.com"
                                    className="w-full pl-11 pr-4 py-3 border-2 border-[#efe9db] focus:border-[#1f5133] focus:ring-2 focus:ring-[#1f5133]/20 focus:outline-none rounded-xl transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="w-full pl-11 pr-4 py-3 border-2 border-[#efe9db] focus:border-[#1f5133] focus:ring-2 focus:ring-[#1f5133]/20 focus:outline-none rounded-xl transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1f5133] hover:bg-[#163b26] disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Logging in...' : 'Login to Portal'}
                        </button>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                        <strong>📧 First time login?</strong> Check your email for credentials sent by the admin.
                    </p>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-xs text-gray-400">
                        Powered by Julina Candles & Melts Logistics
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShipperLogin;

