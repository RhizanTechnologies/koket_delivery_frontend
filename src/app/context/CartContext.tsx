"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCartItems, type CartItem } from "@/app/services/cartService";
import { useAuth } from "./AuthContext";

type CartContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  isLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? err?.message ?? "Unable to load cart.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateCartItemQuantity = useCallback((itemId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + (item.quantity ?? 0), 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      isLoading,
      error,
      refreshCart: fetchCart,
      updateCartItemQuantity,
    }),
    [cartItems, cartCount, isLoading, error, fetchCart, updateCartItemQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
