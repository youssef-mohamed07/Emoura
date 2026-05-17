"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/data";
import {
  categoryName,
  currency,
  productMainImage,
  productName,
} from "@/lib/utils";
import { track } from "@/lib/track";
import { useStore } from "./StoreProvider";
import { useUI } from "./UIProvider";

export default function SearchOverlay() {
  const { lang, t } = useStore();
  const { searchOpen, closeSearch, setSelectedProduct } = useUI();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (product) =>
        productName(product, lang).toLowerCase().includes(q) ||
        productName(product, lang === "ar" ? "en" : "ar")
          .toLowerCase()
          .includes(q) ||
        categoryName(product.category, lang).toLowerCase().includes(q)
    );
  }, [query, lang]);

  // Debounced Search tracking — 700ms after the user stops typing,
  // and only when the query is meaningful (3+ chars) to avoid noise.
  useEffect(() => {
    const trimmed = query.trim();
    if (!searchOpen || trimmed.length < 3) return;
    const timer = setTimeout(() => {
      track({
        eventName: "Search",
        customData: {
          search_string: trimmed,
          content_ids: results.slice(0, 10).map((product) => String(product.id)),
        },
      });
    }, 700);
    return () => clearTimeout(timer);
  }, [query, searchOpen, results]);

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[85] overflow-y-auto bg-cream/95 p-3 pt-20 backdrop-blur-xl sm:p-4 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label={t.search}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex gap-2 sm:gap-3">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-full border border-roselight bg-white px-4 py-3 text-sm font-bold outline-none focus:border-rosebrand sm:px-6 sm:py-4 sm:text-base"
            aria-label={t.search}
          />
          <button
            onClick={closeSearch}
            className="shrink-0 rounded-full bg-roselight px-4 text-sm font-black text-rosedark hover:bg-rosebrand hover:text-white sm:px-5 sm:text-base"
          >
            {t.close}
          </button>
        </div>
        <div className="mt-5 grid gap-3 pb-10 sm:mt-6">
          {results.length ? (
            results.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  setSelectedProduct(product);
                  closeSearch();
                }}
                className="flex items-center gap-3 rounded-lg bg-white p-3 text-start shadow-sm transition hover:shadow-soft sm:gap-4"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-rosepale sm:h-16 sm:w-16">
                  <Image
                    src={productMainImage(product)}
                    alt={productName(product, lang)}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <span className="line-clamp-2 flex-1 text-sm font-black text-rosedark sm:text-base">
                  {productName(product, lang)}
                </span>
                <span className="shrink-0 text-sm font-black text-rosebrand sm:text-base">
                  {currency(product.price, lang)}
                </span>
              </button>
            ))
          ) : (
            <div className="rounded-lg bg-white p-8 text-center font-bold text-rosedark">
              {t.noResults}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
