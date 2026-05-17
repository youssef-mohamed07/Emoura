"use client";

import { useStore } from "./StoreProvider";

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-fit animate-pop rounded-full bg-rosedark px-4 py-2.5 text-xs font-bold text-white shadow-soft sm:bottom-5 sm:left-5 sm:right-5 sm:px-5 sm:py-3 sm:text-sm"
    >
      {toast}
    </div>
  );
}
