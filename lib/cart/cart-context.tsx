"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type CartItemType = "test" | "package";

export interface CartItem {
  id: number;
  type: CartItemType;
  name: string;
  price: number;
  discountedPrice?: number;
  code?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number, type: CartItemType) => void;
  clearCart: () => void;
  isInCart: (id: number, type: CartItemType) => boolean;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("janseva-cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem("janseva-cart");
      }
    }
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem("janseva-cart", JSON.stringify(next));
  };

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id && i.type === item.type);
      if (exists) return prev;
      const next = [...prev, item];
      localStorage.setItem("janseva-cart", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((id: number, type: CartItemType) => {
    setItems((prev) => {
      const next = prev.filter((i) => !(i.id === id && i.type === type));
      localStorage.setItem("janseva-cart", JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, []);

  const isInCart = useCallback(
    (id: number, type: CartItemType) =>
      items.some((i) => i.id === id && i.type === type),
    [items]
  );

  const total = items.reduce(
    (sum, item) => sum + (item.discountedPrice ?? item.price),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        total,
        count: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
