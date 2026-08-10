import React, { useState } from 'react';
import { FaPlus, FaTimes, FaUserShield, FaTrash, FaBan, FaCheck, FaCopy } from 'react-icons/fa';
import { useCreateShipperMutation, useAllShippersQuery, useUpdateShipperStatusMutation, useDeleteShipperMutation } from '../../redux/api/shipper.api';
import { notify } from '../../utils/util';

const AdminShippers: React.FC = () => {
    const { data, isLoading, refetch } = useAllShippersQuery('');
    const [createShipper] = useCreateShipperMutation();
    const [updateStatus] = useUpdateShipperStatusMutation();
    const [deleteShipper] = useDeleteShipperMutation();

    const [showModal, setShowModal] = useState(false);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [newShipperCredentials, setNewShipperCredentials] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company_name: '',
        address: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateShipper = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            notify('Name and email are required', 'error');
            return;
        }

        try {
            const response: any = await createShipper(formData).unwrap();
            notify('Shipper created successfully!', 'success');
            setShowModal(false);
            setNewShipperCredentials(response.shipper);
            setShowCredentialsModal(true);
            setFormData({ name: '', email: '', phone: '', company_name: '', address: '' });
            refetch();
        } catch (error: any) {
            notify(error?.data?.message || 'Failed to create shipper', 'error');
        }
    };

    const handleUpdateStatus = async (shipperId: string, status: string) => {
        try {
            await updateStatus({ shipperId, status }).unwrap();
            notify(`Shipper status updated to ${status}`, 'success');
            refetch();
        } catch (error) {
            notify('Failed to update status', 'error');
        }
    };

    const handleDeleteShipper = async (shipperId: string) => {
        if (!window.confirm('Are you sure you want to delete this shipper?')) return;

        try {
            await deleteShipper(shipperId).unwrap();
            notify('Shipper deleted successfully', 'success');
            refetch();
        } catch (error) {
            notify('Failed to delete shipper', 'error');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        notify('Copied to clipboard', 'success');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-50 text-green-700 border border-green-200';
            case 'inactive':
                return 'bg-gray-50 text-gray-700 border border-gray-200';
            case 'suspended':
                return 'bg-red-50 text-red-700 border border-red-200';
            default:
                return 'bg-gray-50 text-gray-600 border border-gray-200';
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[400px]"><div className="loader"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#1f5133] font-serif">Shipper Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage delivery partners and their access</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-[#1f5133] hover:bg-[#163b26] text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
                >
                    <FaPlus size={14} /> Add Shipper
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#efe9db] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#efe9db]">
                        <thead className="bg-[#f7f4ec]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Shipper Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#efe9db]">
                            {data?.shippers && data.shippers.length > 0 ? (
                                data.shippers.map((shipper: any) => (
                                    <tr key={shipper.id} className="hover:bg-[#f7f4ec]/35 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#1f5133] flex items-center justify-center text-white font-bold">
                                                    <FaUserShield size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{shipper.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{shipper.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{shipper.phone || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{shipper.company_name || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadge(shipper.status)}`}>
                                                {shipper.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {shipper.status === 'active' ? (
                                                    <button
                                                        onClick={() => handleUpdateStatus(shipper.id, 'suspended')}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Suspend"
                                                    >
                                                        <FaBan size={16} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateStatus(shipper.id, 'active')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                        title="Activate"
                                                    >
                                                        <FaCheck size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteShipper(shipper.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No shippers found. Add your first shipper to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Shipper Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-[#efe9db]">
                        <div className="flex items-center justify-between mb-4 border-b border-[#efe9db] pb-3">
                            <h3 className="text-lg font-bold text-[#1f5133] font-serif">Add New Shipper</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateShipper} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Company Name</label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleInputChange}
                                    className="w-full border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 text-sm"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium text-sm transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#1f5133] text-white hover:bg-[#163b26] px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-sm"
                                >
                                    Create Shipper
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Credentials Modal */}
            {showCredentialsModal && newShipperCredentials && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#efe9db]">
                        <div className="text-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                <FaCheck className="text-green-600" size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1f5133] font-serif">Shipper Created Successfully!</h3>
                            <p className="text-sm text-gray-600 mt-2">Login credentials have been generated and sent via email.</p>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                            <p className="text-xs text-amber-800 mb-3 font-semibold">⚠️ Save these credentials - they won't be shown again!</p>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">Email</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newShipperCredentials.email}
                                            readOnly
                                            className="flex-1 bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm font-mono"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(newShipperCredentials.email)}
                                            className="p-2 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition"
                                        >
                                            <FaCopy size={14} className="text-amber-700" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">Password</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newShipperCredentials.generatedPassword}
                                            readOnly
                                            className="flex-1 bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-red-600"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(newShipperCredentials.generatedPassword)}
                                            className="p-2 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition"
                                        >
                                            <FaCopy size={14} className="text-amber-700" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowCredentialsModal(false);
                                setNewShipperCredentials(null);
                            }}
                            className="w-full bg-[#1f5133] text-white hover:bg-[#163b26] px-4 py-2.5 rounded-xl font-medium text-sm transition"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShippers;

