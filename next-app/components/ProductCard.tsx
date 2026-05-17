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
      <div className="relative bg-rosepale p-4">
        <span className="absolute end-3 top-3 z-10 rounded-full bg-rosebrand px-3 py-1 text-xs font-black text-white">
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
          className={`absolute start-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full text-xl shadow-sm transition ${
            fav
              ? "bg-rosebrand text-white"
              : "bg-white text-rosedark hover:bg-roselight"
          }`}
        >
          {fav ? "♥" : "♡"}
        </button>
        <div className="relative mx-auto h-56 w-full overflow-hidden rounded-lg">
          <Image
            src={productMainImage(product)}
            alt={productName(product, lang)}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="actions absolute inset-x-4 bottom-4 flex gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              addToCart(product);
            }}
            className="flex-1 rounded-full bg-rosedark px-3 py-3 text-xs font-black text-white hover:bg-black/80"
          >
            {t.addToCart}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleBuyNow();
            }}
            className="flex-1 rounded-full bg-gold px-3 py-3 text-xs font-black text-rosedark hover:bg-rosebrand hover:text-white"
          >
            {t.buyNow}
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs font-black text-rosebrand">
          {categoryName(product.category, lang)}
        </div>
        <h3 className="mt-2 min-h-12 text-lg font-black leading-6 text-rosedark">
          {productName(product, lang)}
        </h3>
        <div className="mt-2">
          <Stars rating={product.rating} />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-black text-rosebrand">
            {currency(product.price, lang)}
          </span>
          <span className="text-sm font-bold text-stone-400 line-through">
            {currency(product.oldPrice, lang)}
          </span>
        </div>
      </div>
    </article>
  );
}
