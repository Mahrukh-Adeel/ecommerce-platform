import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchCategories, fetchCategoryById } from '../api/categoryApi';
import { getCategoriesWithProducts } from '../data/categoriesData';
import type {CategoriesState} from '../types/categoriesState';


export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set) => ({
      categories: [],
      categoriesWithProducts: [],
      currentCategory: null,
      searchTerm: '',
      loading: false,
      error: null,

      setSearchTerm: (term: string) => set({ searchTerm: term }),

      fetchAllCategories: async () => {
        set({ loading: true, error: null });
        try {
          const categories = await fetchCategories();
          set({ 
            categories: Array.isArray(categories) ? categories : [],
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      fetchCategoriesWithProducts: async () => {
        set({ loading: true, error: null });
        try {
          const categoriesData = await getCategoriesWithProducts();
          set({ 
            categoriesWithProducts: Array.isArray(categoriesData) ? categoriesData : [],
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories with products';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      fetchSingleCategory: async (categoryId: string) => {
        set({ loading: true, error: null });
        try {
          const category = await fetchCategoryById(categoryId);
          set({ currentCategory: category, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category';
          set({ error: errorMessage, loading: false, currentCategory: null });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      
      clearCurrentCategory: () => set({ currentCategory: null }),
    }),
    {
      name: 'categories-storage',
      partialize: (state) => ({
        categories: state.categories,
        categoriesWithProducts: state.categoriesWithProducts,
      }),
    }
  )
);