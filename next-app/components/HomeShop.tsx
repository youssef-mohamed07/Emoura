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
    <main className="page pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,250,242,.90),rgba(248,239,228,.78)_55%,rgba(214,177,95,.38))]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex rounded-full border border-gold/40 bg-white/70 px-4 py-2 text-sm font-extrabold text-rosebrand">
              {t.heroBadge}
            </span>
            <h1 className="text-5xl font-bold leading-[.95] text-rosedark sm:text-7xl lg:text-8xl">
              Emoura
            </h1>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-9 text-stone-700">
              {t.heroText}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#products"
                onClick={scrollToProducts}
                className="rounded-full bg-rosebrand px-7 py-4 text-sm font-extrabold text-white shadow-soft transition hover:bg-rosedark"
              >
                {t.shopNow}
              </a>
              <Link
                href="/about"
                className="rounded-full border border-rosebrand/25 bg-white/70 px-7 py-4 text-sm font-extrabold text-rosedark transition hover:bg-white"
              >
                {t.ourStory}
              </Link>
            </div>
            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
              {(
                [
                  ["500+", t.clients],
                  [`${products.length}+`, t.product],
                  ["100%", t.natural],
                ] as const
              ).map(([num, label]) => (
                <div
                  key={label}
                  className="glass rounded-lg border border-white p-4 text-center shadow-sm"
                >
                  <div className="text-2xl font-black text-rosebrand">{num}</div>
                  <div className="text-xs font-bold text-stone-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute end-4 top-6 z-10 animate-float rounded-full bg-gold px-5 py-3 text-sm font-black text-rosedark shadow-gold">
              {t.heroOffer}
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/80 p-5 shadow-soft">
              <div className="absolute inset-y-0 end-0 w-16 animate-shine bg-white/40 blur-xl" />
              <div className="relative mx-auto h-[360px] w-full overflow-hidden rounded-[1.5rem]">
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
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-rosepale p-4">
                <div>
                  <div className="text-sm font-extrabold text-rosedark">
                    {productName(heroProduct, lang)}
                  </div>
                  <div className="text-xs font-bold text-stone-500">
                    {t.featuredOfferSub}
                  </div>
                </div>
                <div className="text-xl font-black text-rosebrand">
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
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-sm font-black text-rosebrand">Shop Emoura</span>
            <h2 className="mt-2 text-5xl font-bold text-rosedark">{t.products}</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex max-w-full gap-2 overflow-x-auto hide-scroll">
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center font-bold text-rosedark shadow-sm">
            {t.noResults}
          </div>
        )}
      </section>
      <TrustStrip />
    </main>
  );
}
