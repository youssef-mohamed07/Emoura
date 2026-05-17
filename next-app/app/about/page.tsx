"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreProvider";

export default function AboutPage() {
  const { t } = useStore();
  const features = [t.trust1, t.trust2, t.trust3, t.trust4];

  return (
    <main className="page mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <span className="text-xs font-black tracking-[.18em] text-rosebrand">
          {t.aboutBadge}
        </span>
        <h1 className="mt-3 text-5xl font-bold text-rosedark sm:text-6xl">
          Emoura
        </h1>
        <p className="mt-4 text-base font-semibold leading-8 text-stone-600">
          {t.aboutTextShort}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        {/* Story */}
        <section className="rounded-2xl bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-2xl font-bold text-rosedark sm:text-3xl">
            {t.ourStory}
          </h2>
          <p className="mt-4 text-base font-semibold leading-9 text-stone-600">
            {t.aboutTextLong}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-rosepale p-5">
              <span className="text-xs font-black tracking-[.15em] text-rosebrand">
                {t.aboutMission}
              </span>
              <p className="mt-2 text-sm font-semibold leading-7 text-stone-600">
                {t.aboutMissionText}
              </p>
            </div>
            <div className="rounded-xl bg-rosepale p-5">
              <span className="text-xs font-black tracking-[.15em] text-rosebrand">
                {t.aboutValues}
              </span>
              <p className="mt-2 text-sm font-semibold leading-7 text-stone-600">
                {t.aboutValuesText}
              </p>
            </div>
          </div>
        </section>

        {/* Why Emoura */}
        <section className="rounded-2xl bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-2xl font-bold text-rosedark sm:text-3xl">
            {t.aboutWhy}
          </h2>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            {t.aboutWhySub}
          </p>

          <ul className="mt-6 divide-y divide-roselight">
            {features.map((item, index) => (
              <li
                key={item}
                className="flex items-center gap-4 py-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rosepale text-sm font-black text-rosebrand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-bold text-rosedark">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="mt-6 block rounded-full bg-rosebrand px-6 py-4 text-center font-black text-white transition hover:bg-rosedark"
          >
            {t.shopNow}
          </Link>
        </section>
      </div>
    </main>
  );
}
