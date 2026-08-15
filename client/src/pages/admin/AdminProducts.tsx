import Papa from 'papaparse';
import React, { useEffect, useMemo, useState } from 'react';
import { 
  FaEdit, 
  FaFileCsv, 
  FaPlus, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaSearch,
  FaBoxes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaLayerGroup,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useAllProductsQuery, useDeleteProductMutation, useToggleActiveProductMutation } from '../../redux/api/product.api';
import { CustomError, Product } from '../../types/api-types';
import { notify } from '../../utils/util';

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  // Fetch products with large limit so admin can search and filter smoothly
  const { data: productsData, isLoading, isError, error, refetch } = useAllProductsQuery({ page: 1, limit: 100, sortBy: { id: '', desc: false } });
  const [deleteProduct] = useDeleteProductMutation();
  const [toggleActiveProduct] = useToggleActiveProductMutation();
  const [products, setProducts] = useState<Product[]>([]);
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockFilter, setSelectedStockFilter] = useState<'All' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'disabled'>('All');

  useEffect(() => {
    if (productsData?.products) {
      setProducts(productsData.products);
    }
  }, [productsData]);

  useEffect(() => {
    if (isError && error) {
      const err = error as CustomError;
      notify(err.data?.message || 'Failed to load products', 'error');
    }
  }, [isError, error]);

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This will permanently remove it from the catalog.`)) {
      try {
        const res = await deleteProduct({ productId }).unwrap();
        notify(res.message || 'Product deleted successfully', 'success');
        refetch();
      } catch (err: any) {
        notify(err?.data?.message || 'Failed to delete product', 'error');
      }
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean | undefined) => {
    try {
      const res = await toggleActiveProduct({ productId }).unwrap();
      notify(res.message || `Product ${currentStatus !== false ? 'disabled' : 'enabled'} successfully`, 'success');
      refetch();
    } catch (err: any) {
      notify(err?.data?.message || 'Failed to update product status', 'error');
    }
  };

  // Distinct Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        p.name?.toLowerCase().includes(query) || 
        p.category?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query);

      // Category match
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      // Stock status match
      let matchesStock = true;
      const stock = Number(p.stock || 0);
      const isActive = p.isActive !== false;

      if (selectedStockFilter === 'disabled') {
        matchesStock = !isActive;
      } else if (selectedStockFilter === 'out_of_stock') {
        matchesStock = stock === 0 && isActive;
      } else if (selectedStockFilter === 'low_stock') {
        matchesStock = stock > 0 && stock < 10 && isActive;
      } else if (selectedStockFilter === 'in_stock') {
        matchesStock = stock >= 10 && isActive;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, selectedStockFilter]);

  // Overview Counts
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isActive !== false).length;
    const lowStock = products.filter((p) => Number(p.stock || 0) < 10 && Number(p.stock || 0) > 0 && p.isActive !== false).length;
    const outOfStock = products.filter((p) => Number(p.stock || 0) === 0 && p.isActive !== false).length;
    return { total, active, lowStock, outOfStock };
  }, [products]);

  const getStockBadge = (stock: number, isActive: boolean) => {
    if (!isActive) return { bg: 'bg-gray-100 text-gray-600 border-gray-200', text: 'Disabled' };
    if (stock === 0) return { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Out of Stock' };
    if (stock < 10) return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: `Low (${stock})` };
    return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: `In Stock (${stock})` };
  };

  const exportToCSV = () => {
    const exportData = filteredProducts.map(p => ({
      ID: p._id,
      Name: p.name,
      Category: p.category,
      Price: p.price,
      Stock: p.stock,
      Active: p.isActive !== false ? 'Yes' : 'No',
      Variants: p.variants?.length || 0,
      ImageURL: p.photo
    }));
    const csvData = Papa.unparse(exportData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `julina-products-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader rows={6} columns={8} height={48} className="mb-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-[#efe9db] shadow-sm text-center max-w-md mx-auto my-12">
        <p className="text-red-500 font-semibold mb-3">Failed to load product catalog.</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center text-white bg-[#185e33] px-5 py-2.5 rounded-xl hover:bg-[#134b28] transition font-medium text-sm shadow-md"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#185e33]">Product Catalog</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your store inventory, candle variants, pricing and real-time stock levels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2 bg-[#185e33] hover:bg-[#134b28] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md shadow-[#185e33]/20"
          >
            <FaPlus className="text-xs" /> Add Product
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-[#C79A56] hover:bg-[#b38543] text-gray-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
          >
            <FaFileCsv className="text-sm" /> Export CSV
          </button>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => { setSelectedStockFilter('All'); setSelectedCategory('All'); }}
          className={`cursor-pointer bg-white p-4 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
            selectedStockFilter === 'All' && selectedCategory === 'All' ? 'border-[#185e33] ring-2 ring-[#185e33]/15' : 'border-[#efe9db]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-[#185e33]/10 text-[#185e33] flex items-center justify-center text-sm">
              <FaBoxes />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 font-serif mt-2">{stats.total}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Across {categories.length - 1} categories</p>
        </div>

        <div 
          onClick={() => setSelectedStockFilter('in_stock')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
            selectedStockFilter === 'in_stock' ? 'border-emerald-600 ring-2 ring-emerald-600/15' : 'border-[#efe9db]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">In Stock</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <FaCheckCircle />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-serif mt-2">
            {products.filter(p => Number(p.stock || 0) >= 10 && p.isActive !== false).length}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Ready for instant shipping</p>
        </div>

        <div 
          onClick={() => setSelectedStockFilter('low_stock')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
            selectedStockFilter === 'low_stock' ? 'border-amber-600 ring-2 ring-amber-600/15' : 'border-[#efe9db]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Low Stock Alert</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              <FaExclamationTriangle />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 font-serif mt-2">{stats.lowStock}</p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Less than 10 units left</p>
        </div>

        <div 
          onClick={() => setSelectedStockFilter('out_of_stock')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
            selectedStockFilter === 'out_of_stock' ? 'border-rose-600 ring-2 ring-rose-600/15' : 'border-[#efe9db]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Out of Stock</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
              <FaTimesCircle />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 font-serif mt-2">{stats.outOfStock}</p>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">Needs candle batch restock</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#efe9db] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candles by name, category or details..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ede3cf] text-sm focus:outline-none focus:ring-2 focus:ring-[#185e33]/20 bg-[#faf6ee]/50 placeholder-gray-400 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Stock Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStockFilter}
              onChange={(e) => setSelectedStockFilter(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl border border-[#ede3cf] text-xs font-semibold bg-[#faf6ee] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#185e33]/20"
            >
              <option value="All">All Stock Levels</option>
              <option value="in_stock">In Stock (10+)</option>
              <option value="low_stock">Low Stock (&lt; 10)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
              <option value="disabled">Disabled Products</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0 pr-1">
            <FaLayerGroup className="text-xs" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#185e33] text-white shadow-sm font-semibold'
                  : 'bg-[#faf6ee] text-gray-600 hover:bg-[#ede3cf]/60 border border-[#ede3cf]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#efe9db] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#efe9db] flex items-center justify-between">
          <h2 className="font-serif font-bold text-[#185e33] text-base">
            Candle Items ({filteredProducts.length})
          </h2>
          {(searchQuery || selectedCategory !== 'All' || selectedStockFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStockFilter('All');
              }}
              className="text-xs font-semibold text-[#C79A56] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C79A56] text-2xl flex items-center justify-center mx-auto mb-3">
              🕯️
            </div>
            <p className="text-gray-900 font-semibold mb-1">No matching products found</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try adjusting your search terms or filter selection to view products.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#efe9db] text-left text-xs">
              <thead className="bg-[#faf6ee] text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price & Variants</th>
                  <th className="px-5 py-3.5">Stock Status</th>
                  <th className="px-5 py-3.5">Visibility</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efe9db] bg-white">
                {filteredProducts.map((p) => {
                  const hasVariants = p.variants && Array.isArray(p.variants) && p.variants.length > 0;
                  const isActive = p.isActive !== false;
                  const stockBadge = getStockBadge(Number(p.stock || 0), isActive);

                  return (
                    <tr key={p._id} className="hover:bg-[#faf6ee]/50 transition-colors group">
                      {/* Product details */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={p.photo || '/images/mainImage.png'}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-xl border border-[#efe9db] shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389845/julina_candles/products/handicraf_lotus_pond.png';
                            }}
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-gray-900 block truncate max-w-xs text-sm">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono block">
                              ID: {p._id ? p._id.slice(0, 8) : 'N/A'}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#faf6ee] text-[#185e33] border border-[#ede3cf]">
                          {p.category || 'General'}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="px-5 py-3.5">
                        {hasVariants ? (
                          <div>
                            {(() => {
                              const prices = p.variants!.map((v: any) => v.salePrice || v.price || 0);
                              const min = Math.min(...prices);
                              const max = Math.max(...prices);
                              return (
                                <>
                                  <span className="font-bold text-[#185e33] text-sm">
                                    ₹{min.toFixed(2)} - ₹{max.toFixed(2)}
                                  </span>
                                  <span className="text-[10px] text-gray-400 block mt-0.5">
                                    {p.variants!.length} sizing variants
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <span className="font-bold text-gray-900 text-sm">
                            ₹{Number(p.price || 0).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${stockBadge.bg}`}>
                          {stockBadge.text}
                        </span>
                      </td>

                      {/* Visibility Toggle */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleToggleActive(p._id, p.isActive)}
                          className={`px-3 py-1 rounded-full font-bold text-[11px] transition flex items-center gap-1.5 border shadow-2xs ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-300'
                          }`}
                          title={isActive ? 'Click to hide from store' : 'Click to show on store'}
                        >
                          {isActive ? (
                            <>
                              <FaEye className="text-emerald-600" /> Active
                            </>
                          ) : (
                            <>
                              <FaEyeSlash className="text-gray-400" /> Disabled
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/product/${p._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-gray-400 hover:text-[#185e33] hover:bg-[#faf6ee] transition"
                            title="Preview product on website"
                          >
                            <FaExternalLinkAlt className="text-xs" />
                          </a>
                          <button
                            onClick={() => navigate(`/admin/products/${p._id}`)}
                            className="px-3 py-1.5 rounded-xl bg-[#faf6ee] hover:bg-[#ede3cf] text-[#185e33] font-bold text-xs border border-[#ede3cf] transition flex items-center gap-1.5"
                          >
                            <FaEdit className="text-xs" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition text-xs"
                            title="Delete candle"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;


