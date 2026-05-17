"use client";

import { useStore } from "./StoreProvider";

const iconClass = "h-6 w-6";

const LeafIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClass}
    aria-hidden="true"
  >
    <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 13-9 0 9-4 13-9 13" />
    <path d="M4 20s2-2 5-7" />
  </svg>
);

const TruckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClass}
    aria-hidden="true"
  >
    <path d="M3 7h11v10H3z" />
    <path d="M14 10h4l3 3v4h-7z" />
    <circle cx="7.5" cy="17.5" r="1.7" />
    <circle cx="17" cy="17.5" r="1.7" />
  </svg>
);

const RefreshIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClass}
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 0 1-15.5 6.3" />
    <path d="M3 12a9 9 0 0 1 15.5-6.3" />
    <path d="M21 4v5h-5" />
    <path d="M3 20v-5h5" />
  </svg>
);

const SupportIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClass}
    aria-hidden="true"
  >
    <path d="M4 14a8 8 0 1 1 16 0v3a2 2 0 0 1-2 2h-1v-7h3" />
    <path d="M4 14v3a2 2 0 0 0 2 2h1v-7H4" />
  </svg>
);

export default function TrustStrip() {
  const { t } = useStore();
  const items = [
    { title: t.trust1, sub: t.trust1Sub, Icon: LeafIcon },
    { title: t.trust2, sub: t.trust2Sub, Icon: TruckIcon },
    { title: t.trust3, sub: t.trust3Sub, Icon: RefreshIcon },
    { title: t.trust4, sub: t.trust4Sub, Icon: SupportIcon },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <span className="text-xs font-black tracking-[.2em] text-rosebrand">
            {t.whyEmoura}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-rosedark sm:text-4xl">
            {t.whyEmouraSub}
          </h2>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ title, sub, Icon }) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-rosebrand/30 hover:bg-white hover:shadow-soft"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-rosepale text-rosebrand shadow-sm transition group-hover:bg-rosebrand group-hover:text-white">
                <Icon />
              </span>
              <h3 className="mt-5 text-lg font-black text-rosedark">{title}</h3>
              <p className="mt-2 text-sm font-semibold leading-7 text-stone-500">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
