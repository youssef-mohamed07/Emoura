import { NextResponse } from "next/server";
import {
  hashSha256,
  normalizeEgPhone,
  sendCapiEvents,
  type MetaCustomData,
  type MetaEventName,
  type MetaServerEvent,
  type MetaUserData,
} from "@/lib/meta";

export const runtime = "nodejs";

interface IncomingUserData {
  em?: string | string[];
  ph?: string | string[];
  fn?: string;
  ln?: string;
  ct?: string;
  country?: string;
  external_id?: string;
}

interface RequestBody {
  eventName?: MetaEventName;
  eventId?: string;
  eventSourceUrl?: string;
  customData?: MetaCustomData;
  userData?: IncomingUserData;
}

const VALID_EVENTS: MetaEventName[] = [
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "AddPaymentInfo",
  "Purchase",
  "Search",
  "Lead",
  "Contact",
];

function readCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

function readClientIp(request: Request): string | undefined {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }
  return request.headers.get("x-real-ip") || undefined;
}

function hashList(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  const list = Array.isArray(value) ? value : [value];
  const hashed = list.map((item) => hashSha256(item)).filter(Boolean);
  return hashed.length ? hashed : undefined;
}

function buildUserData(
  request: Request,
  incoming: IncomingUserData | undefined
): MetaUserData {
  const cookieHeader = request.headers.get("cookie");
  const userAgent = request.headers.get("user-agent") || undefined;
  const ip = readClientIp(request);
  const fbp = readCookie(cookieHeader, "_fbp");
  const fbc = readCookie(cookieHeader, "_fbc");

  const phoneList = (() => {
    if (!incoming?.ph) return undefined;
    const list = Array.isArray(incoming.ph) ? incoming.ph : [incoming.ph];
    return list.map((value) => normalizeEgPhone(value)).filter(Boolean);
  })();

  return {
    em: hashList(incoming?.em),
    ph: phoneList?.length ? hashList(phoneList) : undefined,
    fn: hashSha256(incoming?.fn) || undefined,
    ln: hashSha256(incoming?.ln) || undefined,
    ct: hashSha256(incoming?.ct) || undefined,
    country: hashSha256(incoming?.country) || undefined,
    external_id: incoming?.external_id || undefined,
    fbp,
    fbc,
    client_ip_address: ip,
    client_user_agent: userAgent,
  };
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const eventName = body.eventName;
  if (!eventName || !VALID_EVENTS.includes(eventName)) {
    return NextResponse.json({ error: "Invalid eventName" }, { status: 400 });
  }

  const event: MetaServerEvent = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: body.eventId,
    event_source_url: body.eventSourceUrl,
    action_source: "website",
    user_data: buildUserData(request, body.userData),
    custom_data: body.customData,
  };

  const result = await sendCapiEvents([event]);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
