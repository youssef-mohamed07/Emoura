"use client";

import { useMemo, useState } from "react";
import { EMAIL, PHONE, WHATSAPP } from "@/lib/data";
import { waLink } from "@/lib/utils";
import Input from "@/components/Input";
import { useStore } from "@/components/StoreProvider";

interface ContactCard {
  label: string;
  value: string;
  link?: string;
  external?: boolean;
}

export default function ContactPage() {
  const { t, lang } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const text = useMemo(() => {
    const intro = lang === "ar" ? "رسالة جديدة لـ Emoura" : "New message to Emoura";
    const nameLabel = lang === "ar" ? "الاسم" : "Name";
    const phoneLabel = lang === "ar" ? "الهاتف" : "Phone";
    const msgLabel = lang === "ar" ? "الرسالة" : "Message";
    return [
      intro,
      form.name && `${nameLabel}: ${form.name}`,
      form.phone && `${phoneLabel}: ${form.phone}`,
      form.message && `${msgLabel}: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [form, lang]);

  const cards: ContactCard[] = [
    {
      label: "WhatsApp",
      value: PHONE,
      link: waLink("Hello Emoura"),
      external: true,
    },
    {
      label: lang === "ar" ? "البريد الإلكتروني" : "Email",
      value: EMAIL,
      link: `mailto:${EMAIL}`,
    },
    {
      label: lang === "ar" ? "الهاتف" : "Phone",
      value: PHONE,
      link: `tel:+${WHATSAPP}`,
    },
    {
      label: t.workingHours,
      value: t.workingHoursValue,
    },
  ];

  return (
    <main className="page mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
      <header className="mb-8 max-w-2xl sm:mb-10">
        <span className="text-[10px] font-black tracking-[.18em] text-rosebrand sm:text-xs">
          {t.contactBadge}
        </span>
        <h1 className="mt-3 text-4xl font-bold text-rosedark sm:text-5xl md:text-6xl">
          {t.contactUs}
        </h1>
        <p className="mt-4 text-sm font-semibold leading-7 text-stone-600 sm:text-base sm:leading-8">
          {t.contactSubtitle}
        </p>
      </header>

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.05fr_.95fr]">
        {/* Form */}
        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6 md:p-8">
          <h2 className="text-xl font-bold text-rosedark sm:text-2xl md:text-3xl">
            {t.sendMessage}
          </h2>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            {t.sendMessageSub}
          </p>

          <div className="mt-5 grid gap-4 sm:mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t.yourName}
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
                autoComplete="name"
                placeholder={t.namePlaceholder}
              />
              <Input
                label={t.phone}
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(value) => setForm({ ...form, phone: value })}
                autoComplete="tel"
                placeholder={t.phonePlaceholder}
              />
            </div>
            <label className="text-sm font-black text-rosedark">
              {t.yourMessage}
              <textarea
                value={form.message}
                onChange={(event) =>
                  setForm({ ...form, message: event.target.value })
                }
                rows={6}
                placeholder={t.messagePlaceholder}
                className="mt-2 w-full resize-none rounded-lg border border-roselight bg-white px-4 py-3 outline-none transition focus:border-rosebrand"
              />
            </label>
            <a
              href={waLink(text)}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!form.message.trim()}
              className={`mt-2 rounded-full bg-rosebrand px-6 py-3.5 text-center text-sm font-black text-white shadow-soft transition hover:bg-rosedark sm:py-4 sm:text-base ${
                !form.message.trim() ? "pointer-events-none opacity-40" : ""
              }`}
            >
              {t.sendWhatsApp}
            </a>
          </div>
        </section>

        {/* Contact info */}
        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6 md:p-8">
          <h2 className="text-xl font-bold text-rosedark sm:text-2xl md:text-3xl">
            {t.reachUs}
          </h2>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            {t.reachUsSub}
          </p>

          <ul className="mt-5 divide-y divide-roselight sm:mt-6">
            {cards.map((card) => {
              const inner = (
                <>
                  <span className="block text-[10px] font-black tracking-[.15em] text-rosebrand sm:text-xs">
                    {card.label}
                  </span>
                  <span
                    className="mt-2 block break-all text-sm font-bold text-rosedark sm:text-base"
                    dir="ltr"
                    style={{ textAlign: "start" }}
                  >
                    {card.value}
                  </span>
                </>
              );
              return (
                <li key={card.label}>
                  {card.link ? (
                    <a
                      href={card.link}
                      target={card.external ? "_blank" : undefined}
                      rel={card.external ? "noopener noreferrer" : undefined}
                      className="block py-3 transition hover:text-rosebrand sm:py-4"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="py-3 sm:py-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <a
            href={waLink(lang === "ar" ? "Hello Emoura, I need help" : "Hello Emoura, I need help")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block rounded-full bg-rosedark px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-rosebrand sm:mt-6 sm:py-4 sm:text-base"
          >
            {t.helpWhatsApp}
          </a>
        </section>
      </div>
    </main>
  );
}
