"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  categoryName,
  currency,
  productName,
} from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useStore } from "./StoreProvider";
import { useUI } from "./UIProvider";
import Stars from "./Stars";

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct } = useUI();
  if (!selectedProduct) return null;
  return (
    <ModalBody
      key={selectedProduct.id}
      product={selectedProduct}
      close={() => setSelectedProduct(null)}
    />
  );
}

function ModalBody({ product, close }: { product: Product; close: () => void }) {
  const { lang, t, favorites, toggleFavorite, addToCart, setBuyNowItem } =
    useStore();
  const router = useRouter();
  const gallery = product.images?.length ? product.images : [product.img];
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState<string>(gallery[0]);
  const fav = favorites.includes(product.id);

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-rosedark/45 p-2 backdrop-blur-sm sm:p-4"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={productName(product, lang)}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="grid max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-soft sm:rounded-2xl lg:grid-cols-2 lg:max-h-[90vh]"
      >
        <div className="bg-rosepale p-4 sm:p-6 lg:p-8">
          <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl xs:h-72 sm:h-[420px] sm:rounded-2xl">
            <Image
              src={activeImage}
              alt={productName(product, lang)}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`relative h-16 overflow-hidden rounded-lg border-2 transition sm:h-20 ${
                    activeImage === image
                      ? "border-rosebrand"
                      : "border-transparent hover:border-roselight"
                  }`}
                  aria-label={`Image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-pressed={fav}
              aria-label={fav ? t.favRemoved : t.favAdded}
              className={`grid h-10 w-10 place-items-center rounded-full text-lg sm:h-11 sm:w-11 sm:text-xl ${
                fav
                  ? "bg-rosebrand text-white"
                  : "bg-roselight text-rosedark"
              }`}
            >
              {fav ? "♥" : "♡"}
            </button>
            <button
              onClick={close}
              className="rounded-full bg-roselight px-4 py-2 text-sm font-black text-rosedark hover:bg-rosebrand hover:text-white"
            >
              {t.close}
            </button>
          </div>
          <div className="text-xs font-black text-rosebrand sm:text-sm">
            {categoryName(product.category, lang)}
          </div>
          <h2 className="mt-2 text-2xl font-bold text-rosedark sm:text-3xl lg:text-4xl">
            {productName(product, lang)}
          </h2>
          <div className="mt-3">
            <Stars rating={product.rating} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-2xl font-black text-rosebrand sm:text-3xl">
              {currency(product.price, lang)}
            </span>
            <span className="text-sm font-bold text-stone-400 line-through sm:text-base">
              {currency(product.oldPrice, lang)}
            </span>
            <span className="rounded-full bg-rosebrand px-2.5 py-1 text-[10px] font-black text-white sm:px-3 sm:text-xs">
              {product.discount}% {t.discount}
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-stone-600 sm:mt-5 sm:text-base sm:leading-8">
            {t.productDescription}
          </p>
          <div className="mt-5 flex items-center gap-3 sm:mt-6">
            <span className="font-black text-rosedark">{t.quantity}</span>
            <div className="flex items-center rounded-full border border-roselight bg-cream">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-11 w-11 rounded-s-full font-black hover:bg-roselight"
                aria-label="Decrease"
              >
                −
              </button>
              <span className="grid h-11 w-12 place-items-center font-black">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="h-11 w-11 rounded-e-full font-black hover:bg-roselight"
                aria-label="Increase"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:mt-7 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                addToCart(product, qty);
                close();
              }}
              className="rounded-full bg-rosebrand px-6 py-3.5 font-black text-white shadow-soft hover:bg-rosedark sm:py-4"
            >
              {t.addToCart}
            </button>
            <button
              type="button"
              onClick={() => {
                setBuyNowItem({ ...product, qty });
                close();
                router.push("/checkout");
              }}
              className="rounded-full bg-gold px-6 py-3.5 font-black text-rosedark shadow-gold hover:bg-rosebrand hover:text-white sm:py-4"
            >
              {t.buyNow}
            </button>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-2 text-xs font-black text-rosedark xs:grid-cols-3 sm:mt-6 sm:text-sm">
            <span className="rounded-lg bg-rosepale p-3 text-center">
              {t.trust1}
            </span>
            <span className="rounded-lg bg-rosepale p-3 text-center">
              {t.trust2}
            </span>
            <span className="rounded-lg bg-rosepale p-3 text-center">
              {t.trust3}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
