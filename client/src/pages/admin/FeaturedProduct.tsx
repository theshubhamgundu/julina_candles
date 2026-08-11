import React, { useEffect, useState } from 'react';
import { useGetAllFeaturedProductsQuery, useFeatureProductMutation } from '../../redux/api/product.api';
import { Product } from '../../types/api-types';
import { FaStar, FaTrash } from 'react-icons/fa';

const AdminFeaturedProducts: React.FC = () => {
    const { data, isLoading } = useGetAllFeaturedProductsQuery('');
    const [featureProduct] = useFeatureProductMutation();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (data && data.products) {
            setProducts(data.products);
        }
    }, [data]);

    const handleFeatureToggle = async (productId: string) => {
        try {
            await featureProduct({ productId }).unwrap();
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error updating featured status', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-serif font-bold text-[#1f5133] flex items-center gap-2">
                    <FaStar className="text-secondary" /> Featured Products
                </h1>
                <p className="text-xs text-gray-400">Manage products that are displayed in the spotlight section of your homepage.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm">
                {products.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-medium">No featured products currently active.</div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-[#efe9db]">
                        <table className="min-w-full divide-y divide-[#efe9db] text-left">
                            <thead className="bg-[#f7f4ec]">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#efe9db]">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-[#f7f4ec]/35 transition-colors">
                                        <td className="px-6 py-4">
                                            <img 
                                                src={product.photo} 
                                                alt={product.name} 
                                                className="w-12 h-12 object-cover rounded-xl border border-[#efe9db] shadow-sm hover:scale-105 transition-transform duration-200" 
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-500 text-xs">{product._id}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleFeatureToggle(product._id)}
                                                className="inline-flex items-center gap-1.5 text-red-600 border border-red-100 hover:bg-red-50 px-3.5 py-1.5 rounded-lg text-xs font-medium transition duration-200"
                                            >
                                                <FaTrash size={10} /> Remove
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

export default AdminFeaturedProducts;

