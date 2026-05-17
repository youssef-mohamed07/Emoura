"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  categoryName,
  currency,
  productMainImage,
  productName,
} from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useStore } from "./StoreProvider";
import { useUI } from "./UIProvider";
import Stars from "./Stars";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang, t, favorites, toggleFavorite, addToCart, setBuyNowItem } =
    useStore();
  const { setSelectedProduct } = useUI();
  const router = useRouter();
  const fav = favorites.includes(product.id);

  const handleBuyNow = () => {
    setBuyNowItem({ ...product, qty: 1 });
    router.push("/checkout");
  };

  return (
    <article
      onClick={() => setSelectedProduct(product)}
      className="product-card group cursor-pointer overflow-hidden rounded-lg border border-roselight/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative bg-rosepale p-2 sm:p-4">
        <span className="absolute end-2 top-2 z-10 rounded-full bg-rosebrand px-2 py-0.5 text-[10px] font-black text-white sm:end-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
          {product.discount}% {t.discount}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={fav ? t.favRemoved : t.favAdded}
          aria-pressed={fav}
          className={`absolute start-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full text-base shadow-sm transition sm:start-3 sm:top-3 sm:h-10 sm:w-10 sm:text-xl ${
            fav
              ? "bg-rosebrand text-white"
              : "bg-white text-rosedark hover:bg-roselight"
          }`}
        >
          {fav ? "♥" : "♡"}
        </button>
        <div className="relative mx-auto h-40 w-full overflow-hidden rounded-lg xs:h-48 sm:h-56">
          <Image
            src={productMainImage(product)}
            alt={productName(product, lang)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 22vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="actions absolute inset-x-2 bottom-2 flex gap-1.5 sm:inset-x-4 sm:bottom-4 sm:gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              addToCart(product);
            }}
            className="flex-1 rounded-full bg-rosedark px-2 py-2 text-[10px] font-black text-white hover:bg-black/80 sm:px-3 sm:py-3 sm:text-xs"
          >
            {t.addToCart}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleBuyNow();
            }}
            className="flex-1 rounded-full bg-gold px-2 py-2 text-[10px] font-black text-rosedark hover:bg-rosebrand hover:text-white sm:px-3 sm:py-3 sm:text-xs"
          >
            {t.buyNow}
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="text-[10px] font-black text-rosebrand sm:text-xs">
          {categoryName(product.category, lang)}
        </div>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-black leading-5 text-rosedark sm:mt-2 sm:min-h-12 sm:text-lg sm:leading-6">
          {productName(product, lang)}
        </h3>
        <div className="mt-2">
          <Stars rating={product.rating} />
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:mt-3">
          <span className="text-base font-black text-rosebrand sm:text-xl">
            {currency(product.price, lang)}
          </span>
          <span className="text-xs font-bold text-stone-400 line-through sm:text-sm">
            {currency(product.oldPrice, lang)}
          </span>
        </div>
      </div>
    </article>
  );
}
