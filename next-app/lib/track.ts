"use client";

/**
 * Client-side tracking helper.
 *
 * Fires events to:
 *   1. Meta Pixel (window.fbq) - immediate, runs in the browser
 *   2. /api/meta-event - server-side Conversions API call with the same event_id
 *
 * Sharing the same event_id between the two calls lets Meta dedupe them, so
 * we still capture conversions when the browser pixel is blocked (iOS,
 * uBlock, etc.) without double-counting when both reach Meta.
 */

import type {
  MetaCustomData,
  MetaEventName,
  MetaUserData,
} from "./meta";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
  }
}

interface FbqEventOptions {
  eventID?: string;
}

interface TrackInput {
  eventName: MetaEventName;
  eventId?: string;
  customData?: MetaCustomData;
  /** PII that we already have on the client (email/phone after checkout). Will be hashed server-side. */
  userData?: Pick<MetaUserData, "em" | "ph" | "fn" | "ln" | "ct" | "country" | "external_id">;
}

const ID_PREFIX: Record<MetaEventName, string> = {
  PageView: "pv",
  ViewContent: "vc",
  AddToCart: "atc",
  InitiateCheckout: "ic",
  AddPaymentInfo: "api",
  Purchase: "pur",
  Search: "srch",
  Lead: "lead",
  Contact: "contact",
};

function buildClientEventId(eventName: MetaEventName): string {
  const prefix = ID_PREFIX[eventName] || "evt";
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${random}`;
}

/**
 * Standard Meta events that Pixel knows natively. Anything else is sent via
 * `trackCustom`. Today we only use standard events.
 */
const STANDARD_EVENTS = new Set<MetaEventName>([
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "AddPaymentInfo",
  "Purchase",
  "Search",
  "Lead",
  "Contact",
]);

function fireBrowserPixel(
  eventName: MetaEventName,
  customData: MetaCustomData | undefined,
  options: FbqEventOptions
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  const action = STANDARD_EVENTS.has(eventName) ? "track" : "trackCustom";
  if (customData && Object.keys(customData).length > 0) {
    window.fbq(action, eventName, customData, options);
  } else {
    window.fbq(action, eventName, {}, options);
  }
}

async function fireServerPixel(input: TrackInput, eventId: string): Promise<void> {
  try {
    await fetch("/api/meta-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: input.eventName,
        eventId,
        eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
        customData: input.customData,
        userData: input.userData,
      }),
      keepalive: true,
    });
  } catch {
    // Network failure on tracking shouldn't block the user. The pixel call
    // will still cover the browser side.
  }
}

/**
 * Fire a Meta event from the browser. Sends both Pixel + Conversions API
 * with a shared `event_id` for deduplication.
 */
export function track(input: TrackInput): string {
  const eventId = input.eventId || buildClientEventId(input.eventName);
  fireBrowserPixel(input.eventName, input.customData, { eventID: eventId });
  // Don't await: fire-and-forget so UI stays snappy.
  void fireServerPixel(input, eventId);
  return eventId;
}
