import React from 'react';
import { Column, useTable } from 'react-table';
import { useGetAllUsersQuery } from '../../redux/api/user.api';
import { User as UserType } from '../../types/api-types';
import { FaUsers } from 'react-icons/fa';

const AdminCustomers: React.FC = () => {
    const { data, error, isLoading } = useGetAllUsersQuery('');
    const users: UserType[] = data?.users || [];

    const columns: Column<UserType>[] = React.useMemo(
        () => [
            {
                Header: 'Profile',
                accessor: 'photoURL',
                Cell: ({ value, row }: { value: string; row: any }) => (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1f5133] to-[#2f7d43] flex items-center justify-center text-white font-bold shadow-sm border border-[#efe9db] overflow-hidden">
                        {value ? (
                            <img src={value} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{(row.original.name || 'C')[0].toUpperCase()}</span>
                        )}
                    </div>
                ),
            },
            {
                Header: 'Name',
                accessor: 'name',
                Cell: ({ value }) => <span className="font-semibold text-gray-900">{value}</span>
            },
            {
                Header: 'Email',
                accessor: 'email',
                Cell: ({ value }) => <span className="text-gray-500 font-mono text-xs">{value}</span>
            },
            {
                Header: 'Phone',
                accessor: 'phone' as any,
                Cell: ({ value }: { value: string }) => <span className="text-gray-700 font-mono text-xs font-semibold">{value || 'N/A'}</span>,
            },
            {
                Header: 'Location',
                accessor: 'location' as any,
                Cell: ({ value }: { value: string }) => (
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#faf6ee] text-[#185e33] border border-[#ede3cf]">
                        {value || 'India'}
                    </span>
                ),
            },
        ],
        []
    );

    const tableInstance = useTable({ columns, data: users });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-8 rounded-2xl border border-[#efe9db] text-center shadow-sm max-w-md mx-auto">
                <p className="text-red-500 font-semibold mb-2">Error loading users</p>
                <p className="text-sm text-gray-500">Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-serif font-bold text-[#1f5133] flex items-center gap-2">
                    <FaUsers /> Customer Accounts
                </h1>
                <p className="text-xs text-gray-400">View and oversee registered users and customer demographics.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#efe9db] shadow-sm">
                {users.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-medium">No registered customers found.</div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-[#efe9db]">
                        <table {...getTableProps()} className="min-w-full divide-y divide-[#efe9db] text-left">
                            <thead className="bg-[#f7f4ec]">
                                {headerGroups.map((headerGroup, headerGroupIndex) => {
                                    const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                                    return (
                                        <tr key={headerGroupIndex} {...headerGroupProps}>
                                            {headerGroup.headers.map((column, columnIndex) => {
                                                const { key: columnKey, ...columnProps } = column.getHeaderProps();
                                                return (
                                                    <th
                                                        key={columnIndex}
                                                        {...columnProps}
                                                        className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                                    >
                                                        {column.render('Header')}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </thead>
                            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-[#efe9db]">
                                {rows.map((row, rowIndex) => {
                                    prepareRow(row);
                                    const { key: rowKey, ...rowProps } = row.getRowProps();
                                    return (
                                        <tr key={rowIndex} {...rowProps} className="hover:bg-[#f7f4ec]/35 transition-colors">
                                            {row.cells.map((cell, cellIndex) => {
                                                const { key: cellKey, ...cellProps } = cell.getCellProps();
                                                return (
                                                    <td key={cellIndex} {...cellProps} className="px-6 py-4 text-sm">
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
            </div>
        </div>
    );
};

export default AdminCustomers;

