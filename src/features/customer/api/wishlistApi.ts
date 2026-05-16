import { baseApi } from '@/app/api';

const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<string[], void>({
      query: () => '/users/wishlist',
      providesTags: ['Wishlist'],
    }),

    toggleWishlist: builder.mutation<void, { productId: string; isWishlisted: boolean }>({
      queryFn: async ({ productId, isWishlisted }, _api, _extra, baseQuery) => {
        const result = await baseQuery({
          url: `/users/wishlist/${productId}`,
          method: isWishlisted ? 'DELETE' : 'POST',
        });
        return result.error ? { error: result.error } : { data: undefined };
      },
      async onQueryStarted({ productId, isWishlisted }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          wishlistApi.util.updateQueryData('getWishlist', undefined, (draft) => {
            if (isWishlisted) {
              const idx = draft.indexOf(productId);
              if (idx !== -1) draft.splice(idx, 1);
            } else {
              draft.push(productId);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const { useGetWishlistQuery, useToggleWishlistMutation } = wishlistApi;
