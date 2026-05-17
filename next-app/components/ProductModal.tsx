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
      className="fixed inset-0 z-[80] grid place-items-center bg-rosedark/45 p-4 backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={productName(product, lang)}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="grid max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-soft lg:grid-cols-2"
      >
        <div className="bg-rosepale p-6 sm:p-8">
          <div className="relative mx-auto h-[320px] w-full overflow-hidden rounded-2xl sm:h-[420px]">
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
            <div className="mt-4 grid grid-cols-3 gap-2">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`relative h-20 overflow-hidden rounded-lg border-2 transition ${
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
        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-pressed={fav}
              aria-label={fav ? t.favRemoved : t.favAdded}
              className={`grid h-11 w-11 place-items-center rounded-full text-xl ${
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
          <div className="text-sm font-black text-rosebrand">
            {categoryName(product.category, lang)}
          </div>
          <h2 className="mt-2 text-3xl font-bold text-rosedark sm:text-4xl">
            {productName(product, lang)}
          </h2>
          <div className="mt-3">
            <Stars rating={product.rating} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-black text-rosebrand">
              {currency(product.price, lang)}
            </span>
            <span className="font-bold text-stone-400 line-through">
              {currency(product.oldPrice, lang)}
            </span>
            <span className="rounded-full bg-rosebrand px-3 py-1 text-xs font-black text-white">
              {product.discount}% {t.discount}
            </span>
          </div>
          <p className="mt-5 leading-8 text-stone-600">
            {t.productDescription}
          </p>
          <div className="mt-6 flex items-center gap-3">
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
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                addToCart(product, qty);
                close();
              }}
              className="rounded-full bg-rosebrand px-6 py-4 font-black text-white shadow-soft hover:bg-rosedark"
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
              className="rounded-full bg-gold px-6 py-4 font-black text-rosedark shadow-gold hover:bg-rosebrand hover:text-white"
            >
              {t.buyNow}
            </button>
          </div>
          <div className="mt-6 grid gap-2 text-sm font-black text-rosedark sm:grid-cols-3">
            <span className="rounded-lg bg-rosepale p-3 text-center">{t.trust1}</span>
            <span className="rounded-lg bg-rosepale p-3 text-center">{t.trust2}</span>
            <span className="rounded-lg bg-rosepale p-3 text-center">{t.trust3}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
