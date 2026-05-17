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
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-6 flex items-end justify-between sm:mb-8">
        <div>
          <span className="text-xs font-black text-rosebrand sm:text-sm">
            Categories
          </span>
          <h2 className="mt-2 text-3xl font-bold text-rosedark sm:text-5xl">
            {t.categoriesTitle}
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => {
              setFilter(cat.key);
              scrollToProducts();
            }}
            className="group relative h-44 overflow-hidden rounded-lg bg-roselight text-start shadow-sm transition hover:-translate-y-1 hover:shadow-soft xs:h-52 sm:h-64"
          >
            <Image
              src={cat.img}
              alt={categoryName(cat.key, lang)}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rosedark/80 via-rosebrand/[.18] to-white/10" />
            <div className="absolute inset-x-4 top-4 h-px bg-gradient-to-l from-white/70 to-transparent" />
            <div className="absolute bottom-3 end-3 start-3 text-sm font-black text-white sm:bottom-4 sm:end-4 sm:start-4 sm:text-lg">
              {categoryName(cat.key, lang)}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
