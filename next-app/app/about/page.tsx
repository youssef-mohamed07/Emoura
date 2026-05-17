"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreProvider";

export default function AboutPage() {
  const { t } = useStore();
  const features = [t.trust1, t.trust2, t.trust3, t.trust4];

  return (
    <main className="page mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
      <header className="mb-8 max-w-2xl sm:mb-10">
        <span className="text-[10px] font-black tracking-[.18em] text-rosebrand sm:text-xs">
          {t.aboutBadge}
        </span>
        <h1 className="mt-3 text-4xl font-bold text-rosedark sm:text-5xl md:text-6xl">
          Emoura
        </h1>
        <p className="mt-4 text-sm font-semibold leading-7 text-stone-600 sm:text-base sm:leading-8">
          {t.aboutTextShort}
        </p>
      </header>

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.05fr_.95fr]">
        {/* Story */}
        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6 md:p-8">
          <h2 className="text-xl font-bold text-rosedark sm:text-2xl md:text-3xl">
            {t.ourStory}
          </h2>
          <p className="mt-4 text-sm font-semibold leading-8 text-stone-600 sm:text-base sm:leading-9">
            {t.aboutTextLong}
          </p>

          <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2">
            <div className="rounded-xl bg-rosepale p-4 sm:p-5">
              <span className="text-[10px] font-black tracking-[.15em] text-rosebrand sm:text-xs">
                {t.aboutMission}
              </span>
              <p className="mt-2 text-xs font-semibold leading-6 text-stone-600 sm:text-sm sm:leading-7">
                {t.aboutMissionText}
              </p>
            </div>
            <div className="rounded-xl bg-rosepale p-4 sm:p-5">
              <span className="text-[10px] font-black tracking-[.15em] text-rosebrand sm:text-xs">
                {t.aboutValues}
              </span>
              <p className="mt-2 text-xs font-semibold leading-6 text-stone-600 sm:text-sm sm:leading-7">
                {t.aboutValuesText}
              </p>
            </div>
          </div>
        </section>

        {/* Why Emoura */}
        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6 md:p-8">
          <h2 className="text-xl font-bold text-rosedark sm:text-2xl md:text-3xl">
            {t.aboutWhy}
          </h2>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            {t.aboutWhySub}
          </p>

          <ul className="mt-5 divide-y divide-roselight sm:mt-6">
            {features.map((item, index) => (
              <li
                key={item}
                className="flex items-center gap-3 py-3 sm:gap-4 sm:py-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rosepale text-sm font-black text-rosebrand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-bold text-rosedark sm:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="mt-6 block rounded-full bg-rosebrand px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-rosedark sm:py-4 sm:text-base"
          >
            {t.shopNow}
          </Link>
        </section>
      </div>
    </main>
  );
}
