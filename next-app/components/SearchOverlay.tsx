"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { products } from "@/lib/data";
import {
  categoryName,
  currency,
  productMainImage,
  productName,
} from "@/lib/utils";
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

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[85] overflow-y-auto bg-cream/95 p-4 pt-24 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={t.search}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex gap-3">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-full border border-roselight bg-white px-6 py-4 font-bold outline-none focus:border-rosebrand"
            aria-label={t.search}
          />
          <button
            onClick={closeSearch}
            className="rounded-full bg-roselight px-5 font-black text-rosedark hover:bg-rosebrand hover:text-white"
          >
            {t.close}
          </button>
        </div>
        <div className="mt-6 grid gap-3 pb-10">
          {results.length ? (
            results.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  setSelectedProduct(product);
                  closeSearch();
                }}
                className="flex items-center gap-4 rounded-lg bg-white p-3 text-start shadow-sm transition hover:shadow-soft"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-rosepale">
                  <Image
                    src={productMainImage(product)}
                    alt={productName(product, lang)}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <span className="flex-1 font-black text-rosedark">
                  {productName(product, lang)}
                </span>
                <span className="font-black text-rosebrand">
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
