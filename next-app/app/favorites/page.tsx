"use client";

import Link from "next/link";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";

export default function FavoritesPage() {
  const { t, favorites } = useStore();
  const list = products.filter((product) => favorites.includes(product.id));

  return (
    <main className="page mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-sm font-black text-rosebrand">My</span>
          <h1 className="mt-2 text-5xl font-bold text-rosedark">
            {t.favoritesPage}
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-full bg-white px-5 py-3 font-black text-rosedark shadow-sm hover:bg-roselight"
        >
          {t.back}
        </Link>
      </div>
      {list.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-2xl bg-white p-12 text-center shadow-sm">
          <div className="text-6xl">♡</div>
          <p className="mt-4 text-xl font-black text-rosedark">
            {t.emptyFavorites}
          </p>
          <Link
            href="/"
            className="mt-6 rounded-full bg-rosebrand px-6 py-3 font-black text-white hover:bg-rosedark"
          >
            {t.shopNow}
          </Link>
        </div>
      )}
    </main>
  );
}
