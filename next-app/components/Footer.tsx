"use client";

import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { useStore } from "./StoreProvider";

export default function Footer() {
  const { t } = useStore();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-rosedark px-4 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <BrandLogo dark />
        </div>
        <div className="flex flex-wrap gap-3">
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
      <div className="mx-auto mt-6 max-w-7xl border-t border-white/10 pt-5 text-center text-sm font-bold text-roselight/70">
        © {year} Emoura · {t.rights}
      </div>
    </footer>
  );
}
