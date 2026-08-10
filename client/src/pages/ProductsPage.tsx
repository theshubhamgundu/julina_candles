import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCategoriesQuery, useSearchProductsQuery } from '../redux/api/product.api';
import ReactPaginate from 'react-paginate';
import { Product } from '../types/api-types';
import ProductCard from '../components/ProductCard';
import { usePageSEO } from '../hooks/usePageSEO';
import { FaSearch } from 'react-icons/fa';

const ProductsPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || '';

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sort, setSort] = useState<'asc' | 'desc' | 'relevance'>('relevance');
    const [limit, setLimit] = useState<number>(12);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');


    useEffect(() => {
        const cat = new URLSearchParams(location.search).get('category');
        if (cat !== null) setSelectedCategory(cat);
    }, [location.search]);

    usePageSEO({
        title: 'Shop Luxury Handcrafted Candles | Julina Candles & Melts',
        description: 'Shop our luxury hand-poured soy wax candles, urli candles, glass jar candles, and festive gift sets.',
        canonical: '/products',
    });

    const { data: categoriesData } = useCategoriesQuery('');
    const { data, isLoading, isError } = useSearchProductsQuery({
        search: search,
        category: selectedCategory || undefined,
        price: undefined,
        sort: sort !== 'relevance' ? sort : undefined,
        page,
    });

    const categoriesList = categoriesData?.categories || [
        'Festive Urli Candles',
        'Wooden Dough Bowl Candles',
        'Mithai Candles',
        'Floral Candles',
        'Glass Jar Candles',
        'Fragrances',
    ];

    const handleCategoryClick = (catName: string) => {
        setSelectedCategory(catName === selectedCategory ? '' : catName);
        setPage(1);
    };

    const handlePageClick = (selectedItem: { selected: number }) => {
        setPage(selectedItem.selected + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#FBF6ED] py-6 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Top Wide Banner */}
                <div className="w-full h-36 sm:h-44 rounded-2xl overflow-hidden relative shadow-sm border border-[#E6DACB]">
                  <img 
                    src="https://res.cloudinary.com/bzykgznp/image/upload/v1786389862/julina_candles/products/peacock_pink_wax_urli.png"
                    alt="Shop Candle Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wider">
                      Shop Candles & Melts
                    </h1>
                  </div>
                </div>

                {/* Main Content Area: Sidebar + Grid */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Sidebar Filters */}
                    <div className="hidden lg:block w-full lg:w-1/4 space-y-6">
                        
                        {/* Categories Box */}
                        <div className="bg-white rounded-2xl p-5 border border-[#E6DACB] shadow-xs">
                            <h3 className="text-lg font-serif font-bold text-[#2A1C22] pb-3 border-b border-[#E6DACB] mb-3">
                                Categories
                            </h3>
                            
                            <ul className="space-y-2.5">
                                <li 
                                  onClick={() => handleCategoryClick('')}
                                  className={`flex items-center justify-between text-xs sm:text-sm font-sans cursor-pointer transition-colors py-1 ${
                                      selectedCategory === '' ? 'text-[#5C2333] font-bold' : 'text-gray-600 hover:text-[#5C2333]'
                                  }`}
                                >
                                  <span>All Candles</span>
                                </li>

                                {categoriesList.map((catName) => (
                                  <li 
                                    key={catName}
                                    onClick={() => handleCategoryClick(catName)}
                                    className={`flex items-center justify-between text-xs sm:text-sm font-sans cursor-pointer transition-colors py-1 ${
                                        selectedCategory === catName ? 'text-[#5C2333] font-bold' : 'text-gray-600 hover:text-[#5C2333]'
                                    }`}
                                  >
                                    <span>{catName}</span>
                                  </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fragrance By Mood Accordion Box */}
                        <div className="bg-white rounded-2xl p-5 border border-[#E6DACB] shadow-xs">
                            <h3 className="text-lg font-serif font-bold text-[#2A1C22] pb-3 border-b border-[#E6DACB] mb-3">
                                Fragrance By Mood
                            </h3>
                            <ul className="space-y-2 text-xs sm:text-sm text-gray-600 font-sans">
                              <li className="flex items-center gap-2 cursor-pointer hover:text-[#5C2333]">
                                <input type="checkbox" className="rounded border-gray-300 text-[#5C2333] focus:ring-0" />
                                <span>Calming & Relaxation</span>
                              </li>
                              <li className="flex items-center gap-2 cursor-pointer hover:text-[#5C2333]">
                                <input type="checkbox" className="rounded border-gray-300 text-[#5C2333] focus:ring-0" />
                                <span>Festive & Energetic</span>
                              </li>
                              <li className="flex items-center gap-2 cursor-pointer hover:text-[#5C2333]">
                                <input type="checkbox" className="rounded border-gray-300 text-[#5C2333] focus:ring-0" />
                                <span>Romantic & Passionate</span>
                              </li>
                              <li className="flex items-center gap-2 cursor-pointer hover:text-[#5C2333]">
                                <input type="checkbox" className="rounded border-gray-300 text-[#5C2333] focus:ring-0" />
                                <span>Wellness & Hopeful</span>
                              </li>
                            </ul>
                        </div>

                        {/* Fragrance By Room Box */}
                        <div className="bg-white rounded-2xl p-5 border border-[#E6DACB] shadow-xs">
                            <h3 className="text-lg font-serif font-bold text-[#2A1C22] pb-3 border-b border-[#E6DACB] mb-3">
                                Fragrance By Room
                            </h3>
                            <ul className="space-y-2 text-xs sm:text-sm text-gray-600 font-sans">
                              <li className="flex items-center gap-2 cursor-pointer hover:text-[#5C2333]">
                                <input type="checkbox" className="rounded border-gray-300 text-[#5C2333] focus:ring-0" />
                                <span>Living Room</span>
                              </li>
                              <li className="flex items-center gap-2 cursor-pointer hover:text-[#5C2333]">
                                <input type="checkbox" className="rounded border-gray-300 text-[#5C2333] focus:ring-0" />
                                <span>Bed Room</span>
                              </li>
                              <li className="flex items-center gap-2 cursor-pointer hover:text-[#5C2333]">
                                <input type="checkbox" className="rounded border-gray-300 text-[#5C2333] focus:ring-0" />
                                <span>Dining & Kitchen</span>
                              </li>
                              <li className="flex items-center gap-2 cursor-pointer hover:text-[#5C2333]">
                                <input type="checkbox" className="rounded border-gray-300 text-[#5C2333] focus:ring-0" />
                                <span>Meditation Room</span>
                              </li>
                            </ul>
                        </div>

                    </div>

                    {/* Right Main Catalog Grid */}
                    <div className="w-full lg:w-3/4 space-y-6">
                        
                        {/* Top Toolbar */}
                        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E6DACB] flex flex-col sm:flex-row items-center justify-between gap-4">
                          
                          <div className="flex items-center w-full sm:w-auto max-w-xs relative">
                            <FaSearch className="absolute left-3 text-gray-400 text-xs" />
                            <input
                              type="text"
                              placeholder="Search products..."
                              value={search}
                              onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                              }}
                              className="w-full bg-white border border-[#E6DACB] rounded-full pl-9 pr-4 py-1.5 text-xs text-gray-700 font-sans focus:outline-none focus:ring-1 focus:ring-[#C79A56]"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-sans">
                              <span>Show</span>
                              <select 
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="bg-white border border-[#E6DACB] rounded-lg px-2 py-1 text-xs font-medium focus:outline-none"
                              >
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                              </select>
                            </div>

                            <select
                              value={sort}
                              onChange={(e) => setSort(e.target.value as 'asc' | 'desc' | 'relevance')}
                              className="bg-white border border-[#E6DACB] rounded-xl px-3 py-1.5 text-xs font-serif font-bold text-[#2A1C22] focus:outline-none shadow-2xs"
                            >
                              <option value="relevance">Default sorting</option>
                              <option value="asc">Sort by price: low to high</option>
                              <option value="desc">Sort by price: high to low</option>
                            </select>
                          </div>

                        </div>

                        {/* Product Grid */}
                        {isLoading ? (
                            <div className="flex items-center justify-center min-h-[40vh]">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 border-4 border-[#5C2333]/20 border-t-[#5C2333] rounded-full animate-spin"></div>
                                    <p className="text-xs text-gray-500">Loading shop catalog...</p>
                                </div>
                            </div>
                        ) : isError ? (
                            <div className="bg-white p-8 rounded-3xl text-center border border-[#E6DACB]">
                                <p className="text-3xl mb-2">🕯️</p>
                                <h3 className="text-lg font-bold text-gray-700 font-serif">Unable to load products</h3>
                            </div>
                        ) : !data?.products || data.products.length === 0 ? (
                            <div className="bg-white p-8 rounded-3xl text-center border border-[#E6DACB]">
                                <p className="text-4xl mb-2">📦</p>
                                <h3 className="text-lg font-bold text-gray-700 font-serif">No products found</h3>
                                <button 
                                  onClick={() => setSelectedCategory('')}
                                  className="mt-3 bg-[#5C2333] text-white px-5 py-2 rounded-full text-xs font-bold"
                                >
                                  View All Products
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                    {data.products.map((product: Product) => (
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
                                            containerClassName="flex items-center space-x-1 sm:space-x-2 bg-white px-4 py-2 rounded-full shadow-md border border-[#E6DACB]"
                                            pageClassName="rounded-full overflow-hidden"
                                            pageLinkClassName="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100"
                                            previousClassName="rounded-full overflow-hidden"
                                            previousLinkClassName="px-3 py-1 text-xs font-bold text-[#5C2333] hover:bg-[#FAF6EE]"
                                            nextClassName="rounded-full overflow-hidden"
                                            nextLinkClassName="px-3 py-1 text-xs font-bold text-[#5C2333] hover:bg-[#FAF6EE]"
                                            breakClassName="px-2 text-xs font-bold text-gray-400"
                                            activeClassName="!bg-[#5C2333] text-white"
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

export default ProductsPage;
