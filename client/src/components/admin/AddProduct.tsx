import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewProductMutation } from '../../redux/api/product.api';
import { notify } from '../../utils/util';
import { CustomError } from '../../types/api-types';
import BackButton from '../common/BackBtn';
import { FaBoxOpen } from 'react-icons/fa';

const AdminAddProduct: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        stock: 0,
        price: 0,
        description: '',
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');

    const [newProduct, { isLoading, isError, error }] = useNewProductMutation();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setPhotoPreview(reader.result);
                }
            };
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.name || !formData.category || !formData.stock || !formData.price || !photoFile || !formData.description) {
            notify('Please fill all the fields', 'error');
            return;
        }

        const productFormData = new FormData();
        productFormData.append('name', formData.name);
        productFormData.append('category', formData.category.toLowerCase());
        productFormData.append('stock', formData.stock.toString());
        productFormData.append('price', formData.price.toString());
        productFormData.append('description', formData.description);
        if (photoFile) {
            productFormData.append('photo', photoFile);
        }

        try {
            await newProduct({ formData: productFormData }).unwrap();
            notify('Product added successfully', 'success');
            navigate('/admin/products');
        } catch (err) {
            const customError = err as CustomError;
            notify(customError.data.message, 'error');
        }
    };

    useEffect(() => {
        if (isError && error) {
            const customError = error as CustomError;
            notify(customError.data.message, 'error');
        }
    }, [isError, error]);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <BackButton fallback="/admin/products" />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm space-y-6">
                <div className="border-b border-[#efe9db] pb-4">
                    <h2 className="text-xl font-serif font-bold text-[#1f5133] flex items-center gap-2">
                        <FaBoxOpen /> Add New Product
                    </h2>
                    <p className="text-xs text-gray-400">Fill in details and upload an image to catalog a new product.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Organic Honey"
                            className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm placeholder-gray-300"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g. Fruits, Honey, Dairy"
                                className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm placeholder-gray-300"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Stock qty</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Provide a detailed description of the product, its origin, and organic qualities."
                            className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm placeholder-gray-300 resize-none font-sans"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block">Product Photo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[#efe9db] bg-[#f7f4ec]/30 flex items-center justify-center overflow-hidden">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] text-gray-400 font-medium text-center px-1">No Image Selected</span>
                                )}
                            </div>
                            <label className="cursor-pointer bg-white border border-[#efe9db] text-secondary hover:bg-secondary/10 px-4 py-2.5 rounded-xl font-semibold text-xs transition shadow-sm select-none">
                                Choose Photo File
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#efe9db]">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="px-5 py-2.5 bg-cream2 hover:bg-[#efe9db] text-gray-700 rounded-xl font-semibold text-sm transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center bg-[#1f5133] hover:bg-[#163b26] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50"
                        >
                            {isLoading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddProduct;

