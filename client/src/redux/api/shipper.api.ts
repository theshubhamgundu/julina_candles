import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Shipper {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company_name?: string;
    address?: string;
    status: 'active' | 'inactive' | 'suspended';
    created_at: string;
    updated_at: string;
}

export interface ShipperOrder {
    id: string;
    status: string;
    createdAt: string;
    customer: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pinCode: string;
        landmark?: string;
    };
    items: {
        name: string;
        quantity: number;
        photo: string;
    }[];
    tracking: {
        awbNumber?: string;
        senderMobile?: string;
        receiverMobile?: string;
        trackingUrl?: string;
    };
    total: number;
}

export interface CreateShipperRequest {
    name: string;
    email: string;
    phone?: string;
    company_name?: string;
    address?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    shipper: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        company_name?: string;
    };
}

export const shipperApi = createApi({
    reducerPath: "shipperApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/v1/shippers/`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('shipperToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['shippers', 'shipperOrders'],
    endpoints: (builder) => ({
        // Admin endpoints
        createShipper: builder.mutation<any, CreateShipperRequest>({
            query: (shipper) => ({
                url: 'create',
                method: 'POST',
                body: shipper,
            }),
            invalidatesTags: ['shippers']
        }),
        allShippers: builder.query<{ success: boolean; shippers: Shipper[] }, string>({
            query: () => 'all',
            providesTags: ['shippers']
        }),
        updateShipperStatus: builder.mutation<any, { shipperId: string; status: string }>({
            query: ({ shipperId, status }) => ({
                url: 'update-status',
                method: 'PUT',
                body: { shipperId, status },
            }),
            invalidatesTags: ['shippers']
        }),
        deleteShipper: builder.mutation<any, string>({
            query: (shipperId) => ({
                url: `delete/${shipperId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['shippers']
        }),

        // Shipper portal endpoints
        shipperLogin: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
        }),
        shipperOrders: builder.query<{ success: boolean; orders: ShipperOrder[] }, void>({
            query: () => 'orders',
            providesTags: ['shipperOrders']
        }),
        dispatchOrder: builder.mutation<any, string>({
            query: (orderId) => ({
                url: 'dispatch-order',
                method: 'PUT',
                body: { orderId },
            }),
            invalidatesTags: ['shipperOrders']
        }),
        shipperLogout: builder.mutation<any, void>({
            query: () => ({
                url: 'logout',
                method: 'POST',
            }),
        }),
        verifyShipperToken: builder.query<{ success: boolean; shipper: any }, void>({
            query: () => 'verify',
        }),
    })
});

export const {
    useCreateShipperMutation,
    useAllShippersQuery,
    useUpdateShipperStatusMutation,
    useDeleteShipperMutation,
    useShipperLoginMutation,
    useShipperOrdersQuery,
    useDispatchOrderMutation,
    useShipperLogoutMutation,
    useVerifyShipperTokenQuery,
} = shipperApi;

