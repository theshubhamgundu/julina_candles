import Papa from 'papaparse';
import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaEdit, FaFileCsv, FaPlus, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Cell, Column, HeaderGroup, Row, useSortBy, useTable } from 'react-table';
import Pagination from '../../components/common/Pagination';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useAllProductsQuery, useDeleteProductMutation, useToggleActiveProductMutation } from '../../redux/api/product.api';
import { CustomError, Product } from '../../types/api-types';
import { notify } from '../../utils/util';

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(8); // Items per page
  const [sortBy, setSortBy] = useState<{ id: string; desc: boolean }>({ id: '', desc: false });
  const { data: productsData, isLoading, isError, error, refetch } = useAllProductsQuery({ page, limit, sortBy });
  const [deleteProduct] = useDeleteProductMutation();
  const [toggleActiveProduct] = useToggleActiveProductMutation();
  const [data, setData] = useState<Product[]>([]);

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This will immediately remove it from the home page and catalog.`)) {
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

  useEffect(() => {
    if (productsData?.products) {
      setData(productsData.products);
    }
  }, [productsData]);

  useEffect(() => {
    if (isError && error) {
      const err = error as CustomError;
      notify(err.data.message, 'error');
    }
  }, [isError, error]);

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return 'bg-red-50 text-red-700 border border-red-200';
    } else if (stock < 5) {
      return 'bg-orange-50 text-orange-700 border border-orange-200';
    } else {
      return 'bg-green-50 text-green-700 border border-green-200';
    }
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return `Low Stock (${stock})`;
    return `In Stock (${stock})`;
  };

  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        Header: 'Image',
        accessor: 'photo',
        Cell: ({ value }: { value: string }) => (
          <img 
            src={value || '/images/mainImage.png'} 
            alt="product" 
            className="w-12 h-12 object-cover rounded-xl border border-[#efe9db] shadow-sm hover:scale-105 transition-transform duration-200" 
          />
        ),
        disableSortBy: true,
      },
      { 
        Header: 'Product Name', 
        accessor: 'name',
        Cell: ({ value, row }: { value: any; row: any }) => (
          <div>
            <span className="font-semibold text-gray-900">{value}</span>
            {row.original.isActive === false && (
              <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-bold bg-gray-200 text-gray-600 rounded">Disabled</span>
            )}
          </div>
        )
      },
      { 
        Header: 'Category', 
        accessor: 'category',
        Cell: ({ value }) => <span className="text-gray-600 font-medium text-xs bg-[#faf6ee] px-2.5 py-1 rounded-full border border-[#ede3cf]">{value}</span>
      },
      { 
        Header: 'Stock Status', 
        accessor: 'stock',
        Cell: ({ value }: { value: number }) => (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStockBadge(value)}`}>
            {getStockText(value)}
          </span>
        )
      },
      { 
        Header: 'Pricing', 
        accessor: 'price',
        Cell: ({ value, row }: { value: any; row: any }) => {
          const product = row.original;
          const hasVariants = product.variants && Array.isArray(product.variants) && product.variants.length > 0;
          
          if (hasVariants) {
            const prices = product.variants.map((v: any) => v.salePrice || v.price || 0);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            return (
              <span className="font-semibold text-[#185e33] text-xs">
                ₹{minPrice.toFixed(2)} - ₹{maxPrice.toFixed(2)}
                <span className="text-gray-500 ml-1">({product.variants.length} variants)</span>
              </span>
            );
          }
          
          const basePrice = Number(value || 0);
          if (basePrice <= 1) {
            return <span className="font-semibold text-red-600">⚠️ Set Price</span>;
          }
          return <span className="font-semibold text-gray-900">₹{basePrice.toFixed(2)}</span>;
        }
      },
      {
        Header: 'Status',
        Cell: ({ row }: { row: Row<Product> }) => {
          const isActive = row.original.isActive !== false;
          return (
            <button
              onClick={() => handleToggleActive(row.original._id, row.original.isActive)}
              className={`px-3 py-1 rounded-full font-bold text-xs transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
              }`}
              title={isActive ? 'Click to Disable product from store' : 'Click to Enable product on store'}
            >
              {isActive ? <><FaEye className="text-green-600" /> Active</> : <><FaEyeSlash className="text-gray-500" /> Disabled</>}
            </button>
          );
        },
        disableSortBy: true,
      },
      {
        Header: 'Actions',
        Cell: ({ row }: { row: Row<Product> }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/admin/products/${row.original._id}`)}
              className="text-secondary hover:bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20 font-medium text-xs transition flex items-center gap-1.5"
            >
              <FaEdit /> Manage
            </button>
            <button
              onClick={() => handleDelete(row.original._id, row.original.name)}
              className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 font-medium text-xs transition flex items-center gap-1.5"
            >
              <FaTrash /> Delete
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [navigate]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Product>({ columns, data }, useSortBy);

  const handleSort = (columnId: string) => {
    setSortBy((prevSortBy) => {
      if (prevSortBy.id === columnId) {
        return { id: columnId, desc: !prevSortBy.desc };
      } else {
        return { id: columnId, desc: false };
      }
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRetry = () => {
    refetch();
  };

  const exportToCSV = () => {
    const csvData = Papa.unparse(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm">
        <SkeletonLoader rows={5} columns={10} height={48} className="mb-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#efe9db] shadow-sm text-center max-w-md mx-auto">
        <p className="text-red-500 font-semibold mb-4">Failed to load products. Please try again.</p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center text-white bg-red-600 px-5 py-2.5 rounded-xl hover:bg-red-700 transition font-medium"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1f5133]">Product Catalog</h2>
          <p className="text-xs text-gray-400">View, add, and manage your store inventory.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center text-white bg-[#1f5133] hover:bg-[#163b26] px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-sm"
          >
            <FaPlus className="mr-2 text-xs" /> Add Product
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center text-white bg-[#c4633c] hover:bg-[#b0542e] px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-sm"
          >
            <FaFileCsv className="mr-2 text-xs" /> Export CSV
          </button>
        </div>
      </div>

      {(!data || data.length === 0) ? (
        <div className="text-center py-12 text-gray-400 font-medium">No products available in the catalog.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#efe9db]">
          <table {...getTableProps()} className="min-w-full divide-y divide-[#efe9db] text-left">
            <thead className="bg-[#f7f4ec]">
              {headerGroups.map((headerGroup: HeaderGroup<Product>, headerGroupIndex) => {
                const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                return (
                  <tr key={headerGroupIndex} {...headerGroupProps}>
                    {headerGroup.headers.map((column, columnIndex) => {
                      const colInstance = column as any;
                      const { key: columnKey, ...restHeaderProps } = colInstance.getHeaderProps(colInstance.getSortByToggleProps());
                      return (
                        <th
                          key={columnIndex}
                          {...restHeaderProps}
                          className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none transition-colors ${
                            colInstance.isSorted ? 'bg-[#efe9db]/50 text-[#1f5133]' : 'hover:bg-[#efe9db]/20'
                          }`}
                          onClick={() => !colInstance.disableSortBy && handleSort(colInstance.id)}
                        >
                          <div className="flex items-center">
                            {colInstance.render('Header')}
                            {colInstance.isSorted ? (
                              colInstance.isSortedDesc ? (
                                <FaArrowDown className="ml-1.5 text-xs text-primary" />
                              ) : (
                                <FaArrowUp className="ml-1.5 text-xs text-primary" />
                              )
                            ) : (
                              ''
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>

            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-[#efe9db]">
              {rows.map((row: Row<Product>, rowIndex) => {
                prepareRow(row);
                const { key, ...restRowProps } = row.getRowProps();
                return (
                  <tr key={rowIndex} {...restRowProps} className="hover:bg-[#f7f4ec]/35 transition-colors">
                    {row.cells.map((cell: Cell<Product>, cellIndex) => {
                      const { key: cellKey, ...restCellProps } = cell.getCellProps();
                      return (
                        <td key={cellIndex} {...restCellProps} className="px-6 py-4 text-sm text-gray-700">
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {productsData?.totalPages && productsData.totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <Pagination
            totalPages={productsData.totalPages}
            currentPage={productsData.currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

