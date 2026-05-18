import { baseApi } from '@/app/api';
import type {
  AdminStats,
  AdminUsersResponse,
  AdminVendorsResponse,
  AdminOrdersResponse,
  AdminUsersParams,
  AdminVendorsParams,
  AdminOrdersParams,
  UserStatus,
} from '@/features/admin/types';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminStats: build.query<AdminStats, void>({
      query: () => '/admin/stats',
    }),

    getAdminUsers: build.query<AdminUsersResponse, AdminUsersParams>({
      query: (params) => ({ url: '/admin/users', params }),
      providesTags: ['AdminUser'],
    }),

    updateUserStatus: build.mutation<
      { id: string; status: UserStatus; updatedAt: string },
      { id: string; status: UserStatus }
    >({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        // Optimistically update every cached page of the users list
        const patches = dispatch(
          adminApi.util.updateQueryData('getAdminUsers', {} as AdminUsersParams, (draft) => {
            const user = draft.users.find((u) => u.id === id);
            if (user) user.status = status;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patches.undo();
        }
      },
      invalidatesTags: ['AdminUser', 'AdminVendor'],
    }),

    getAdminVendors: build.query<AdminVendorsResponse, AdminVendorsParams>({
      query: (params) => ({ url: '/admin/vendors', params }),
      providesTags: ['AdminVendor'],
    }),

    getAdminOrders: build.query<AdminOrdersResponse, AdminOrdersParams>({
      query: (params) => ({ url: '/admin/orders', params }),
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useGetAdminVendorsQuery,
  useGetAdminOrdersQuery,
} = adminApi;
