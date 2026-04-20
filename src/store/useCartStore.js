import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, billingCycle) => {
        set((state) => {
          const defaultPricing = product.pricing[billingCycle] || {};
          const price = defaultPricing.amount || 0;
          
          const existingItemIndex = state.items.findIndex(
            (i) => i.productId === product.id && i.billingCycle === billingCycle
          );

          if (existingItemIndex > -1) {
            // Already in cart (software usually limits qty 1 per type, but let's allow it for simplicity)
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += 1;
            return { items: newItems, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                id: `${product.id}-${billingCycle}`,
                productId: product.id,
                name: product.name.en, // Or mapped to locale later
                type: product.type,
                billingCycle,
                price,
                currency: defaultPricing.currency || "USD",
                quantity: 1,
                cover: product.media?.cover || "",
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "pi-store-cart",
    }
  )
);
