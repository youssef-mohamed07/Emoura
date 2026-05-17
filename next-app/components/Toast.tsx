"use client";

import { useStore } from "./StoreProvider";

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-5 right-5 z-[90] mx-auto max-w-fit animate-pop rounded-full bg-rosedark px-5 py-3 text-sm font-bold text-white shadow-soft"
    >
      {toast}
    </div>
  );
}
