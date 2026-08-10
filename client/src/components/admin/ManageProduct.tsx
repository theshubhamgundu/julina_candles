import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDeleteProductMutation, useFeatureProductMutation, useProductDetailsQuery, useUpdateProductMutation } from '../../redux/api/product.api';
import { CustomError } from '../../types/api-types';
import { notify } from '../../utils/util';
import SkeletonLoader from '../common/SkeletonLoader';
import dayjs from 'dayjs';
import BackButton from '../common/BackBtn';
import { FaTrash, FaStar, FaSave, FaBoxOpen } from 'react-icons/fa';
import { WeightVariant } from '../../utils/weightVariants';
import { uploadToCloudinary } from '../../utils/cloudinary';

const AdminManageProduct: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useProductDetailsQuery(productId!);

    const { createdAt, updatedAt } = data?.product || {
        createdAt: "",
        updatedAt: "",
    };

    const [priceUpdate, setPriceUpdate] = useState<number>(0);
    const [stockUpdate, setStockUpdate] = useState<number>(0);
    const [nameUpdate, setNameUpdate] = useState<string>('');
    const [categoryUpdate, setCategoryUpdate] = useState<string>('');
    const [photoUpdate, setPhotoUpdate] = useState<string>('');
    const [isFeatured, setIsFeatured] = useState<boolean>(false);
    const [descriptionUpdate, setDescriptionUpdate] = useState<string>('');
    const [variantsState, setVariantsState] = useState<WeightVariant[]>([]);

    const [updateProduct, { isLoading: isUpdating, isError: isUpdateError, error: updateError }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting, isError: isDeleteError, error: deleteError }] = useDeleteProductMutation();
    const [featureProduct, { isLoading: isFeaturing }] = useFeatureProductMutation();

    const handleVariantChange = (index: number, field: 'salePrice' | 'mrp' | 'inStock' | 'stock', value: number | boolean) => {
        const updated = [...variantsState];
        const updatedVariant = { ...updated[index] };
        if (field === 'stock' && typeof value === 'number') {
            updatedVariant.stock = value;
        } else if (field === 'inStock' && typeof value === 'boolean') {
            updatedVariant.inStock = value;
        } else if ((field === 'salePrice' || field === 'mrp') && typeof value === 'number') {
            (updatedVariant as any)[field] = value;
        }
        updated[index] = updatedVariant;
        setVariantsState(updated);
    };

    const [photoFileUpdate, setPhotoFileUpdate] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState<boolean>(false);

    const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];
        if (file) {
            setPhotoFileUpdate(file);
            const reader: FileReader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setPhotoUpdate(reader.result);
                }
            };
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!data || !data.product._id) {
            notify('Product not found', 'error');
            return;
        }

        try {
            let uploadedPhotoUrl = photoUpdate;
            if (photoFileUpdate) {
                setUploadingImage(true);
                const { url } = await uploadToCloudinary(photoFileUpdate);
                uploadedPhotoUrl = url;
            }

            const updateBody: Record<string, any> = {};
            if (nameUpdate) updateBody.name = nameUpdate;
            if (priceUpdate !== undefined) updateBody.price = priceUpdate;
            if (stockUpdate !== undefined) updateBody.stock = stockUpdate;
            if (categoryUpdate) updateBody.category = categoryUpdate;
            if (descriptionUpdate !== undefined) updateBody.description = descriptionUpdate;
            if (uploadedPhotoUrl) updateBody.photo = uploadedPhotoUrl;
            if (variantsState.length > 0) updateBody.variants = variantsState;

            const res = await updateProduct({
                productId: data.product._id,
                formData: updateBody as any,
            });

            if (res.error) {
                notify('Failed to update product', 'error');
            } else {
                notify('Product updated successfully', 'success');
                navigate('/admin/products');
            }
        } catch (err: any) {
            notify(err?.message || 'Failed to update product photo', 'error');
        } finally {
            setUploadingImage(false);
        }
    };

    useEffect(() => {
        if (isError && error) {
            const err = error as CustomError;
            notify(err.data.message, 'error');
        }
    }, [isError, error]);

    const deleteHandler = async (): Promise<void> => {
        if (!data || !data.product._id) {
            notify('Product not found', 'error');
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        const res = await deleteProduct({
            productId: data.product._id,
        });

        if (res.error) {
            notify('Failed to delete product', 'error');
        } else {
            notify('Product deleted successfully', 'success');
            navigate('/admin/products');
        }
    };

    // Populate form with REAL database values — NO hardcoded overrides
    useEffect(() => {
        if (data && data.product) {
            setNameUpdate(data.product.name || '');
            setCategoryUpdate(data.product.category || '');
            setPriceUpdate(data.product.price || 0);
            setStockUpdate(data.product.stock ?? 0);  // Preserve stock=0 from DB
            setDescriptionUpdate(data.product.description || '');
            setPhotoUpdate(data.product.photo || '/images/mainImage.png');
            setIsFeatured(data.product.featured || false);
            
            // Load variants from DB
            if (data.product.variants && Array.isArray(data.product.variants) && data.product.variants.length > 0) {
                setVariantsState(data.product.variants);
            } else {
                setVariantsState([]);
            }
        }
    }, [data]);

    useEffect(() => {
        if (isUpdateError && updateError) {
            const err = updateError as CustomError;
            notify(err.data.message, 'error');
        }
    }, [isUpdateError, updateError]);

    useEffect(() => {
        if (isDeleteError && deleteError) {
            const err = deleteError as CustomError;
            notify(err.data.message, 'error');
        }
    }, [isDeleteError, deleteError]);

    const handleFeatureToggle = async () => {
        if (!data || !data.product._id) {
            notify('Product not found', 'error');
            return;
        }

        try {
            await featureProduct({ productId: data.product._id }).unwrap();
            setIsFeatured(!isFeatured);
            notify('Product featured status updated successfully', 'success');
        } catch (error) {
            notify('Failed to update product featured status', 'error');
        }
    };

    if (isError) return <Navigate to="/404" />;

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm max-w-4xl mx-auto">
                <SkeletonLoader rows={8} />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <BackButton fallback="/admin/products" />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Left Column: Image preview and Info card */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="relative group rounded-2xl border border-[#efe9db] bg-[#f7f4ec]/30 overflow-hidden aspect-square flex items-center justify-center shadow-sm">
                            {photoUpdate ? (
                                <img src={photoUpdate} alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                                <span className="text-gray-400 font-medium">No Image Uploaded</span>
                            )}
                            <div className="absolute top-3 right-3">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    isFeatured ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-gray-150 text-gray-600'
                                }`}>
                                    {isFeatured ? '★ Featured' : 'Standard'}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#f7f4ec]/40 border border-[#efe9db]/50 space-y-3 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold uppercase tracking-wider">Created</span>
                                <span className="text-gray-800 font-medium">{dayjs(createdAt).format('DD MMM YYYY')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold uppercase tracking-wider">Last Update</span>
                                <span className="text-gray-800 font-medium">{dayjs(updatedAt).format('DD MMM YYYY')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold uppercase tracking-wider">Product ID</span>
                                <span className="text-gray-500 font-mono text-[10px] select-all">{data?.product?._id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold uppercase tracking-wider">DB Stock</span>
                                <span className={`font-bold ${stockUpdate <= 0 ? 'text-red-600' : stockUpdate < 5 ? 'text-orange-600' : 'text-green-700'}`}>
                                    {stockUpdate <= 0 ? 'Out of Stock' : `${stockUpdate} units`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form fields */}
                    <div className="flex-1 space-y-5">
                        <div>
                            <h2 className="text-xl font-serif font-bold text-[#1f5133] flex items-center gap-2">
                                <FaBoxOpen /> Product Details
                            </h2>
                            <p className="text-xs text-gray-400">Edit product details. All values are from the database — changes save directly to DB.</p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={nameUpdate}
                                    onChange={(e) => setNameUpdate(e.target.value)}
                                    className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm font-semibold"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Category</label>
                                    <select
                                        name="category"
                                        value={categoryUpdate}
                                        onChange={(e) => setCategoryUpdate(e.target.value)}
                                        className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm font-semibold bg-white"
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
                                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Stock Qty</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={stockUpdate}
                                            onChange={(e) => setStockUpdate(parseInt(e.target.value) || 0)}
                                            min="0"
                                            className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm font-semibold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Base Price (₹)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={priceUpdate}
                                            onChange={(e) => setPriceUpdate(parseFloat(e.target.value) || 0)}
                                            min="0"
                                            className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Variant Pricing — only shown if variants exist in DB */}
                            {variantsState.length > 0 && (
                              <div className="bg-[#faf6ee] p-4 rounded-xl border border-[#ede3cf] space-y-3">
                                <div className="flex justify-between items-center">
                                  <p className="text-xs font-bold text-[#185e33] uppercase tracking-wider">Weight Variant Pricing ({variantsState.length} variants)</p>
                                  <span className="text-[10px] text-[#185e33] font-semibold">Saved to Database</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                  {variantsState.map((variant, idx) => (
                                    <div key={variant.id} className={`bg-white p-3 rounded-xl border shadow-2xs space-y-2 ${
                                      variant.inStock === false ? 'border-red-200 bg-red-50/30' : 'border-[#ede3cf]'
                                    }`}>
                                      <div className="flex justify-between items-center border-b pb-1.5">
                                        <span className="font-bold text-gray-800 text-xs">{variant.label} Pack</span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] bg-[#185e33]/10 text-[#185e33] font-bold px-2 py-0.5 rounded-full">{variant.weightKg} kg</span>
                                          <button
                                            type="button"
                                            onClick={() => handleVariantChange(idx, 'inStock', variant.inStock === false ? true : false)}
                                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                                              variant.inStock === false
                                                ? 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200'
                                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                            }`}
                                          >
                                            {variant.inStock === false ? '✕ Out of Stock' : '✓ In Stock'}
                                          </button>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[9px] text-gray-400 font-bold uppercase">Sale Price (₹)</label>
                                          <input
                                            type="number"
                                            value={variant.salePrice}
                                            onChange={(e) => handleVariantChange(idx, 'salePrice', parseFloat(e.target.value) || 0)}
                                            className="w-full border border-gray-200 rounded-lg p-1.5 text-xs font-bold text-[#185e33]"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[9px] text-gray-400 font-bold uppercase">MRP (₹)</label>
                                          <input
                                            type="number"
                                            value={variant.mrp}
                                            onChange={(e) => handleVariantChange(idx, 'mrp', parseFloat(e.target.value) || 0)}
                                            className="w-full border border-gray-200 rounded-lg p-1.5 text-xs font-semibold text-gray-600"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-[9px] text-gray-400 font-bold uppercase">Stock Qty</label>
                                        <input
                                          type="number"
                                          value={variant.stock || 0}
                                          onChange={(e) => handleVariantChange(idx, 'stock', parseInt(e.target.value) || 0)}
                                          className="w-full border border-gray-200 rounded-lg p-1.5 text-xs font-bold text-[#185e33]"
                                          min="0"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Description</label>
                                <textarea
                                    name="description"
                                    value={descriptionUpdate}
                                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                                    rows={4}
                                    className="border border-[#efe9db] focus:border-[#1f5133] focus:ring-1 focus:ring-[#1f5133] focus:outline-none rounded-xl p-3 w-full text-sm placeholder-gray-300 resize-none font-sans"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block">Replace Image</label>
                                <label className="cursor-pointer inline-block bg-white border border-[#efe9db] text-secondary hover:bg-secondary/10 px-4 py-2.5 rounded-xl font-semibold text-xs transition shadow-sm select-none">
                                    Upload New Photo File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={changeImageHandler}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-6 border-t border-[#efe9db]">
                                <button
                                    type="button"
                                    onClick={deleteHandler}
                                    disabled={isDeleting}
                                    className="inline-flex items-center gap-1.5 text-red-600 border border-red-100 hover:bg-red-50 px-4 py-2.5 rounded-xl font-semibold text-xs transition select-none disabled:opacity-50"
                                >
                                    <FaTrash size={12} /> {isDeleting ? 'Deleting...' : 'Delete Product'}
                                </button>
                                
                                <div className="ml-auto flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleFeatureToggle}
                                        disabled={isFeaturing}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs border transition select-none disabled:opacity-50 ${
                                            isFeatured 
                                                ? 'text-amber-600 border-amber-100 hover:bg-amber-50' 
                                                : 'text-gray-600 border-gray-150 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaStar size={12} /> {isFeaturing ? 'Updating...' : isFeatured ? 'Remove Feature' : 'Spotlight Product'}
                                    </button>
                                    
                                    <button
                                        type="submit"
                                        disabled={isUpdating || uploadingImage}
                                        className="inline-flex items-center gap-1.5 bg-[#1f5133] hover:bg-[#163b26] text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition shadow-sm disabled:opacity-50"
                                    >
                                        <FaSave size={12} /> {uploadingImage ? 'Uploading Image...' : isUpdating ? 'Saving...' : 'Save Updates'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminManageProduct;

