export interface UIState {
  searchQuery: string;
  anchorEl: HTMLElement | null;
  
  selectedImage: number;
  quantity: number;
  
  isModalOpen: boolean;
  modalType: string | null;
  
  componentLoading: Record<string, boolean>;
  
  setSearchQuery: (query: string) => void;
  setAnchorEl: (element: HTMLElement | null) => void;
  setSelectedImage: (index: number) => void;
  setQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  openModal: (type: string) => void;
  closeModal: () => void;
  setComponentLoading: (component: string, loading: boolean) => void;
  resetProductDetailState: () => void;
}