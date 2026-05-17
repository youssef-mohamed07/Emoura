"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getShippingFee, governorates } from "@/lib/data";
import {
  currency,
  paymentLabel,
  productMainImage,
  productName,
  validateEgPhone,
} from "@/lib/utils";
import { track } from "@/lib/track";
import type { CartItem, CheckoutForm, Order, PaymentMethod } from "@/lib/types";
import Input from "@/components/Input";
import { useStore } from "@/components/StoreProvider";

interface PaymentOptionProps {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  details?: string;
  detailsLabel?: string;
}

function PaymentOption({
  active,
  onClick,
  title,
  subtitle,
  details,
  detailsLabel,
}: PaymentOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full rounded-xl border bg-white p-4 text-start transition ${
        active
          ? "border-rosebrand ring-2 ring-rosebrand/20"
          : "border-roselight hover:border-rosebrand/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ${
            active ? "border-rosebrand" : "border-stone-300"
          }`}
          aria-hidden="true"
        >
          {active && <span className="h-2.5 w-2.5 rounded-full bg-rosebrand" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black text-rosedark">
            {title}
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-stone-500">
            {subtitle}
          </span>
        </span>
      </div>
      {active && details && detailsLabel && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-rosepale px-3 py-2">
          <span className="text-xs font-black text-rosebrand">
            {detailsLabel}
          </span>
          <span
            className="text-sm font-black text-rosedark"
            dir="ltr"
            style={{ textAlign: "start" }}
          >
            {details}
          </span>
        </div>
      )}
    </button>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    lang,
    t,
    cart,
    buyNowItem,
    setBuyNowItem,
    clearCart,
    showToast,
    setLastOrder,
  } = useStore();

  const items: CartItem[] = useMemo(
    () => (buyNowItem ? [buyNowItem] : cart),
    [buyNowItem, cart]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );
  const itemsCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  useEffect(() => {
    if (!items.length) {
      router.replace("/");
    }
  }, [items.length, router]);

  // InitiateCheckout once per checkout session entry
  const initiatedRef = useRef(false);
  useEffect(() => {
    if (initiatedRef.current || !items.length) return;
    initiatedRef.current = true;
    const value = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const numItems = items.reduce((sum, item) => sum + item.qty, 0);
    track({
      eventName: "InitiateCheckout",
      customData: {
        currency: "EGP",
        value,
        num_items: numItems,
        content_type: "product",
        content_ids: items.map((item) => String(item.id)),
        contents: items.map((item) => ({
          id: String(item.id),
          quantity: item.qty,
          item_price: item.price,
        })),
      },
    });
  }, [items]);

  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    governorate: "",
    city: "",
    address: "",
    notes: "",
    payment: "cod",
  });
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const set = <K extends keyof CheckoutForm>(
    key: K,
    value: CheckoutForm[K]
  ) => {
    setForm((data) => ({ ...data, [key]: value }));
    if (key === "phone") setPhoneError("");
  };

  const valid = !!(
    form.firstName.trim() &&
    form.phone.trim() &&
    form.governorate &&
    form.address.trim() &&
    items.length > 0
  );

  const shippingFee = useMemo(
    () => (form.governorate ? getShippingFee(form.governorate, lang) : 0),
    [form.governorate, lang]
  );
  const total = subtotal + shippingFee;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || submitting) {
      if (!valid) showToast(t.fillRequired);
      return;
    }
    if (!validateEgPhone(form.phone)) {
      setPhoneError(t.phoneInvalid);
      return;
    }
    setSubmitting(true);
    const eventId = `pur-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const order: Order = {
      number: `EM${Date.now().toString().slice(-8)}`,
      items,
      subtotal,
      shippingFee,
      total,
      eventId,
      ...form,
    };
    try {
      const response = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: {
            ...order,
            lang,
            subtotal,
            shippingFee,
            items: order.items.map((item) => ({
              id: item.id,
              category: item.category,
              name: productName(item, lang),
              qty: item.qty,
              price: item.price,
            })),
          },
          meta: {
            eventSourceUrl:
              typeof window !== "undefined" ? window.location.href : undefined,
          },
        }),
      });
      if (!response.ok) {
        showToast(t.emailFailed);
      }
    } catch {
      showToast(t.emailFailed);
    } finally {
      setLastOrder(order);
      if (!buyNowItem) clearCart();
      setBuyNowItem(null);
      setSubmitting(false);
      router.push("/success");
    }
  };

  const steps = [t.stepInfo, t.stepDelivery, t.stepPayment];

  return (
    <main className="page mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
      <header className="mb-6 flex items-start justify-between gap-3 sm:mb-8 sm:items-center sm:gap-4">
        <div className="min-w-0">
          <span className="text-[10px] font-black tracking-[.18em] text-rosebrand sm:text-xs">
            {t.checkoutBadge}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-rosedark sm:text-4xl md:text-5xl">
            {t.checkout}
          </h1>
          <p className="mt-2 text-xs font-semibold text-stone-500 sm:text-sm">
            {t.checkoutSubtitle}
          </p>
        </div>
        <Link
          href="/"
          className="hidden shrink-0 rounded-full bg-white px-5 py-3 text-sm font-black text-rosedark shadow-sm hover:bg-roselight sm:inline-flex"
        >
          {t.back}
        </Link>
      </header>

      {/* Steps indicator */}
      <ol className="mb-6 flex items-center gap-2 sm:mb-8 sm:gap-4">
        {steps.map((label, index) => (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rosebrand text-[10px] font-black text-white sm:h-8 sm:w-8 sm:text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="hidden text-sm font-black text-rosedark sm:inline">
              {label}
            </span>
            {index < steps.length - 1 && (
              <span className="h-px flex-1 bg-roselight" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>

      <form onSubmit={submit} className="grid gap-5 sm:gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-5 sm:space-y-6">
          {/* Personal info */}
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 md:p-8">
            <h2 className="text-lg font-bold text-rosedark sm:text-xl md:text-2xl">
              {t.personalInfo}
            </h2>
            <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2">
              <Input
                label={`${t.firstName} *`}
                value={form.firstName}
                onChange={(value) => set("firstName", value)}
                required
                autoComplete="given-name"
              />
              <Input
                label={t.lastName}
                value={form.lastName}
                onChange={(value) => set("lastName", value)}
                autoComplete="family-name"
              />
              <Input
                label={`${t.phone} *`}
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(value) => set("phone", value)}
                required
                autoComplete="tel"
                error={phoneError}
                placeholder="01xxxxxxxxx"
              />
              <Input
                label={t.email}
                type="email"
                value={form.email}
                onChange={(value) => set("email", value)}
                autoComplete="email"
              />
            </div>
          </section>

          {/* Delivery */}
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 md:p-8">
            <h2 className="text-lg font-bold text-rosedark sm:text-xl md:text-2xl">
              {t.deliveryAddress}
            </h2>
            <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2">
              <label className="text-sm font-black text-rosedark">
                {t.governorate} *
                <select
                  value={form.governorate}
                  onChange={(event) =>
                    set("governorate", event.target.value)
                  }
                  required
                  className="mt-2 w-full rounded-lg border border-roselight bg-white px-4 py-3 outline-none focus:border-rosebrand"
                >
                  <option value="">{t.chooseGovernorate}</option>
                  {governorates[lang].map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label={t.city}
                value={form.city}
                onChange={(value) => set("city", value)}
                autoComplete="address-level2"
              />
              <label className="text-sm font-black text-rosedark sm:col-span-2">
                {t.fullAddress} *
                <textarea
                  value={form.address}
                  onChange={(event) => set("address", event.target.value)}
                  required
                  rows={3}
                  className="mt-2 w-full resize-none rounded-lg border border-roselight bg-white px-4 py-3 outline-none focus:border-rosebrand"
                  autoComplete="street-address"
                />
              </label>
              <label className="text-sm font-black text-rosedark sm:col-span-2">
                {t.notes}
                <textarea
                  value={form.notes}
                  onChange={(event) => set("notes", event.target.value)}
                  rows={2}
                  className="mt-2 w-full resize-none rounded-lg border border-roselight bg-white px-4 py-3 outline-none focus:border-rosebrand"
                />
              </label>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 md:p-8">
            <h2 className="text-lg font-bold text-rosedark sm:text-xl md:text-2xl">
              {t.paymentMethod}
            </h2>
            <div className="mt-4 grid gap-3 sm:mt-5">
              <PaymentOption
                active={form.payment === "cod"}
                onClick={() => set("payment", "cod" as PaymentMethod)}
                title={paymentLabel("cod", lang)}
                subtitle={t.paymentCodSub}
              />
              <PaymentOption
                active={form.payment === "instapay"}
                onClick={() => set("payment", "instapay" as PaymentMethod)}
                title="InstaPay"
                subtitle={t.paymentInstapaySub}
                detailsLabel={t.transferTo}
                details="01062441875@instapay"
              />
              <PaymentOption
                active={form.payment === "vodafone"}
                onClick={() => set("payment", "vodafone" as PaymentMethod)}
                title="Vodafone Cash"
                subtitle={t.paymentVodafoneSub}
                detailsLabel={t.transferTo}
                details="01062441875"
              />
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-28">
          <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6 md:p-7">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold text-rosedark sm:text-xl md:text-2xl">
                {t.orderSummary}
              </h2>
              <span className="shrink-0 text-xs font-bold text-stone-500">
                {itemsCount} {t.items}
              </span>
            </div>

            <ul className="mt-4 space-y-3 sm:mt-5">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-rosepale sm:h-14 sm:w-14">
                    <Image
                      src={productMainImage(item)}
                      alt={productName(item, lang)}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rosedark px-1 text-[10px] font-black text-white">
                      {item.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-sm font-black text-rosedark">
                      {productName(item, lang)}
                    </div>
                    <div className="mt-1 text-xs font-bold text-stone-500">
                      {currency(item.price, lang)}
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-sm font-black text-rosedark">
                    {currency(item.price * item.qty, lang)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2 border-t border-roselight pt-4">
              <div className="flex justify-between text-sm font-bold text-stone-600">
                <span>{t.subtotal}</span>
                <span>{currency(subtotal, lang)}</span>
              </div>
              <div className="flex justify-between gap-2 text-sm font-bold text-stone-600">
                <span>{t.delivery}</span>
                {form.governorate ? (
                  <span>{currency(shippingFee, lang)}</span>
                ) : (
                  <span className="text-end text-xs font-semibold text-stone-400">
                    {t.deliveryHint}
                  </span>
                )}
              </div>
              <div className="flex justify-between border-t border-roselight pt-3 text-base font-black text-rosedark sm:text-lg">
                <span>{t.total}</span>
                <span>{currency(total, lang)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!valid || submitting}
              className="mt-5 w-full rounded-full bg-rosebrand px-5 py-3.5 text-sm font-black text-white transition hover:bg-rosedark disabled:cursor-not-allowed disabled:opacity-50 sm:py-4 sm:text-base"
            >
              {submitting ? t.processing : t.confirmOrder}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-stone-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <span>{t.secure}</span>
            </div>
          </section>

          <Link
            href="/"
            className="block rounded-full border border-rosebrand/20 bg-white/80 px-5 py-3 text-center text-sm font-black text-rosedark transition hover:bg-white sm:hidden"
          >
            {t.back}
          </Link>
        </aside>
      </form>
    </main>
  );
}
