import { baseApi } from '@/app/api';
import type { Product, ProductsResponse } from '@/features/vendor/types';
import type { ProductFormData } from '@/features/vendor/types/schemas';
import type { CustomerProduct, StorefrontResponse, Review } from '@/features/customer/types';

interface GetVendorProductsArgs {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

interface GetStorefrontProductsArgs {
  page: number;
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  sort: string;
}

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetVendorProductsArgs>({
      query: ({ page = 1, limit = 10, search = '', category = '' } = {}) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        return `/products?${params}`;
      },
      providesTags: ['Product'],
    }),

    getStorefrontProducts: builder.query<StorefrontResponse, GetStorefrontProductsArgs>({
      query: ({ page, search, category, minPrice, maxPrice, rating, sort }) => {
        const params = new URLSearchParams({ page: String(page), limit: '12' });
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (rating) params.set('rating', rating);
        if (sort) params.set('sort', sort);
        return `/products?${params}`;
      },
      providesTags: ['Product'],
    }),

    getProduct: builder.query<CustomerProduct, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    getProductReviews: builder.query<Review[], string>({
      query: (id) => `/products/${id}/reviews`,
    }),

    createProduct: builder.mutation<Product, ProductFormData>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: ProductFormData }>({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetStorefrontProductsQuery,
  useGetProductQuery,
  useGetProductReviewsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
