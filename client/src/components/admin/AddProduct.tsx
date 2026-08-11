import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewProductMutation } from '../../redux/api/product.api';
import { notify } from '../../utils/util';
import { CustomError } from '../../types/api-types';
import BackButton from '../common/BackBtn';
import { uploadToCloudinary } from '../../utils/cloudinary';
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

    const [variants, setVariants] = useState<Array<any>>([]);
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

    const addVariant = () => {
        setVariants(prev => ([...prev, { id: Date.now().toString(), name: '', price: 0, bulkPrice: 0, bulkMOQ: 0, pack: '' }]));
    };

    const SIZE_PRESETS: Record<string, Array<any>> = {
        'Festive Urli Candles': [
            { name: 'Single', price: 250 },
            { name: 'Medium (250g)', price: 450 },
            { name: 'Pack of 12', price: 4800, bulkPrice: 4000, bulkMOQ: 12 },
        ],
        'Floral Candles': [
            { name: 'Single', price: 199 },
            { name: 'Pair', price: 350 },
        ],
        'Glass Jar Candles': [
            { name: 'Small', price: 299 },
            { name: 'Large', price: 599 },
        ],
    };

    const loadPresetForCategory = () => {
        const cat = formData.category;
        const presets = SIZE_PRESETS[cat] || [];
        if (presets.length === 0) {
            notify('No presets available for this category', 'error');
            return;
        }
        const toAdd = presets.map(p => ({ id: Date.now().toString() + Math.random().toString(36).slice(2,6), ...p }));
        setVariants(prev => ([...prev, ...toAdd]));
    };

    const updateVariant = (id: string, field: string, value: any) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const removeVariant = (id: string) => {
        setVariants(prev => prev.filter(v => v.id !== id));
    };

    const [uploadingImage, setUploadingImage] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Require either a top-level price or at least one variant with price
        const hasValidVariant = variants.length > 0 && variants.some(v => Number(v.price) > 0);

        if (!formData.name || !formData.category || !formData.stock || (!formData.price && !hasValidVariant) || !photoFile || !formData.description) {
            notify('Please fill all the fields and provide either a main price or one variant with price', 'error');
            return;
        }

        try {
            setUploadingImage(true);
            const { url: cloudinaryUrl } = await uploadToCloudinary(photoFile);

            const productData = {
                name: formData.name,
                category: formData.category,
                stock: Number(formData.stock),
                price: Number(formData.price || 0),
                description: formData.description,
                photo: cloudinaryUrl,
                variants: variants.map((v: any) => ({ name: v.name, price: Number(v.price), bulkPrice: v.bulkPrice ? Number(v.bulkPrice) : undefined, bulkMOQ: v.bulkMOQ ? Number(v.bulkMOQ) : undefined, pack: v.pack }))
            };

            await newProduct({ productData }).unwrap();
            notify('Product added successfully', 'success');
            navigate('/admin/products');
        } catch (err: any) {
            const customError = err as CustomError;
            notify(customError?.data?.message || err?.message || 'Failed to add product', 'error');
        } finally {
            setUploadingImage(false);
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
                            <select
                                name="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm bg-white"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Festive Urli Candles">Festive Urli Candles</option>
                                <option value="Wooden Dough Bowl Candles">Wooden Dough Bowl Candles</option>
                                <option value="Mithai Candles">Mithai Candles</option>
                                <option value="Floral Candles">Floral Candles</option>
                                <option value="Glass Jar Candles">Glass Jar Candles</option>
                                <option value="Fragrances">Fragrances</option>
                            </select>
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

                    {/* Variants Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Variants / Sizes</label>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={addVariant} className="text-xs px-3 py-1 rounded-lg bg-white border border-[#efe9db] hover:bg-[#f7f4ec]">Add Variant</button>
                                <button type="button" onClick={loadPresetForCategory} className="text-xs px-3 py-1 rounded-lg bg-white border border-[#efe9db] hover:bg-[#f7f4ec]">Load Preset Sizes</button>
                            </div>
                        </div>

                        {variants.length === 0 ? (
                            <div className="text-sm text-gray-500">No variants added — you can keep a single price or add multiple sizes/packs with individual rates and MOQ.</div>
                        ) : (
                            <div className="space-y-3">
                                {variants.map((v) => (
                                    <div key={v.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end bg-white p-3 border border-[#efe9db] rounded-xl">
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-semibold text-gray-500">Size / Label</label>
                                            <input type="text" value={v.name} onChange={(e) => updateVariant(v.id, 'name', e.target.value)} className="w-full p-2 rounded-xl border border-[#efe9db] text-sm" placeholder="e.g. 250g, Single, Pack of 12" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-gray-500">Price (₹)</label>
                                            <input type="number" value={v.price} onChange={(e) => updateVariant(v.id, 'price', e.target.value)} className="w-full p-2 rounded-xl border border-[#efe9db] text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-gray-500">Bulk Price (₹)</label>
                                            <input type="number" value={v.bulkPrice} onChange={(e) => updateVariant(v.id, 'bulkPrice', e.target.value)} className="w-full p-2 rounded-xl border border-[#efe9db] text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold text-gray-500">MOQ</label>
                                            <input type="number" value={v.bulkMOQ} onChange={(e) => updateVariant(v.id, 'bulkMOQ', e.target.value)} className="w-full p-2 rounded-xl border border-[#efe9db] text-sm" />
                                        </div>
                                        <div className="flex items-center gap-2 md:col-span-1">
                                            <button type="button" onClick={() => removeVariant(v.id)} className="text-xs px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                            disabled={isLoading || uploadingImage}
                            className="flex items-center bg-[#1f5133] hover:bg-[#163b26] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50"
                        >
                            {uploadingImage ? 'Uploading Image to Cloudinary...' : isLoading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddProduct;

