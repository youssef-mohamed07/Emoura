"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getT, type T } from "@/lib/i18n";
import { track } from "@/lib/track";
import type { CartItem, Lang, Order, Product } from "@/lib/types";
import { productName } from "@/lib/utils";

interface StoreState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: T;
  cart: CartItem[];
  favorites: number[];
  cartCount: number;
  subtotal: number;
  toast: string;
  showToast: (text: string) => void;
  addToCart: (product: Product, qty?: number) => void;
  updateQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: number) => void;
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
}

const StoreContext = createContext<StoreState | null>(null);

const safeGet = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const safeSet = (key: string, value: unknown): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / privacy errors
  }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // hydrate once on client
  useEffect(() => {
    setLangState(safeGet<Lang>("emoura-lang", "ar"));
    setCart(safeGet<CartItem[]>("emoura-cart", []));
    setFavorites(safeGet<number[]>("emoura-favorites", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) safeSet("emoura-cart", cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) safeSet("emoura-favorites", favorites);
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    safeSet("emoura-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, hydrated]);

  const t = getT(lang);

  const showToast = useCallback((text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const addToCart = useCallback(
    (product: Product, qty = 1) => {
      setCart((items) => {
        const existing = items.find((item) => item.id === product.id);
        if (existing) {
          return items.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + qty } : item
          );
        }
        return [...items, { ...product, qty }];
      });
      showToast(t.added);
      track({
        eventName: "AddToCart",
        customData: {
          currency: "EGP",
          value: product.price * qty,
          content_type: "product",
          content_ids: [String(product.id)],
          content_name: productName(product, "en"),
          content_category: product.category,
          contents: [
            { id: String(product.id), quantity: qty, item_price: product.price },
          ],
          num_items: qty,
        },
      });
    },
    [showToast, t.added]
  );

  const updateQty = useCallback((id: number, delta: number) => {
    setCart((items) =>
      items.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart((items) => items.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback(
    (id: number) => {
      setFavorites((ids) => {
        const isFav = ids.includes(id);
        showToast(isFav ? t.favRemoved : t.favAdded);
        return isFav ? ids.filter((item) => item !== id) : [...ids, id];
      });
    },
    [showToast, t.favAdded, t.favRemoved]
  );

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const value: StoreState = {
    lang,
    setLang,
    t,
    cart,
    favorites,
    cartCount,
    subtotal,
    toast,
    showToast,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    toggleFavorite,
    buyNowItem,
    setBuyNowItem,
    lastOrder,
    setLastOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
