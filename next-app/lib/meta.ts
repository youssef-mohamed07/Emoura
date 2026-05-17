import { createHash } from "node:crypto";

/**
 * Meta (Facebook / Instagram) Pixel + Conversions API helpers.
 *
 * The Pixel sends events from the browser; CAPI sends them from the server.
 * Both calls share the same `event_id` so Meta dedupes them and we don't
 * lose tracking when the browser pixel is blocked (iOS / ad blockers).
 *
 * Docs:
 * - https://developers.facebook.com/docs/marketing-api/conversions-api
 * - https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
export const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
export const META_CAPI_TEST_EVENT_CODE =
  process.env.META_CAPI_TEST_EVENT_CODE || "";

const CAPI_API_VERSION = "v21.0";

export type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Search"
  | "Lead"
  | "Contact";

export interface MetaContent {
  id: string;
  quantity?: number;
  item_price?: number;
}

export interface MetaCustomData {
  currency?: string;
  value?: number;
  content_ids?: string[];
  content_name?: string;
  content_type?: "product" | "product_group";
  content_category?: string;
  contents?: MetaContent[];
  num_items?: number;
  order_id?: string;
  search_string?: string;
}

export interface MetaUserData {
  /** Hashed email (sha256, lowercase, trimmed). */
  em?: string | string[];
  /** Hashed phone in E.164 digits only. */
  ph?: string | string[];
  /** Hashed first name. */
  fn?: string;
  /** Hashed last name. */
  ln?: string;
  /** Hashed city. */
  ct?: string;
  /** Hashed two-letter country code, e.g. "eg". */
  country?: string;
  /** External (your own) user identifier - do NOT hash. */
  external_id?: string;
  /** Facebook click ID, from `_fbc` cookie. Do NOT hash. */
  fbc?: string;
  /** Facebook browser ID, from `_fbp` cookie. Do NOT hash. */
  fbp?: string;
  /** Visitor IP (server only). Do NOT hash. */
  client_ip_address?: string;
  /** Visitor user-agent (server only). Do NOT hash. */
  client_user_agent?: string;
}

export interface MetaServerEvent {
  event_name: MetaEventName;
  event_time: number;
  event_id?: string;
  event_source_url?: string;
  action_source?:
    | "website"
    | "email"
    | "app"
    | "phone_call"
    | "chat"
    | "physical_store"
    | "system_generated"
    | "other";
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
}

/** Lower-case + trim then sha256-hex. Returns "" for empty input. */
export function hashSha256(value: string | undefined | null): string {
  if (!value) return "";
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return "";
  return createHash("sha256").update(normalized).digest("hex");
}

/**
 * Normalize an Egyptian phone number into E.164 digits (no `+`).
 * "01012345678" -> "201012345678"
 */
export function normalizeEgPhone(raw: string | undefined | null): string {
  if (!raw) return "";
  const digits = String(raw).replace(/\D+/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `20${digits.slice(1)}`;
  return digits;
}

/**
 * Build a stable event_id (per browser navigation) so the pixel call and the
 * CAPI call dedupe correctly.
 */
export function buildEventId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${random}`;
}

interface SendEventsResult {
  ok: boolean;
  status: number;
  body: unknown;
}

/**
 * Send one or more events to the Meta Conversions API.
 * Returns `{ ok: false }` (and logs) if the integration isn't configured;
 * never throws so the calling code can keep going.
 */
export async function sendCapiEvents(
  events: MetaServerEvent[]
): Promise<SendEventsResult> {
  if (!META_PIXEL_ID || !META_CAPI_ACCESS_TOKEN) {
    return {
      ok: false,
      status: 0,
      body: { error: "META_PIXEL_ID or META_CAPI_ACCESS_TOKEN missing" },
    };
  }
  if (!events.length) {
    return { ok: true, status: 0, body: { skipped: "empty" } };
  }

  const url = `https://graph.facebook.com/${CAPI_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(
    META_CAPI_ACCESS_TOKEN
  )}`;

  const payload: Record<string, unknown> = {
    data: events.map((event) => ({
      action_source: event.action_source || "website",
      ...event,
    })),
  };
  if (META_CAPI_TEST_EVENT_CODE) {
    payload.test_event_code = META_CAPI_TEST_EVENT_CODE;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("[meta-capi] non-2xx", response.status, body);
    }
    return { ok: response.ok, status: response.status, body };
  } catch (error) {
    const message = String((error as Error)?.message || error);
    console.error("[meta-capi] network failure:", message);
    return { ok: false, status: 0, body: { error: message } };
  }
}
