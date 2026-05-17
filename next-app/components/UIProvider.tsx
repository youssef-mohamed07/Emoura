"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";

interface UIState {
  cartOpen: boolean;
  searchOpen: boolean;
  selectedProduct: Product | null;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSelectedProduct: (product: Product | null) => void;
}

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // body scroll lock
  useEffect(() => {
    const lock = cartOpen || searchOpen || !!selectedProduct;
    if (typeof document === "undefined") return;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, searchOpen, selectedProduct]);

  // ESC to close
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setSearchOpen(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value: UIState = {
    cartOpen,
    searchOpen,
    selectedProduct,
    openCart: useCallback(() => setCartOpen(true), []),
    closeCart: useCallback(() => setCartOpen(false), []),
    openSearch: useCallback(() => setSearchOpen(true), []),
    closeSearch: useCallback(() => setSearchOpen(false), []),
    setSelectedProduct,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIState {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }
  return context;
}
