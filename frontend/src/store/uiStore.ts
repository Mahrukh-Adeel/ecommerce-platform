import { create } from 'zustand';
import type { UIState } from '../types/UIState';

export const useUIStore = create<UIState>((set, get) => ({
  searchQuery: '',
  anchorEl: null,
  selectedImage: 0,
  quantity: 1,
  isModalOpen: false,
  modalType: null,
  componentLoading: {},

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  
  setAnchorEl: (element: HTMLElement | null) => set({ anchorEl: element }),
  
  setSelectedImage: (index: number) => set({ selectedImage: index }),
  
  setQuantity: (quantity: number) => set({ quantity: Math.max(1, quantity) }),
  
  incrementQuantity: () => {
    const { quantity } = get();
    set({ quantity: quantity + 1 });
  },
  
  decrementQuantity: () => {
    const { quantity } = get();
    set({ quantity: Math.max(1, quantity - 1) });
  },
  
  openModal: (type: string) => set({ isModalOpen: true, modalType: type }),
  
  closeModal: () => set({ isModalOpen: false, modalType: null }),
  
  setComponentLoading: (component: string, loading: boolean) => {
    const { componentLoading } = get();
    set({ 
      componentLoading: { 
        ...componentLoading, 
        [component]: loading 
      } 
    });
  },
  
  resetProductDetailState: () => set({ 
    selectedImage: 0, 
    quantity: 1 
  }),
}));
