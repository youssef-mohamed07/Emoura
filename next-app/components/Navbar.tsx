"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import BrandLogo from "./BrandLogo";
import { useStore } from "./StoreProvider";
import { useUI } from "./UIProvider";

export default function Navbar() {
  const { lang, setLang, t, cartCount, favorites } = useStore();
  const { openCart, openSearch } = useUI();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: Array<[string, string]> = [
    ["/", t.navHome],
    ["/about", t.navAbout],
    ["/contact", t.navContact],
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navTo = (href: string) => {
    setMobileOpen(false);
    router.push(href);
  };

  const goToProducts = () => {
    setMobileOpen(false);
    if (pathname === "/") {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#products");
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-cream/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Emoura home" className="flex shrink-0 items-center gap-3">
          <BrandLogo compact />
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {links.map(([href, label]) => (
            <button
              key={href}
              onClick={() => navTo(href)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                isActive(href)
                  ? "bg-roselight text-rosedark"
                  : "text-stone-700 hover:bg-white"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={goToProducts}
            className="rounded-full px-5 py-2 text-sm font-bold text-stone-700 hover:bg-white"
          >
            {t.navShop}
          </button>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="hidden rounded-full bg-white px-3 py-2 text-xs font-black text-rosedark shadow-sm hover:bg-roselight sm:inline"
            aria-label={`Switch to ${t.language === "EN" ? "English" : "Arabic"}`}
          >
            {t.language}
          </button>
          <button
            aria-label={t.search}
            onClick={openSearch}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-lg font-bold text-rosedark shadow-sm transition hover:bg-roselight sm:h-11 sm:w-11 sm:text-xl"
          >
            ⌕
          </button>
          <button
            onClick={() => navTo("/favorites")}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-lg font-bold text-rosedark shadow-sm transition hover:bg-roselight sm:h-11 sm:w-11 sm:text-xl"
            aria-label={t.favorites}
          >
            ♡
            {favorites.length > 0 && (
              <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rosebrand px-1 text-[10px] font-black text-white">
                {favorites.length}
              </span>
            )}
          </button>
          <button
            onClick={openCart}
            className="relative rounded-full bg-rosebrand px-3 py-2.5 text-sm font-extrabold text-white shadow-soft transition hover:bg-rosedark sm:px-4 sm:py-3"
            aria-label={`${t.cart} (${cartCount})`}
          >
            <span className="hidden sm:inline">{t.cart}</span>
            <span className="sm:hidden">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -end-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-black text-rosedark sm:h-6 sm:min-w-6 sm:text-xs">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-lg shadow-sm md:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="border-t border-roselight bg-white/95 px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map(([href, label]) => (
              <button
                key={href}
                onClick={() => navTo(href)}
                className={`rounded-full px-5 py-3 text-start text-sm font-bold transition ${
                  isActive(href) ? "bg-roselight text-rosedark" : "text-stone-700"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={goToProducts}
              className="rounded-full px-5 py-3 text-start text-sm font-bold text-stone-700"
            >
              {t.navShop}
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                setLang(lang === "ar" ? "en" : "ar");
              }}
              className="rounded-full bg-roselight px-5 py-3 text-start text-sm font-black text-rosedark"
            >
              {t.language === "EN" ? "English" : "العربية"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
