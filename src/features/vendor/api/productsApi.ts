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

// Backend always returns `data` + `images[]`; transform to the legacy `products` + `image` shape
interface BackendProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  rating: number;
  reviewCount: number;
  vendorId: string;
  vendorName: string;
  createdAt: string;
}
interface BackendProductsResponse {
  data: BackendProduct[];
  total: number;
  page: number;
  totalPages: number;
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
      transformResponse: (response: BackendProductsResponse): ProductsResponse => ({
        products: response.data.map(({ images, rating: _r, reviewCount: _rc, vendorName: _vn, ...rest }) => ({
          ...rest,
          image: images?.[0] ?? '',
        })),
        total: response.total,
        page: response.page,
        limit: 10,
      }),
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

    createReview: builder.mutation<Review, { productId: string; rating: number; comment: string }>({
      query: ({ productId, rating, comment }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: { rating, comment },
      }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    createProduct: builder.mutation<Product, ProductFormData>({
      query: ({ image, ...rest }) => ({
        url: '/products',
        method: 'POST',
        body: { ...rest, images: image ? [image] : [] },
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: ProductFormData }>({
      query: ({ id, data: { image, ...rest } }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: { ...rest, images: image ? [image] : [] },
      }),
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
  useCreateReviewMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
