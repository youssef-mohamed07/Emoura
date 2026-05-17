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
    <div className="overflow-hidden bg-rosedark py-4 text-white" aria-hidden="true">
      <div className="flex w-max animate-ticker gap-10 text-sm font-black">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex gap-10 px-5">
            {words.map((word) => (
              <span key={`${index}-${word}`}>{word}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
