import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterOptions from '../components/common/FilterOptions';
import { useCategoriesQuery, useSearchProductsQuery } from '../redux/api/product.api';
import ReactPaginate from 'react-paginate';
import { Product } from '../types/api-types';
import ProductCard from '../components/ProductCard';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { usePageSEO } from '../hooks/usePageSEO';

const SearchPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

    usePageSEO({
        title: 'Search Handcrafted Candles | Julina Candles & Melts',
        description: 'Search for decorative candles, scented soy wax jars, lotus pond urlis, and festive gift sets on Julina Candles & Melts.',
        canonical: '/search',
        noIndex: true, // search result pages should not be indexed
    });
    const [sort, setSort] = useState<'asc' | 'desc' | 'relevance'>('relevance');
    const [page, setPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        if (query) {
            setSearchTerm(query);
        }
    }, [query]);

    const { data: categoriesData, isLoading: categoriesLoading } = useCategoriesQuery('');
    const { data, isLoading, isError } = useSearchProductsQuery({
        search: searchTerm,
        category: selectedCategory || undefined,
        price: minPrice !== undefined && maxPrice !== undefined ? `${minPrice},${maxPrice}` : undefined,
        sort: sort !== 'relevance' ? sort : undefined,
        page,
    });

    const onSearch = () => {
        setPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setSort('relevance');
        setPage(1);
    };

    const handlePageClick = (selectedItem: { selected: number }) => {
        setPage(selectedItem.selected + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#f6f1e7] py-6 sm:py-10 px-4">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Search Bar Top Header */}
                <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-md border border-[#ede3cf] space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#185e33]">Search & Filter Catalog</h1>
                        
                        {/* Mobile Filter Toggle Button */}
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden flex items-center gap-2 bg-[#faf6ee] border border-[#ede3cf] text-[#185e33] font-bold text-xs px-3.5 py-2 rounded-full shadow-2xs"
                        >
                            <FaFilter className="text-xs" />
                            <span>Filters</span>
                        </button>
                    </div>

                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={onSearch} />
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* Desktop Sidebar Filters / Mobile Drawer */}
                    <div className={`w-full lg:w-1/4 bg-white p-5 rounded-3xl shadow-md border border-[#ede3cf] ${
                        showMobileFilters ? 'block' : 'hidden lg:block'
                    }`}>
                        <div className="flex items-center justify-between mb-4 lg:hidden">
                            <h3 className="font-serif font-bold text-base text-[#185e33]">Filter Products</h3>
                            <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 p-1">
                                <FaTimes />
                            </button>
                        </div>

                        {categoriesLoading ? (
                            <p className="text-xs text-gray-400">Loading categories...</p>
                        ) : (
                            <FilterOptions
                                categories={categoriesData?.categories || []}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                minPrice={minPrice}
                                setMinPrice={setMinPrice}
                                maxPrice={maxPrice}
                                setMaxPrice={setMaxPrice}
                                sort={sort}
                                setSort={setSort}
                                clearFilters={clearFilters}
                            />
                        )}
                    </div>

                    {/* Product Grid Area */}
                    <div className="w-full lg:w-3/4">
                        {isLoading ? (
                            <div className="flex items-center justify-center min-h-[40vh]">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 border-4 border-[#185e33]/20 border-t-[#185e33] rounded-full animate-spin"></div>
                                    <p className="text-xs text-gray-500">Searching products...</p>
                                </div>
                            </div>
                        ) : isError ? (
                            <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-[#ede3cf]">
                                <p className="text-3xl mb-2">🌾</p>
                                <h3 className="text-lg font-bold text-gray-700 font-serif">Unable to load search results</h3>
                                <p className="text-xs text-gray-500 mt-1">Please try clearing your filters.</p>
                            </div>
                        ) : data?.products.length === 0 ? (
                            <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-[#ede3cf] space-y-3">
                                <p className="text-4xl">🔍</p>
                                <h3 className="text-lg font-bold text-gray-700 font-serif">No products match your search</h3>
                                <p className="text-xs text-gray-500">Try searching for "Lotus", "Coffee", "Urli", or adjusting your price filters.</p>
                                <button onClick={clearFilters} className="bg-[#185e33] text-white px-5 py-2 rounded-full text-xs font-bold shadow-xs">
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* 2 columns on mobile */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                                    {data?.products.map((product: Product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {data && data.totalPage > 1 && (
                                    <div className="mt-10 flex justify-center">
                                        <ReactPaginate
                                            pageCount={data.totalPage}
                                            pageRangeDisplayed={2}
                                            marginPagesDisplayed={1}
                                            onPageChange={handlePageClick}
                                            containerClassName="flex items-center space-x-1 sm:space-x-2 bg-white px-4 py-2 rounded-full shadow-md border border-[#ede3cf]"
                                            pageClassName="rounded-full overflow-hidden"
                                            pageLinkClassName="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100"
                                            previousClassName="rounded-full overflow-hidden"
                                            previousLinkClassName="px-3 py-1 text-xs font-bold text-[#185e33] hover:bg-[#faf6ee]"
                                            nextClassName="rounded-full overflow-hidden"
                                            nextLinkClassName="px-3 py-1 text-xs font-bold text-[#185e33] hover:bg-[#faf6ee]"
                                            breakClassName="px-2 text-xs font-bold text-gray-400"
                                            activeClassName="!bg-[#185e33] text-white"
                                            activeLinkClassName="!text-white"
                                            disabledClassName="opacity-30 cursor-not-allowed pointer-events-none"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;

