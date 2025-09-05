import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchProducts, fetchProductsByCategory, fetchProductById } from '../api/productApi';
import type {ProductsState} from '../types/productsState';

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      allProducts: [],
      filteredProducts: [],
      currentProduct: null,
      searchTerm: '',
      sortBy: 'name',
      loading: false,
      error: null,

      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().filterAndSortProducts();
      },

      setSortBy: (sortBy: string) => {
        set({ sortBy });
        get().filterAndSortProducts();
      },

      fetchAllProducts: async () => {
        set({ loading: true, error: null });
        try {
          const products = await fetchProducts();
          set({ 
            allProducts: Array.isArray(products) ? products : [],
            loading: false 
          });
          get().filterAndSortProducts();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      fetchProductsByCategory: async (categoryId: string) => {
        set({ loading: true, error: null });
        try {
          const products = await fetchProductsByCategory(categoryId);
          set({ loading: false });
          return Array.isArray(products) ? products : [];
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category products';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      fetchSingleProduct: async (productId: string) => {
        set({ loading: true, error: null });
        try {
          const product = await fetchProductById(productId);
          set({ currentProduct: product, loading: false });
          return product;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
          set({ error: errorMessage, loading: false, currentProduct: null });
          throw error;
        }
      },

      filterAndSortProducts: () => {
        const { allProducts, searchTerm, sortBy } = get();
        
        let filtered = allProducts;

        if (searchTerm) {
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        const sorted = [...filtered].sort((a, b) => {
          switch (sortBy) {
            case 'name':
              return a.name.localeCompare(b.name);
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            default:
              return 0;
          }
        });

        set({ filteredProducts: sorted });
      },

      clearError: () => set({ error: null }),
      
      clearCurrentProduct: () => set({ currentProduct: null }),
    }),
    {
      name: 'products-storage',
      partialize: (state) => ({
        allProducts: state.allProducts,
        searchTerm: state.searchTerm,
        sortBy: state.sortBy,
      }),
    }
  )
);