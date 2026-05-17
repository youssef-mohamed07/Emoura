"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categories, products } from "@/lib/data";
import { categoryName, currency, productName } from "@/lib/utils";
import type { CategoryKey } from "@/lib/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import { useStore } from "./StoreProvider";
import Ticker from "./Ticker";
import TrustStrip from "./TrustStrip";

type Filter = CategoryKey | "all";
type Sort = "featured" | "low" | "high" | "discount";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-extrabold transition ${
        active
          ? "bg-rosebrand text-white"
          : "bg-white text-rosedark hover:bg-roselight"
      }`}
    >
      {children}
    </button>
  );
}

export default function HomeShop() {
  const { lang, t } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("featured");

  // scroll to products if hash present
  useEffect(() => {
    if (window.location.hash === "#products") {
      setTimeout(
        () =>
          document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    }
  }, []);

  const visible = useMemo(() => {
    let list = filter === "all" ? products : products.filter((p) => p.category === filter);
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "discount") list = [...list].sort((a, b) => b.discount - a.discount);
    return list;
  }, [filter, sort]);

  const heroProduct = useMemo(
    () => products.find((product) => product.id === 1) || products[0],
    []
  );

  const scrollToProducts = (event: React.MouseEvent) => {
    event.preventDefault();
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="page pt-16 sm:pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,250,242,.90),rgba(248,239,228,.78)_55%,rgba(214,177,95,.38))]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-8 px-4 py-8 sm:min-h-[calc(100vh-80px)] sm:gap-12 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex rounded-full border border-gold/40 bg-white/70 px-3 py-1.5 text-xs font-extrabold text-rosebrand sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
              {t.heroBadge}
            </span>
            <h1 className="text-4xl font-bold leading-[.95] text-rosedark xs:text-5xl sm:text-7xl lg:text-8xl">
              Emoura
            </h1>
            <p className="mt-4 max-w-xl text-base font-semibold leading-8 text-stone-700 sm:mt-5 sm:text-lg sm:leading-9">
              {t.heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <a
                href="#products"
                onClick={scrollToProducts}
                className="rounded-full bg-rosebrand px-5 py-3 text-sm font-extrabold text-white shadow-soft transition hover:bg-rosedark sm:px-7 sm:py-4"
              >
                {t.shopNow}
              </a>
              <Link
                href="/about"
                className="rounded-full border border-rosebrand/25 bg-white/70 px-5 py-3 text-sm font-extrabold text-rosedark transition hover:bg-white sm:px-7 sm:py-4"
              >
                {t.ourStory}
              </Link>
            </div>
            <div className="mt-7 grid max-w-lg grid-cols-3 gap-2 sm:mt-9 sm:gap-3">
              {(
                [
                  ["500+", t.clients],
                  [`${products.length}+`, t.product],
                  ["100%", t.natural],
                ] as const
              ).map(([num, label]) => (
                <div
                  key={label}
                  className="glass rounded-lg border border-white p-3 text-center shadow-sm sm:p-4"
                >
                  <div className="text-lg font-black text-rosebrand sm:text-2xl">
                    {num}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 sm:text-xs">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute end-3 top-4 z-10 animate-float rounded-full bg-gold px-3 py-2 text-xs font-black text-rosedark shadow-gold sm:end-4 sm:top-6 sm:px-5 sm:py-3 sm:text-sm">
              {t.heroOffer}
            </div>
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white bg-white/80 p-3 shadow-soft sm:rounded-[2rem] sm:p-5">
              <div className="absolute inset-y-0 end-0 w-16 animate-shine bg-white/40 blur-xl" />
              <div className="relative mx-auto h-[260px] w-full overflow-hidden rounded-[1.25rem] xs:h-[300px] sm:h-[360px] sm:rounded-[1.5rem]">
                <Image
                  src={heroProduct.img}
                  alt={productName(heroProduct, lang)}
                  fill
                  sizes="(max-width: 1024px) 90vw, 500px"
                  className="object-cover"
                  priority
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-rosepale p-3 sm:mt-4 sm:p-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-extrabold text-rosedark">
                    {productName(heroProduct, lang)}
                  </div>
                  <div className="truncate text-xs font-bold text-stone-500">
                    {t.featuredOfferSub}
                  </div>
                </div>
                <div className="shrink-0 text-lg font-black text-rosebrand sm:text-xl">
                  {currency(heroProduct.price, lang)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Ticker />
      <Categories setFilter={setFilter} />
      <section
        id="products"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-black text-rosebrand sm:text-sm">
              Shop Emoura
            </span>
            <h2 className="mt-2 text-3xl font-bold text-rosedark sm:text-5xl">
              {t.products}
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="-mx-4 flex max-w-full gap-2 overflow-x-auto px-4 hide-scroll sm:mx-0 sm:px-0">
              <Chip active={filter === "all"} onClick={() => setFilter("all")}>
                {t.all}
              </Chip>
              {categories.map((cat) => (
                <Chip
                  key={cat.key}
                  active={filter === cat.key}
                  onClick={() => setFilter(cat.key)}
                >
                  {categoryName(cat.key, lang)}
                </Chip>
              ))}
            </div>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              className="rounded-full border border-roselight bg-white px-4 py-3 text-sm font-bold text-rosedark outline-none focus:border-rosebrand"
              aria-label="Sort"
            >
              <option value="featured">{t.featured}</option>
              <option value="low">{t.low}</option>
              <option value="high">{t.high}</option>
              <option value="discount">{t.maxDiscount}</option>
            </select>
          </div>
        </div>
        {visible.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center font-bold text-rosedark shadow-sm sm:p-10">
            {t.noResults}
          </div>
        )}
      </section>
      <TrustStrip />
    </main>
  );
}
