import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { 
  useDeleteProductMutation, 
  useFeatureProductMutation, 
  useProductDetailsQuery, 
  useUpdateProductMutation 
} from '../../redux/api/product.api';
import { notify } from '../../utils/util';
import SkeletonLoader from '../common/SkeletonLoader';
import dayjs from 'dayjs';
import BackButton from '../common/BackBtn';
import { 
  FaTrash, 
  FaStar, 
  FaSave, 
  FaBoxOpen, 
  FaPlus, 
  FaCopy, 
  FaMagic, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaLayerGroup,
  FaUpload,
  FaExternalLinkAlt,
  FaRupeeSign
} from 'react-icons/fa';
import { uploadToCloudinary } from '../../utils/cloudinary';

export interface CandleVariantItem {
  id: string;
  name: string;
  label: string;
  salePrice: number;
  price?: number;
  mrp: number;
  stock: number;
  inStock: boolean;
  pack?: string;
}

const CANDLE_PRESETS = [
  {
    category: 'Packs & Sets',
    icon: '📦',
    items: [
      { name: 'Single Candle', label: 'Single', mrp: 299, salePrice: 249, stock: 50 },
      { name: 'Set of 2 Candles', label: 'Pack of 2', mrp: 550, salePrice: 450, stock: 30 },
      { name: 'Gift Box (Set of 4)', label: 'Pack of 4', mrp: 1100, salePrice: 850, stock: 20 },
      { name: 'Festive Hamper (Set of 12)', label: 'Pack of 12', mrp: 3000, salePrice: 2200, stock: 10 },
    ]
  },
  {
    category: 'Urli & Bowl Sizes',
    icon: '🏺',
    items: [
      { name: 'Small Urli (1 Wick / 150g)', label: 'Small (150g)', mrp: 249, salePrice: 199, stock: 40 },
      { name: 'Medium Urli (2 Wicks / 300g)', label: 'Medium (300g)', mrp: 399, salePrice: 299, stock: 25 },
      { name: 'Grand Urli (4 Wicks / 600g)', label: 'Large (600g)', mrp: 749, salePrice: 549, stock: 15 },
    ]
  },
  {
    category: 'Glass Jar Sizes',
    icon: '🫙',
    items: [
      { name: 'Travel Tin (100g)', label: '100g Tin', mrp: 199, salePrice: 149, stock: 50 },
      { name: 'Standard Frosted Jar (200g)', label: '200g Jar', mrp: 349, salePrice: 249, stock: 35 },
      { name: 'Luxury 3-Wick Jar (450g)', label: '450g Luxury', mrp: 699, salePrice: 499, stock: 20 },
    ]
  }
];

const AdminManageProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useProductDetailsQuery(productId!);

  const { createdAt, updatedAt } = data?.product || {
    createdAt: "",
    updatedAt: "",
  };

  const [nameUpdate, setNameUpdate] = useState<string>('');
  const [categoryUpdate, setCategoryUpdate] = useState<string>('');
  const [priceUpdate, setPriceUpdate] = useState<number>(0);
  const [stockUpdate, setStockUpdate] = useState<number>(0);
  const [descriptionUpdate, setDescriptionUpdate] = useState<string>('');
  const [photoUpdate, setPhotoUpdate] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [variantsState, setVariantsState] = useState<CandleVariantItem[]>([]);

  const [photoFileUpdate, setPhotoFileUpdate] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [featureProduct, { isLoading: isFeaturing }] = useFeatureProductMutation();

  // Populate state from product data
  useEffect(() => {
    if (data && data.product) {
      const p = data.product;
      setNameUpdate(p.name || '');
      setCategoryUpdate(p.category || 'Festive Urli Candles');
      setPriceUpdate(p.price || 0);
      setStockUpdate(p.stock ?? 0);
      setDescriptionUpdate(p.description || '');
      setPhotoUpdate(p.photo || '/images/mainImage.png');
      setIsFeatured(p.featured || false);

      if (p.variants && Array.isArray(p.variants) && p.variants.length > 0) {
        const normalized: CandleVariantItem[] = p.variants.map((v: any, index: number) => ({
          id: v.id || `var_${index}_${Date.now()}`,
          name: v.name || v.label || `Option ${index + 1}`,
          label: v.label || v.name || `Option ${index + 1}`,
          salePrice: Number(v.salePrice || v.price || p.price || 0),
          price: Number(v.salePrice || v.price || p.price || 0),
          mrp: Number(v.mrp || (v.salePrice ? Math.round(v.salePrice * 1.25) : p.price)),
          stock: Number(v.stock ?? p.stock ?? 20),
          inStock: v.inStock !== false,
          pack: v.pack || v.label
        }));
        setVariantsState(normalized);
      } else {
        setVariantsState([]);
      }
    }
  }, [data]);

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

  // Variant operations
  const addCustomVariant = () => {
    const newVar: CandleVariantItem = {
      id: Date.now().toString(),
      name: `Size ${variantsState.length + 1}`,
      label: `Size ${variantsState.length + 1}`,
      salePrice: Number(priceUpdate || 199),
      price: Number(priceUpdate || 199),
      mrp: Number(priceUpdate ? Number(priceUpdate) * 1.25 : 249),
      stock: 25,
      inStock: true
    };
    setVariantsState(prev => [...prev, newVar]);
  };

  const loadPresetGroup = (presetItems: any[]) => {
    const newItems: CandleVariantItem[] = presetItems.map(p => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      name: p.name,
      label: p.label || p.name,
      salePrice: p.salePrice,
      price: p.salePrice,
      mrp: p.mrp || Math.round(p.salePrice * 1.25),
      stock: p.stock || 30,
      inStock: true,
      pack: p.label
    }));
    setVariantsState(prev => [...prev, ...newItems]);
    notify(`Added ${presetItems.length} variant sizes!`, 'success');
  };

  const duplicateVariant = (index: number) => {
    const target = variantsState[index];
    const duplicated: CandleVariantItem = {
      ...target,
      id: Date.now().toString(),
      name: `${target.name} (Copy)`,
      label: `${target.label} (Copy)`,
    };
    setVariantsState(prev => [...prev, duplicated]);
    notify('Variant duplicated', 'success');
  };

  const updateVariant = (index: number, field: keyof CandleVariantItem, value: any) => {
    setVariantsState(prev => {
      const updated = [...prev];
      const current = { ...updated[index] };
      (current as any)[field] = value;
      if (field === 'salePrice') {
        current.price = Number(value);
      }
      if (field === 'name' && !current.label) {
        current.label = value;
      }
      updated[index] = current;
      return updated;
    });
  };

  const removeVariant = (index: number) => {
    setVariantsState(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
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

      const formattedVariants = variantsState.map(v => ({
        id: v.id,
        name: v.name.trim() || v.label.trim(),
        label: v.label.trim() || v.name.trim(),
        salePrice: Number(v.salePrice || 0),
        price: Number(v.salePrice || 0),
        mrp: Number(v.mrp || v.salePrice || 0),
        stock: Number(v.stock || 0),
        inStock: v.inStock !== false,
        pack: v.pack || v.label
      }));

      let calculatedBasePrice = Number(priceUpdate || 0);
      let calculatedTotalStock = Number(stockUpdate || 0);

      if (formattedVariants.length > 0) {
        const prices = formattedVariants.map(v => v.salePrice);
        calculatedBasePrice = Math.min(...prices);
        calculatedTotalStock = formattedVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
      }

      const updateBody: Record<string, any> = {
        name: nameUpdate.trim(),
        category: categoryUpdate,
        price: calculatedBasePrice,
        stock: calculatedTotalStock,
        description: descriptionUpdate.trim(),
        photo: uploadedPhotoUrl,
        variants: formattedVariants
      };

      const res = await updateProduct({
        productId: data.product._id,
        formData: updateBody as any,
      });

      if (res.error) {
        notify('Failed to update product', 'error');
      } else {
        notify('Product & variants updated successfully!', 'success');
        refetch();
        navigate('/admin/products');
      }
    } catch (err: any) {
      notify(err?.message || 'Failed to update product', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteHandler = async (): Promise<void> => {
    if (!data || !data.product._id) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${nameUpdate}"?`)) return;

    const res = await deleteProduct({ productId: data.product._id });
    if (res.error) {
      notify('Failed to delete product', 'error');
    } else {
      notify('Product deleted successfully', 'success');
      navigate('/admin/products');
    }
  };

  const handleFeatureToggle = async () => {
    if (!data || !data.product._id) return;
    try {
      await featureProduct({ productId: data.product._id }).unwrap();
      setIsFeatured(!isFeatured);
      notify('Product featured status updated', 'success');
    } catch (error) {
      notify('Failed to toggle featured status', 'error');
    }
  };

  if (isError) return <Navigate to="/404" />;

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-[#efe9db] shadow-sm max-w-4xl mx-auto">
        <SkeletonLoader rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <BackButton fallback="/admin/products" />
        <a
          href={`/product/${data?.product?._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#185E33] hover:text-[#C79A56] flex items-center gap-1.5 transition"
        >
          <span>View on Live Store</span> <FaExternalLinkAlt className="text-[10px]" />
        </a>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#efe9db] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column: Image preview & Meta */}
          <div className="w-full md:w-1/3 space-y-4">
            <div className="relative group rounded-2xl border border-[#efe9db] bg-[#faf6ee] overflow-hidden aspect-square flex items-center justify-center shadow-xs">
              <img 
                src={photoUpdate} 
                alt={nameUpdate} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389845/julina_candles/products/handicraf_lotus_pond.png';
                }}
              />
              <div className="absolute top-3 right-3">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isFeatured ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-gray-150 text-gray-600'
                }`}>
                  {isFeatured ? '★ Featured' : 'Standard'}
                </span>
              </div>
            </div>

            {/* Replace Image Button */}
            <div>
              <label className="cursor-pointer block text-center bg-[#FAF6EE] hover:bg-[#EDE3CF] text-[#185E33] border border-[#EDE3CF] px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-2xs">
                <FaUpload className="inline mr-2" /> Upload New Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={changeImageHandler}
                  className="hidden"
                />
              </label>
            </div>

            {/* Metadata Card */}
            <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#ede3cf]/60 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Created</span>
                <span className="text-gray-700 font-medium">{dayjs(createdAt).format('DD MMM YYYY')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Last Update</span>
                <span className="text-gray-700 font-medium">{dayjs(updatedAt).format('DD MMM YYYY')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Total Stock</span>
                <span className={`font-bold ${stockUpdate <= 0 ? 'text-rose-600' : stockUpdate < 10 ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {stockUpdate <= 0 ? 'Out of Stock' : `${stockUpdate} units`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Variants</span>
                <span className="font-bold text-[#185E33]">{variantsState.length} active sizes</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form fields */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#185E33] flex items-center gap-2">
                <FaBoxOpen /> Edit Product & Multi-Sizes
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Update candle title, category, description, and manage all size options & pricing.
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600 tracking-wider">Product Name</label>
                <input
                  type="text"
                  value={nameUpdate}
                  onChange={(e) => setNameUpdate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ede3cf] text-sm focus:outline-none focus:ring-2 focus:ring-[#185e33]/20 bg-[#faf6ee] font-semibold text-gray-900"
                  required
                />
              </div>

              {/* Category & Base Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-600 tracking-wider">Category</label>
                  <select
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ede3cf] text-sm focus:outline-none focus:ring-2 focus:ring-[#185e33]/20 bg-[#faf6ee] font-semibold text-gray-900"
                    required
                  >
                    <option value="Festive Urli Candles">Festive Urli Candles</option>
                    <option value="Floral Candles">Floral Candles</option>
                    <option value="Glass Jar Candles">Glass Jar Candles</option>
                    <option value="Mithai Candles">Mithai Candles</option>
                    <option value="Wooden Dough Bowl Candles">Wooden Dough Bowl Candles</option>
                    <option value="Fragrances">Fragrances</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-600 tracking-wider">
                    Base Price (₹) {variantsState.length > 0 && <span className="text-[10px] text-gray-400 font-normal lowercase">(auto lowest variant)</span>}
                  </label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="number"
                      value={priceUpdate}
                      onChange={(e) => setPriceUpdate(parseFloat(e.target.value) || 0)}
                      disabled={variantsState.length > 0}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#ede3cf] text-sm focus:outline-none focus:ring-2 focus:ring-[#185e33]/20 bg-[#faf6ee] font-semibold text-gray-900 disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600 tracking-wider">Description</label>
                <textarea
                  value={descriptionUpdate}
                  onChange={(e) => setDescriptionUpdate(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ede3cf] text-sm focus:outline-none focus:ring-2 focus:ring-[#185e33]/20 bg-[#faf6ee] text-gray-800 resize-none"
                />
              </div>

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* CANDLE SIZE & MULTI-VARIANTS MANAGER */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <div className="border border-[#C79A56]/40 bg-[#FAF7F2] p-5 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C79A56]/20 pb-3">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#185E33] flex items-center gap-2">
                      <FaLayerGroup className="text-[#C79A56]" /> Size & Pack Variants ({variantsState.length})
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Configure multi-sizes, burn times, or packaging options with distinct prices.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addCustomVariant}
                    className="bg-[#185E33] hover:bg-[#134B28] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <FaPlus className="text-[10px]" /> Add Size
                  </button>
                </div>

                {/* Preset Suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FaMagic className="text-[#C79A56]" /> 1-Click Quick Size Templates:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CANDLE_PRESETS.map((preset) => (
                      <button
                        key={preset.category}
                        type="button"
                        onClick={() => loadPresetGroup(preset.items)}
                        className="bg-white hover:bg-[#185E33] hover:text-white text-gray-800 border border-[#EDE3CF] px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 shadow-2xs group"
                      >
                        <span>{preset.icon}</span>
                        <span>{preset.category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variants List */}
                {variantsState.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-[#EDE3CF] p-6 text-center space-y-1">
                    <p className="text-xs font-semibold text-gray-700">No multi-sizes configured.</p>
                    <p className="text-[10px] text-gray-400">
                      Product is selling at single base price ₹{priceUpdate}. Click "+ Add Size" to offer choices.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {variantsState.map((v, idx) => {
                      const discount = v.mrp > v.salePrice 
                        ? Math.round(((v.mrp - v.salePrice) / v.mrp) * 100) 
                        : 0;

                      return (
                        <div
                          key={v.id || idx}
                          className={`bg-white rounded-2xl border p-3.5 transition-all shadow-2xs space-y-3 ${
                            !v.inStock ? 'border-rose-200 bg-rose-50/20' : 'border-[#EDE3CF]'
                          }`}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#C79A56]/20 text-[#185E33] font-bold flex items-center justify-center text-[10px]">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-gray-900 text-xs">
                                {v.name || `Variant ${idx + 1}`}
                              </span>
                              {discount > 0 && (
                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.2 rounded-full border border-emerald-200">
                                  {discount}% OFF
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* In Stock toggle */}
                              <button
                                type="button"
                                onClick={() => updateVariant(idx, 'inStock', !v.inStock)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition flex items-center gap-1 ${
                                  v.inStock
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                }`}
                              >
                                {v.inStock ? <FaCheckCircle /> : <FaTimesCircle />}
                                <span>{v.inStock ? 'In Stock' : 'Out of Stock'}</span>
                              </button>

                              {/* Duplicate */}
                              <button
                                type="button"
                                onClick={() => duplicateVariant(idx)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                                title="Duplicate"
                              >
                                <FaCopy className="text-xs" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => removeVariant(idx)}
                                className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Remove"
                              >
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          </div>

                          {/* Variant Inputs */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                            <div className="col-span-2 sm:col-span-1 space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400">Size / Pack Label</label>
                              <input
                                type="text"
                                value={v.name}
                                onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#185E33]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400">Selling (₹)</label>
                              <input
                                type="number"
                                min="1"
                                value={v.salePrice}
                                onChange={(e) => updateVariant(idx, 'salePrice', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#185E33] focus:outline-none focus:border-[#185E33]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400">MRP (₹)</label>
                              <input
                                type="number"
                                min="1"
                                value={v.mrp}
                                onChange={(e) => updateVariant(idx, 'mrp', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 focus:outline-none focus:border-[#185E33]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400">Stock Qty</label>
                              <input
                                type="number"
                                min="0"
                                value={v.stock}
                                onChange={(e) => updateVariant(idx, 'stock', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#185E33]"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#efe9db]">
                <button
                  type="button"
                  onClick={deleteHandler}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 text-rose-600 border border-rose-200 hover:bg-rose-50 px-4 py-2.5 rounded-xl font-bold text-xs transition disabled:opacity-50"
                >
                  <FaTrash /> {isDeleting ? 'Deleting...' : 'Delete Product'}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleFeatureToggle}
                    disabled={isFeaturing}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
                      isFeatured 
                        ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100' 
                        : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <FaStar /> {isFeaturing ? 'Updating...' : isFeatured ? 'Featured Product' : 'Spotlight Product'}
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdating || uploadingImage}
                    className="inline-flex items-center gap-1.5 bg-[#185E33] hover:bg-[#134B28] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-md shadow-[#185E33]/20 disabled:opacity-50"
                  >
                    <FaSave /> {uploadingImage ? 'Uploading Image...' : isUpdating ? 'Saving Changes...' : 'Save All Changes'}
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
