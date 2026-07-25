import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().items.find((i) => i.id === product.id)) {
          set({ items: [...get().items, product] });
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      isInWishlist: (id) => get().items.some((i) => i.id === id),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "glowcart-wishlist" }
  )
);
