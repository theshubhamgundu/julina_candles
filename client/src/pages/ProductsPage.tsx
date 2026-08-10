import React from 'react';
import ProductCard from '../components/ProductCard';
import { useAllProductsQuery } from '../redux/api/product.api';
import { Product } from '../types/api-types';
import { usePageSEO } from '../hooks/usePageSEO';
import { webPageSchema, itemListSchema, breadcrumbSchema } from '../seo/schemas';

const ProductsPage: React.FC = () => {
    // Fetch all products from DB — display all of them, no filtering
    const { data, isLoading, isError } = useAllProductsQuery({ page: 1, limit: 50 });

    usePageSEO({
        title: 'Buy Artisanal Candles Online India – All Products | Julina Candles & Melts',
        description:
            'Shop Julina Candles & Melts certified Artisanal Candles (GI 51) — available in 1 kg, 5 kg, 10 kg & 25 kg packs. Doctor-formulated, ICAR-IIRR tested, hand-pounded, 100% pesticide-free. Fast delivery across India.',
        canonical: '/products',
        keywords:
            'buy Artisanal Candles India, low glycemic rice online, GI 51 rice packs, diabetic rice 1kg 5kg 10kg 25kg, organic rice buy Hyderabad, ICAR certified rice, Julina Candles & Melts products',
        schema: [
            webPageSchema({
                url: '/products',
                name: 'Buy Artisanal Candles Online India – All Products | Julina Candles & Melts',
                description:
                    'Shop Julina Candles & Melts certified Artisanal Candles (GI 51) in 1 kg, 5 kg, 10 kg & 25 kg packs. Doctor-formulated, ICAR tested, hand-pounded, pesticide-free.',
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: 'Products', url: '/products' },
                ],
            }),
            breadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'Products', url: '/products' },
            ]),
            itemListSchema(
                (data?.products || []).slice(0, 10).map((p: Product, i: number) => ({
                    name: p.name,
                    url: `/product/${p._id}`,
                    position: i + 1,
                }))
            ),
        ],
    });

    return (
        <div className="min-h-screen bg-[#f6f1e7] py-6 sm:py-10 px-4">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Banner */}
                <div className="text-center space-y-2 py-4">
                    <span className="inline-block bg-[#185e33]/10 text-[#185e33] text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Clinical & Natural Nutrition
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#185e33]">All Products</h1>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                        Explore doctor-formulated, premium 51 certified grains and natural nutrition harvested for healthy living.
                    </p>
                </div>

                <div>
                    {isLoading ? (
                        <div className="flex items-center justify-center min-h-[40vh]">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-[#185e33]/20 border-t-[#185e33] rounded-full animate-spin"></div>
                                <p className="text-xs text-gray-500">Loading catalog...</p>
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 space-y-2">
                            <p className="text-4xl">🌾</p>
                            <h3 className="text-lg font-bold text-gray-700 font-serif">Unable to load products</h3>
                            <p className="text-xs text-gray-500">Please refresh or check your internet connection.</p>
                        </div>
                    ) : !data?.products || data.products.length === 0 ? (
                        <div className="text-center py-12 space-y-2">
                            <p className="text-4xl">📦</p>
                            <h3 className="text-lg font-bold text-gray-700 font-serif">No products found</h3>
                        </div>
                    ) : (
                        <div className={`grid gap-6 sm:gap-8 max-w-5xl mx-auto ${
                            data.products.length === 1
                                ? 'grid-cols-1 max-w-md'
                                : data.products.length === 2
                                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl'
                                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}>
                            {data.products.map((product: Product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;

