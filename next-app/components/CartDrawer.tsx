"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  currency,
  productMainImage,
  productName,
  waLink,
} from "@/lib/utils";
import { useStore } from "./StoreProvider";
import { useUI } from "./UIProvider";

export default function CartDrawer() {
  const { lang, t, cart, subtotal, updateQty, removeItem, setBuyNowItem } =
    useStore();
  const { cartOpen, closeCart } = useUI();
  const router = useRouter();

  const message = useMemo(() => {
    if (!cart.length) return "";
    const lines = [
      lang === "ar" ? "طلب جديد من Emoura" : "New order from Emoura",
      ...cart.map(
        (item) =>
          `- ${productName(item, lang)} × ${item.qty} = ${currency(
            item.price * item.qty,
            lang
          )}`
      ),
      `${t.total}: ${currency(subtotal, lang)}`,
    ];
    return lines.join("\n");
  }, [cart, subtotal, lang, t.total]);

  const goCheckout = () => {
    setBuyNowItem(null);
    closeCart();
    router.push("/checkout");
  };

  return (
    <div
      className={`fixed inset-0 z-[75] ${cartOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!cartOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-rosedark/35 transition ${
          cartOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute end-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-soft transition duration-300 ${
          cartOpen
            ? "translate-x-0"
            : lang === "ar"
            ? "-translate-x-full"
            : "translate-x-full"
        }`}
        role="dialog"
        aria-label={t.cart}
      >
        <div className="flex items-center justify-between border-b border-roselight p-4 sm:p-5">
          <h2 className="text-2xl font-bold text-rosedark sm:text-3xl">{t.cart}</h2>
          <button
            onClick={closeCart}
            className="rounded-full bg-roselight px-4 py-2 text-sm font-black text-rosedark hover:bg-rosebrand hover:text-white"
          >
            {t.close}
          </button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:space-y-4 sm:p-5">
          {!cart.length && (
            <div className="rounded-lg bg-rosepale p-6 text-center font-bold text-rosedark">
              {t.emptyCart}
            </div>
          )}
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-lg border border-roselight p-3"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-rosepale sm:h-20 sm:w-20">
                <Image
                  src={productMainImage(item)}
                  alt={productName(item, lang)}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-sm font-black text-rosedark sm:text-base">
                  {productName(item, lang)}
                </div>
                <div className="text-sm font-black text-rosebrand">
                  {currency(item.price, lang)}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, -1)}
                    className="h-8 w-8 rounded-full bg-cream font-black hover:bg-roselight"
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span className="font-black">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, 1)}
                    className="h-8 w-8 rounded-full bg-cream font-black hover:bg-roselight"
                    aria-label="Increase"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="ms-auto text-xs font-black text-rosebrand hover:text-rosedark"
                  >
                    {t.remove}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-roselight p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between text-base font-black text-rosedark sm:mb-4 sm:text-lg">
            <span>{t.total}</span>
            <span>{currency(subtotal, lang)}</span>
          </div>
          <button
            type="button"
            disabled={!cart.length}
            onClick={goCheckout}
            className="mb-3 w-full rounded-full bg-rosebrand px-5 py-3.5 text-sm font-black text-white transition hover:bg-rosedark disabled:cursor-not-allowed disabled:opacity-40 sm:py-4 sm:text-base"
          >
            {t.checkout}
          </button>
          <a
            href={cart.length ? waLink(message) : "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!cart.length}
            className={`block w-full rounded-full bg-[#25D366] px-5 py-3.5 text-center text-sm font-black text-white transition hover:bg-[#1ebe5d] sm:py-4 sm:text-base ${
              !cart.length ? "pointer-events-none opacity-40" : ""
            }`}
          >
            {t.orderWhatsApp}
          </a>
        </div>
      </aside>
    </div>
  );
}
