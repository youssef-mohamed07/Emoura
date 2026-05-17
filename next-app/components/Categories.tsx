"use client";

import Image from "next/image";
import { categories } from "@/lib/data";
import { categoryName } from "@/lib/utils";
import type { CategoryKey } from "@/lib/types";
import { useStore } from "./StoreProvider";

interface CategoriesProps {
  setFilter: (key: CategoryKey | "all") => void;
}

export default function Categories({ setFilter }: CategoriesProps) {
  const { lang, t } = useStore();
  const scrollToProducts = () =>
    setTimeout(
      () =>
        document
          .getElementById("products")
          ?.scrollIntoView({ behavior: "smooth" }),
      80
    );

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-sm font-black text-rosebrand">Categories</span>
          <h2 className="mt-2 text-5xl font-bold text-rosedark">
            {t.categoriesTitle}
          </h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => {
              setFilter(cat.key);
              scrollToProducts();
            }}
            className="group relative h-64 overflow-hidden rounded-lg bg-roselight text-start shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
          >
            <Image
              src={cat.img}
              alt={categoryName(cat.key, lang)}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rosedark/80 via-rosebrand/[.18] to-white/10" />
            <div className="absolute inset-x-4 top-4 h-px bg-gradient-to-l from-white/70 to-transparent" />
            <div className="absolute bottom-4 end-4 start-4 text-lg font-black text-white">
              {categoryName(cat.key, lang)}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
