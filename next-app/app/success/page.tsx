"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { formatOrder, waLink } from "@/lib/utils";
import { track } from "@/lib/track";
import { useStore } from "@/components/StoreProvider";

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-10 w-10"
    aria-hidden="true"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .19 5.31.19 11.85c0 2.09.55 4.13 1.59 5.93L0 24l6.4-1.68a11.86 11.86 0 0 0 5.64 1.43h.01c6.55 0 11.86-5.31 11.86-11.85 0-3.17-1.23-6.14-3.39-8.42zM12.04 21.7h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.79 1 1.01-3.7-.23-.38a9.84 9.84 0 0 1-1.5-5.19c0-5.43 4.42-9.85 9.85-9.85 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.89 6.97c0 5.43-4.43 9.84-9.8 9.84zm5.4-7.37c-.3-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.58-.49-.5-.66-.51-.17-.01-.37-.01-.57-.01s-.52.07-.79.37c-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.5.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.74-.71 1.99-1.4.25-.69.25-1.27.17-1.4-.07-.13-.27-.2-.57-.35z" />
  </svg>
);

export default function SuccessPage() {
  const router = useRouter();
  const { t, lang, lastOrder } = useStore();

  useEffect(() => {
    if (!lastOrder) {
      router.replace("/");
    }
  }, [lastOrder, router]);

  // Fire Purchase to Meta Pixel (browser side). The CAPI side fires from
  // /api/send-order with the same eventId so Meta dedupes them.
  const purchaseFiredRef = useRef<string | null>(null);
  useEffect(() => {
    if (!lastOrder?.eventId) return;
    if (purchaseFiredRef.current === lastOrder.eventId) return;
    purchaseFiredRef.current = lastOrder.eventId;
    track({
      eventName: "Purchase",
      eventId: lastOrder.eventId,
      customData: {
        currency: "EGP",
        value: lastOrder.total,
        order_id: lastOrder.number,
        num_items: lastOrder.items.reduce((sum, item) => sum + item.qty, 0),
        content_type: "product",
        content_ids: lastOrder.items.map((item) => String(item.id)),
        contents: lastOrder.items.map((item) => ({
          id: String(item.id),
          quantity: item.qty,
          item_price: item.price,
        })),
      },
      userData: {
        em: lastOrder.email || undefined,
        ph: lastOrder.phone || undefined,
        fn: lastOrder.firstName || undefined,
        ln: lastOrder.lastName || undefined,
        ct: lastOrder.city || undefined,
        country: "eg",
        external_id: lastOrder.number,
      },
    });
  }, [lastOrder]);

  if (!lastOrder) return null;

  const message = formatOrder(lastOrder, lang);
  const customerName = lastOrder.firstName ? lastOrder.firstName : null;

  const steps = [
    { title: t.step1Title, sub: t.step1Sub },
    { title: t.step2Title, sub: t.step2Sub },
    { title: t.step3Title, sub: t.step3Sub },
  ];

  return (
    <main className="page mx-auto max-w-3xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
      {/* Success header */}
      <section className="rounded-2xl bg-white p-6 text-center shadow-soft sm:rounded-3xl sm:p-8 md:p-12">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rosepale text-rosebrand ring-8 ring-rosepale/40 sm:h-20 sm:w-20">
          <CheckIcon />
        </div>

        <h1 className="mt-5 text-3xl font-bold text-rosedark sm:mt-6 sm:text-4xl md:text-5xl">
          {customerName
            ? `${customerName}${lang === "ar" ? "،" : ","} ${t.successHeadline}`
            : t.successHeadline}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-stone-600 sm:text-base sm:leading-8 md:text-lg">
          {t.successMessage}
        </p>

        {/* Order number */}
        <div className="mx-auto mt-7 inline-flex flex-col items-center rounded-2xl border border-roselight bg-rosepale px-6 py-4 sm:mt-8 sm:px-10 sm:py-5">
          <span className="text-[10px] font-black tracking-[.18em] text-rosebrand sm:text-xs">
            {t.orderNumber}
          </span>
          <span className="mt-1 text-2xl font-black text-rosedark sm:text-3xl md:text-4xl">
            #{lastOrder.number}
          </span>
          <span className="mt-2 text-[10px] font-semibold text-stone-500 sm:text-xs">
            {t.successKeepNumber}
          </span>
        </div>
      </section>

      {/* Next steps timeline */}
      <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm sm:mt-6 sm:rounded-3xl sm:p-6 md:p-8">
        <h2 className="text-lg font-bold text-rosedark sm:text-xl md:text-2xl">
          {t.nextSteps}
        </h2>

        <ol className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-3 sm:gap-4">
              <div className="flex flex-col items-center">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rosebrand text-[10px] font-black text-white sm:h-9 sm:w-9 sm:text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < steps.length - 1 && (
                  <span
                    className="mt-1 w-px flex-1 bg-roselight"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex-1 pb-2">
                <h3 className="text-sm font-black text-rosedark sm:text-base">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs font-semibold leading-6 text-stone-500 sm:text-sm sm:leading-7">
                  {step.sub}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Actions */}
      <section className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-black text-white shadow-soft transition hover:bg-[#1ebe5d] sm:py-4 sm:text-base"
        >
          <WhatsAppIcon />
          <span>{t.contactWhatsApp}</span>
        </a>
        <Link
          href="/"
          className="rounded-full bg-rosedark px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-rosebrand sm:py-4 sm:text-base"
        >
          {t.continueShopping}
        </Link>
      </section>

      <p className="mt-5 text-center text-xs font-semibold text-stone-500 sm:mt-6">
        {t.needHelp}{" "}
        <a
          href={waLink("Hello Emoura, I have a question about my order")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-black text-rosebrand hover:text-rosedark"
        >
          {t.contactUs}
        </a>
      </p>
    </main>
  );
}
