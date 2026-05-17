"use client";

import Link from "next/link";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";

export default function FavoritesPage() {
  const { t, favorites } = useStore();
  const list = products.filter((product) => favorites.includes(product.id));

  return (
    <main className="page mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8">
        <div>
          <span className="text-xs font-black text-rosebrand sm:text-sm">My</span>
          <h1 className="mt-2 text-3xl font-bold text-rosedark sm:text-5xl">
            {t.favoritesPage}
          </h1>
        </div>
        <Link
          href="/"
          className="shrink-0 rounded-full bg-white px-4 py-2.5 text-sm font-black text-rosedark shadow-sm hover:bg-roselight sm:px-5 sm:py-3 sm:text-base"
        >
          {t.back}
        </Link>
      </div>
      {list.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="text-5xl sm:text-6xl">♡</div>
          <p className="mt-4 text-lg font-black text-rosedark sm:text-xl">
            {t.emptyFavorites}
          </p>
          <Link
            href="/"
            className="mt-6 rounded-full bg-rosebrand px-6 py-3 text-sm font-black text-white hover:bg-rosedark sm:text-base"
          >
            {t.shopNow}
          </Link>
        </div>
      )}
    </main>
  );
}
