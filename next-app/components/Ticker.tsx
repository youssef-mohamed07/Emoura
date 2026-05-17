"use client";

import { useStore } from "./StoreProvider";

export default function Ticker() {
  const { lang } = useStore();
  const words =
    lang === "ar"
      ? [
          "عناية طبيعية",
          "Emoura Beauty",
          "خصومات حصرية",
          "توصيل لكل محافظات مصر",
          "Glow Naturally",
        ]
      : [
          "Natural Care",
          "Emoura Beauty",
          "Exclusive Deals",
          "Delivery Across Egypt",
          "Glow Naturally",
        ];
  return (
    <div className="overflow-hidden bg-rosedark py-3 text-white sm:py-4" aria-hidden="true">
      <div className="flex w-max animate-ticker gap-6 text-xs font-black sm:gap-10 sm:text-sm">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex gap-6 px-3 sm:gap-10 sm:px-5">
            {words.map((word) => (
              <span key={`${index}-${word}`}>{word}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
