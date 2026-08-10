import React from 'react';
import ProductCard from '../components/ProductCard';
import { useAllProductsQuery } from '../redux/api/product.api';
import { Product } from '../types/api-types';
import { usePageSEO } from '../hooks/usePageSEO';
import { webPageSchema, itemListSchema, breadcrumbSchema } from '../seo/schemas';

const ProductsPage: React.FC = () => {
    const { data, isLoading, isError } = useAllProductsQuery({ page: 1, limit: 50 });

    usePageSEO({
        title: 'Buy Luxury Handcrafted Candles Online | Julina Candles & Melts',
        description:
            'Explore Julina Candles & Melts full catalog of handcrafted decorative candles, scented soy wax jars, lotus pond urlis, coffee collection candles, and luxury gift sets from Maharashtra, India.',
        canonical: '/products',
        keywords:
            'buy decorative candles online india, soy wax candles, urli candles supplier, coffee collection candles, luxury scented candles, Julina Candles & Melts products',
        schema: [
            webPageSchema({
                url: '/products',
                name: 'Buy Luxury Handcrafted Candles Online | Julina Candles & Melts',
                description:
                    'Explore Julina Candles & Melts handcrafted decorative, scented, and soy wax candles.',
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
        <div className="min-h-screen bg-[#FBF6ED] py-6 sm:py-10 px-4">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Banner */}
                <div className="text-center space-y-2 py-4">
                    <span className="inline-block bg-[#C79A56]/15 text-[#5C2333] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full">
                        Handcrafted Soy Wax Collection
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1C22]">Our Candle Collection</h1>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                        Discover luxury decorative urlis, coffee collection jars, floral embeds, and traditional festive candles.
                    </p>
                </div>

                <div>
                    {isLoading ? (
                        <div className="flex items-center justify-center min-h-[40vh]">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-[#5C2333]/20 border-t-[#5C2333] rounded-full animate-spin"></div>
                                <p className="text-xs text-gray-500">Loading catalog...</p>
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 space-y-2">
                            <p className="text-4xl">🕯️</p>
                            <h3 className="text-lg font-bold text-gray-700 font-serif">Unable to load products</h3>
                            <p className="text-xs text-gray-500">Please refresh or check your internet connection.</p>
                        </div>
                    ) : !data?.products || data.products.length === 0 ? (
                        <div className="text-center py-12 space-y-2">
                            <p className="text-4xl">📦</p>
                            <h3 className="text-lg font-bold text-gray-700 font-serif">No products found</h3>
                        </div>
                    ) : (
                        <div className={`grid gap-6 sm:gap-8 max-w-6xl mx-auto ${
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
