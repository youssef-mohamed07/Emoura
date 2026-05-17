"use client";

import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { useStore } from "./StoreProvider";

export default function Footer() {
  const { t } = useStore();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-rosedark px-4 py-8 text-white sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-start">
        <div className="flex justify-center sm:justify-start">
          <BrandLogo dark />
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
          <Link href="/" className="font-bold text-roselight hover:text-white">
            {t.navHome}
          </Link>
          <Link href="/about" className="font-bold text-roselight hover:text-white">
            {t.navAbout}
          </Link>
          <Link href="/contact" className="font-bold text-roselight hover:text-white">
            {t.navContact}
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-7xl border-t border-white/10 pt-5 text-center text-xs font-bold text-roselight/70 sm:text-sm">
        © {year} Emoura · {t.rights}
      </div>
    </footer>
  );
}
