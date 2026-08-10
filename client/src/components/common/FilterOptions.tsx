import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FilterOptionsProps {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    minPrice?: number | undefined;
    setMinPrice?: (price: number) => void;
    maxPrice?: number | undefined;
    setMaxPrice?: (price: number) => void;
    sort: 'asc' | 'desc' | 'relevance';
    setSort: (sort: 'asc' | 'desc' | 'relevance') => void;
    clearFilters: () => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
    categories,
    selectedCategory,
    setSelectedCategory,
    sort,
    setSort,
    clearFilters,
}) => {
    const [showCategories, setShowCategories] = useState(true);

    return (
        <div className="p-4 bg-white rounded-2xl border border-[#E6DACB] space-y-5">
            {/* Sort options */}
            <div>
                <label className="block text-xs font-bold text-[#5C2333] uppercase tracking-wider mb-1.5">
                    Sort By
                </label>
                <select
                    className="w-full px-3 py-2 text-xs font-serif font-bold text-[#2A1C22] bg-[#FAF6EE] border border-[#E6DACB] focus:outline-none focus:ring-1 focus:ring-[#5C2333] rounded-xl"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as 'asc' | 'desc' | 'relevance')}
                >
                    <option value="relevance">Featured & Relevant</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div>

            {/* Category filter */}
            <div>
                <div 
                    className="flex items-center justify-between cursor-pointer py-1" 
                    onClick={() => setShowCategories(!showCategories)}
                >
                    <h3 className="text-xs font-bold text-[#5C2333] uppercase tracking-wider">
                        Categories
                    </h3>
                    {showCategories ? <FaChevronUp className="h-3 w-3 text-[#5C2333]" /> : <FaChevronDown className="h-3 w-3 text-[#5C2333]" />}
                </div>

                {showCategories && (
                    <ul className="mt-2 space-y-1">
                        <li
                            className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                selectedCategory === ''
                                    ? 'bg-[#5C2333] text-white font-bold'
                                    : 'text-gray-700 hover:bg-[#FAF6EE]'
                            }`}
                            onClick={() => setSelectedCategory('')}
                        >
                            All Categories
                        </li>
                        {categories.map((category) => (
                            <li
                                key={category}
                                className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-[#5C2333] text-white font-bold'
                                        : 'text-gray-700 hover:bg-[#FAF6EE]'
                                }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Clear filters button */}
            <button
                className="w-full bg-[#FAF6EE] text-[#5C2333] border border-[#E6DACB] py-2 rounded-xl text-xs font-bold hover:bg-[#5C2333] hover:text-white transition-colors duration-200"
                onClick={clearFilters}
            >
                Reset Filters
            </button>
        </div>
    );
};

export default FilterOptions;
