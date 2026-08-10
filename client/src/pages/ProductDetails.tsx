import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useProductDetailsQuery } from '../redux/api/product.api';
import { addToCart, decrementCartItem, incrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { WeightVariant } from '../utils/weightVariants';
import { usePageSEO } from '../hooks/usePageSEO';
import { productSchema, breadcrumbSchema, webPageSchema } from '../seo/schemas';

const SingleProduct: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { data, isLoading, isError } = useProductDetailsQuery(productId!);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Variants from DB only — no hardcoded defaults
    const rawVariants = (data?.product as any)?.variants;
    const hasVariants = Array.isArray(rawVariants) && rawVariants.length > 0;
    const weightVariants: WeightVariant[] = hasVariants ? rawVariants : [];

    const [selectedVariantId, setSelectedVariantId] = useState<string>('');
    
    // Select first available variant when data loads
    const selectedVariant = hasVariants
        ? (weightVariants.find(v => v.id === selectedVariantId) || weightVariants[0])
        : null;

    // Auto-select first variant on data load
    React.useEffect(() => {
        if (hasVariants && !selectedVariantId) {
            const firstInStock = weightVariants.find(v => v.inStock !== false) || weightVariants[0];
            setSelectedVariantId(firstInStock.id);
        }
    }, [hasVariants, weightVariants, selectedVariantId]);

    const cartItems = useSelector((state: RootState) => state.cart.cartItems);

    const product = data?.product;

    // ─── Dynamic per-page SEO ───
    usePageSEO({
        title: product
            ? `${product.name} | Julina Candles & Melts`
            : 'Luxury Decorative Candle | Julina Candles & Melts',
        description: product
            ? `Buy ${product.name} online. Handcrafted 100% natural soy wax candle from Julina Candles & Melts. Fast delivery across India.`
            : 'Buy Julina Candles & Melts handcrafted decorative, scented, and soy wax candles online.',
        canonical: `/product/${productId}`,
        ogImage: product?.photo || 'https://julinacandlesandmelts.in/images/logo.png',
        keywords: product
            ? `${product.name}, buy ${product.name} online, scented candle, soy wax candle, Julina Candles & Melts`
            : 'decorative candles, scented soy wax candles, urli candles',
        schema: product
            ? [
                webPageSchema({
                    url: `/product/${productId}`,
                    name: `${product.name} | Julina Candles & Melts`,
                    description: `Buy ${product.name} online — handcrafted soy wax candle.`,
                    breadcrumb: [
                        { name: 'Home', url: '/' },
                        { name: 'Products', url: '/products' },
                        { name: product.name, url: `/product/${productId}` },
                    ],
                }),
                productSchema({
                    name: product.name,
                    description: product.description || 'Handcrafted 100% natural soy wax candle.',
                    image: product.photo || 'https://julinacandlesandmelts.in/images/logo.png',
                    url: `/product/${productId}`,
                    sku: `JCM-${productId}`,
                    price: selectedVariant?.salePrice ?? product.price ?? 0,
                    mrp: selectedVariant?.mrp,
                    availability: product.stock > 0
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                }),
                breadcrumbSchema([
                    { name: 'Home', url: '/' },
                    { name: 'Products', url: '/products' },
                    { name: product.name, url: `/product/${productId}` },
                ]),
            ]
            : undefined,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-[#f6f1e7]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#5C2333]/20 border-t-[#5C2333] rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-sans">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#f6f1e7] p-4 text-center">
        <BackButton fallback="/products" />
                <p className="text-4xl mb-3">🌾</p>
                <h2 className="text-xl font-serif font-bold text-[#5C2333] mb-2">Product Not Found</h2>
                <p className="text-sm text-gray-500 max-w-sm mb-4">The product you are looking for might be unavailable or removed.</p>
                <button onClick={() => navigate('/products')} className="bg-[#5C2333] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md">
                    Browse All Products
                </button>
            </div>
        );
    }

    const resolvedProduct = data.product;

    // All prices come from DB
    const currentPrice = hasVariants && selectedVariant
        ? (selectedVariant.salePrice ?? selectedVariant.mrp ?? resolvedProduct.price ?? 0)
        : (resolvedProduct.price ?? 0);
    const currentMrp = hasVariants && selectedVariant
        ? (selectedVariant.mrp ?? selectedVariant.salePrice ?? resolvedProduct.price ?? 0)
        : (resolvedProduct.price ?? 0);
    const discountPercent = currentMrp > currentPrice ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 0;

    // Stock check: for variants, check per-variant inStock; for non-variant, check product stock
    const isCurrentlyOutOfStock = hasVariants && selectedVariant
        ? (selectedVariant.inStock === false || resolvedProduct.stock <= 0)
        : (resolvedProduct.stock <= 0);

    const activeCartItemId = hasVariants && selectedVariant
        ? `${resolvedProduct._id}_${selectedVariant.id}`
        : resolvedProduct._id;
    const cartItem = cartItems.find(item => item.productId === activeCartItemId);

    const handleAddToCart = (event: React.MouseEvent) => {
        event.preventDefault();
        if (isCurrentlyOutOfStock) return;
        dispatch(addToCart({
            productId: activeCartItemId,
            name: hasVariants && selectedVariant
                ? `${resolvedProduct.name} (${selectedVariant.label})`
                : resolvedProduct.name,
            price: currentPrice,
            quantity: 1,
            stock: resolvedProduct.stock,
            photo: resolvedProduct.photo,
        }));
    };

    const handleIncrement = (event: React.MouseEvent) => {
        event.preventDefault();
        dispatch(incrementCartItem(activeCartItemId));
    };

    const handleDecrement = (event: React.MouseEvent) => {
        event.preventDefault();
        dispatch(decrementCartItem(activeCartItemId));
    };

    const handleGoToCart = (event: React.MouseEvent) => {
        event.preventDefault();
        navigate('/cart');
    };

    const getPhotoUrl = (photoUrl?: string) => {
        if (!photoUrl) return '/images/logo.png';
        let cleaned = photoUrl.replace('/images/products/', '/images/');
        if (!cleaned.startsWith('/') && !cleaned.startsWith('http')) {
            cleaned = '/' + cleaned;
        }
        return encodeURI(cleaned);
    };

    return (
        <div className="min-h-screen bg-[#f6f1e7] py-6 sm:py-10 px-4">
            <div className="max-w-5xl mx-auto space-y-6">
        <BackButton fallback="/products" />

                {/* Product Detail Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-[#ede3cf] flex flex-col md:flex-row gap-8 items-stretch">
                    {/* Left: Product Image */}
                    <div className="flex-1 bg-[#faf6ee] rounded-2xl p-6 flex items-center justify-center border border-[#ede3cf] relative min-h-[280px] sm:min-h-[380px]">
                        {discountPercent > 0 && (
                            <span className="bg-[#e5c158] text-[#144f2b] text-xs font-extrabold px-3 py-1 rounded-full absolute top-4 left-4 shadow-sm">
                                {discountPercent}% OFF
                            </span>
                        )}

                        {/* Out of Stock overlay */}
                        {resolvedProduct.stock <= 0 && (
                            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-2xl">
                                <span className="bg-red-100 text-red-700 text-sm font-bold px-6 py-3 rounded-full border border-red-200">
                                    Out of Stock
                                </span>
                            </div>
                        )}

                        <img
                            src={getPhotoUrl(resolvedProduct.photo)}
                            alt={resolvedProduct.name}
                            className="w-full h-64 sm:h-80 md:h-96 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex-1 flex flex-col justify-between space-y-5">
                        <div>
                            <span className="inline-block bg-[#5C2333]/10 text-[#5C2333] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 capitalize">
                                {resolvedProduct.category}
                            </span>

                            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#5C2333] leading-tight mb-2">
                                {resolvedProduct.name}
                            </h1>

                            {/* Variant Selector */}
                            {hasVariants && (
                                <div className="my-4 bg-[#faf6ee] p-4 rounded-2xl border border-[#ede3cf] space-y-2.5">
                                    <label className="block text-xs font-bold text-[#5C2333] uppercase tracking-wider">
                                        Select Pack Quantity / Weight:
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {weightVariants.map((variant) => {
                                            const isVariantOutOfStock = variant.inStock === false;
                                            return (
                                                <button
                                                    key={variant.id}
                                                    type="button"
                                                    onClick={() => !isVariantOutOfStock && setSelectedVariantId(variant.id)}
                                                    disabled={isVariantOutOfStock}
                                                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 relative ${
                                                        isVariantOutOfStock
                                                            ? 'border-red-200 bg-red-50/40 cursor-not-allowed opacity-70'
                                                            : selectedVariant?.id === variant.id
                                                                ? 'border-2 border-[#5C2333] bg-[#5C2333] text-white shadow-md'
                                                                : 'border-[#ede3cf] bg-white text-gray-800 hover:border-[#5C2333]/50'
                                                    }`}
                                                >
                                                    <span className={`text-xs font-extrabold ${
                                                        isVariantOutOfStock ? 'text-red-400' : selectedVariant?.id === variant.id ? 'text-[#e5c158]' : 'text-[#5C2333]'
                                                    }`}>
                                                        {variant.label}
                                                    </span>
                                                    {isVariantOutOfStock ? (
                                                        <span className="text-[9px] font-bold text-red-500 mt-0.5">Out of Stock</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-xs font-bold">₹{variant.salePrice ?? variant.mrp ?? 0}</span>
                                                            {variant.mrp > (variant.salePrice ?? 0) && (
                                                                <span className={`text-[10px] line-through ${selectedVariant?.id === variant.id ? 'text-white/70' : 'text-gray-400'}`}>
                                                                    MRP ₹{variant.mrp}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-2xl sm:text-3xl font-extrabold text-[#5C2333]">
                                    ₹ {currentPrice.toFixed(2)}
                                </span>
                                {discountPercent > 0 && (
                                    <span className="text-base text-gray-400 line-through">
                                        MRP ₹ {currentMrp.toFixed(2)}
                                    </span>
                                )}
                                <span className="text-xs font-bold text-[#c4633c]">Inclusive of all taxes</span>
                            </div>

                            <div className="mb-4">
                                {!isCurrentlyOutOfStock ? (
                                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <span>In Stock</span>
                                        {resolvedProduct.stock <= 10 && resolvedProduct.stock > 0 && (
                                            <span className="text-red-600 font-bold">• Only {resolvedProduct.stock} left!</span>
                                        )}
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-200">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        <span>Currently Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {resolvedProduct.description && (
                                <div className="bg-[#faf6ee] p-4 rounded-xl border border-[#ede3cf]">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Product Description</h3>
                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{resolvedProduct.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Add to Cart Controls */}
                        <div className="pt-4 border-t border-gray-100">
                            {cartItem ? (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex items-center justify-between bg-[#faf6ee] border border-[#ede3cf] rounded-full px-4 py-2 flex-1">
                                        <button
                                            onClick={handleDecrement}
                                            className="w-8 h-8 rounded-full bg-white text-[#5C2333] font-bold text-lg flex items-center justify-center hover:bg-gray-100 shadow-xs"
                                        >
                                            −
                                        </button>
                                        <span className="text-sm font-bold text-gray-800">{cartItem.quantity} in Cart</span>
                                        <button
                                            onClick={handleIncrement}
                                            disabled={isCurrentlyOutOfStock}
                                            className={`w-8 h-8 rounded-full ${isCurrentlyOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-[#5C2333] hover:bg-gray-100 shadow-xs'} font-bold text-lg flex items-center justify-center`}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleGoToCart}
                                        className="flex-1 bg-[#5C2333] hover:bg-[#134b28] text-white font-bold py-3 px-6 rounded-full text-sm transition-all shadow-md text-center"
                                    >
                                        Go to Cart ➔
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isCurrentlyOutOfStock}
                                    className={`w-full py-4 px-6 rounded-full font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                                        !isCurrentlyOutOfStock
                                            ? 'bg-[#5C2333] hover:bg-[#134b28] text-white'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <span>
                                        {!isCurrentlyOutOfStock
                                            ? `Add ${hasVariants && selectedVariant ? selectedVariant.label : ''} to Cart`
                                            : 'Out of Stock'}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;

