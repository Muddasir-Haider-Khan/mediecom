import { create } from "zustand";

export interface CartItemType {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
    stock: number;
}

interface CartState {
    items: CartItemType[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addItem: (item: Omit<CartItemType, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isOpen: false,

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

    addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
            set({
                items: get().items.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                        : i
                ),
                isOpen: true,
            });
        } else {
            set({
                items: [...get().items, { ...item, quantity: 1 }],
                isOpen: true,
            });
        }
    },

    removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

    updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
            set({ items: get().items.filter((i) => i.id !== id) });
        } else {
            set({
                items: get().items.map((i) =>
                    i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
                ),
            });
        }
    },

    clearCart: () => set({ items: [] }),

    totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
