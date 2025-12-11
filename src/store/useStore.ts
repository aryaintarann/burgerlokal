import { create } from 'zustand';
import { Product, Modifier } from '@prisma/client';

export type ProductWithModifiers = Product & { modifiers: Modifier[] };

export interface CartItem {
    id: string;
    product: ProductWithModifiers;
    quantity: number;
    selectedModifiers: Modifier[];
    price: number;
}

interface StoreState {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;

    selectedProduct: ProductWithModifiers | null;
    isModalOpen: boolean;
    openProductModal: (product: ProductWithModifiers) => void;
    closeProductModal: () => void;

    isCartOpen: boolean;
    toggleCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
    cart: [],
    addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
    removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
    clearCart: () => set({ cart: [] }),

    selectedProduct: null,
    isModalOpen: false,
    openProductModal: (product) => set({ selectedProduct: product, isModalOpen: true }),
    closeProductModal: () => set({ selectedProduct: null, isModalOpen: false }),

    isCartOpen: false,
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}));
