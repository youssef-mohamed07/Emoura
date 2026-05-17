import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ORDER_NOTIFICATION_EMAIL } from "@/lib/data";
import { sendCapiEvents, type MetaServerEvent } from "@/lib/meta";
import { hashSha256, normalizeEgPhone } from "@/lib/meta";

export const runtime = "nodejs";

type Lang = "ar" | "en";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  id?: number | string;
  category?: string;
}

interface OrderPayload {
  number: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  governorate?: string;
  city?: string;
  address?: string;
  notes?: string;
  payment?: string;
  items: OrderItem[];
  subtotal?: number;
  shippingFee?: number;
  total: number;
  lang?: Lang;
  /** Shared event id between Pixel (browser) and CAPI (server) for Purchase dedup. */
  eventId?: string;
}

interface MetaTrackingMeta {
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
}

const LABELS = {
  ar: {
    title: "طلب جديد من Emoura",
    orderNumber: "رقم الطلب",
    name: "الاسم",
    phone: "الهاتف",
    email: "البريد",
    address: "العنوان",
    payment: "الدفع",
    notes: "ملاحظات",
    product: "المنتج",
    qty: "الكمية",
    price: "السعر",
    subtotal: "الإجمالي الفرعي",
    shipping: "الشحن",
    total: "الإجمالي",
    subject: (n: string) => `طلب جديد ${n} - Emoura`,
    cod: "الدفع عند الاستلام",
    instapay: "InstaPay",
    vodafone: "Vodafone Cash",
    dir: "rtl",
  },
  en: {
    title: "New order from Emoura",
    orderNumber: "Order #",
    name: "Name",
    phone: "Phone",
    email: "Email",
    address: "Address",
    payment: "Payment",
    notes: "Notes",
    product: "Product",
    qty: "Qty",
    price: "Price",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    subject: (n: string) => `New order ${n} - Emoura`,
    cod: "Cash on Delivery",
    instapay: "InstaPay",
    vodafone: "Vodafone Cash",
    dir: "ltr",
  },
} as const;

function paymentLabel(payment: string | undefined, lang: Lang): string {
  const map = LABELS[lang];
  if (payment === "cod") return map.cod;
  if (payment === "instapay") return map.instapay;
  if (payment === "vodafone") return map.vodafone;
  return payment || "-";
}

function currency(value: number, lang: Lang): string {
  if (lang === "ar") {
    return `${Number(value || 0).toLocaleString("ar-EG")} ج.م`;
  }
  return `${Number(value || 0).toLocaleString("en-US")} EGP`;
}

function buildHtml(order: OrderPayload, lang: Lang): string {
  const L = LABELS[lang];
  const itemsRows = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border:1px solid #eee;">${item.name || "-"}</td>
          <td style="padding:8px;border:1px solid #eee;text-align:center;">${item.qty || 1}</td>
          <td style="padding:8px;border:1px solid #eee;text-align:center;">${currency((item.price || 0) * (item.qty || 1), lang)}</td>
        </tr>`
    )
    .join("");

  return `
  <div style="font-family:Tahoma,Arial,sans-serif;direction:${L.dir};background:#fffaf2;color:#3b2a24;padding:18px;">
    <h2 style="margin:0 0 12px;color:#a9783d;">${L.title}</h2>
    <p><strong>${L.orderNumber}:</strong> ${order.number || "-"}</p>
    <p><strong>${L.name}:</strong> ${order.firstName || ""} ${order.lastName || ""}</p>
    <p><strong>${L.phone}:</strong> ${order.phone || "-"}</p>
    <p><strong>${L.email}:</strong> ${order.email || "-"}</p>
    <p><strong>${L.address}:</strong> ${order.governorate || "-"} - ${order.city || "-"} - ${order.address || "-"}</p>
    <p><strong>${L.payment}:</strong> ${paymentLabel(order.payment, lang)}</p>
    <p><strong>${L.notes}:</strong> ${order.notes || "-"}</p>
    <table style="width:100%;border-collapse:collapse;margin-top:14px;background:#fff;">
      <thead>
        <tr>
          <th style="padding:8px;border:1px solid #eee;text-align:${lang === "ar" ? "right" : "left"};">${L.product}</th>
          <th style="padding:8px;border:1px solid #eee;text-align:center;">${L.qty}</th>
          <th style="padding:8px;border:1px solid #eee;text-align:center;">${L.price}</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>
    <div style="margin-top:14px;padding:12px 14px;background:#fff;border:1px solid #eee;border-radius:8px;">
      ${
        typeof order.subtotal === "number"
          ? `<p style="margin:0 0 6px;display:flex;justify-content:space-between;"><span>${L.subtotal}</span><span>${currency(order.subtotal, lang)}</span></p>`
          : ""
      }
      ${
        typeof order.shippingFee === "number"
          ? `<p style="margin:0 0 6px;display:flex;justify-content:space-between;"><span>${L.shipping}</span><span>${currency(order.shippingFee, lang)}</span></p>`
          : ""
      }
      <p style="margin:6px 0 0;display:flex;justify-content:space-between;font-weight:700;color:#a9783d;border-top:1px solid #f0e3cf;padding-top:8px;"><span>${L.total}</span><span>${currency(order.total, lang)}</span></p>
    </div>
  </div>`;
}

function parseRecipients(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function readCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

function readClientIp(request: Request): string | undefined {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim();
  return request.headers.get("x-real-ip") || undefined;
}

/**
 * Send a `Purchase` event to the Meta Conversions API. We do this server-side
 * (not just the browser pixel) so we still capture the conversion when the
 * pixel is blocked. The browser pixel uses the same `event_id` for dedup.
 */
async function trackPurchase(
  request: Request,
  order: OrderPayload,
  meta: MetaTrackingMeta
): Promise<void> {
  if (!order.eventId) return; // no shared id => skip to avoid double-counting
  const event: MetaServerEvent = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: order.eventId,
    event_source_url: meta.eventSourceUrl,
    action_source: "website",
    user_data: {
      em: order.email ? hashSha256(order.email) : undefined,
      ph: order.phone ? hashSha256(normalizeEgPhone(order.phone)) : undefined,
      fn: order.firstName ? hashSha256(order.firstName) : undefined,
      ln: order.lastName ? hashSha256(order.lastName) : undefined,
      ct: order.city ? hashSha256(order.city) : undefined,
      country: hashSha256("eg"),
      external_id: order.number,
      fbp: meta.fbp,
      fbc: meta.fbc,
      client_ip_address: readClientIp(request),
      client_user_agent: request.headers.get("user-agent") || undefined,
    },
    custom_data: {
      currency: "EGP",
      value: order.total,
      order_id: order.number,
      num_items: (order.items || []).reduce(
        (sum, item) => sum + (item.qty || 1),
        0
      ),
      content_type: "product",
      content_ids: (order.items || [])
        .map((item) => (item.id !== undefined ? String(item.id) : ""))
        .filter(Boolean),
      contents: (order.items || []).map((item) => ({
        id: item.id !== undefined ? String(item.id) : item.name,
        quantity: item.qty || 1,
        item_price: item.price || 0,
      })),
    },
  };
  await sendCapiEvents([event]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = body?.order as OrderPayload | undefined;
    const meta: MetaTrackingMeta = body?.meta || {};
    const lang: Lang = order?.lang === "en" ? "en" : "ar";

    // Pull fbp / fbc from cookies if the client didn't pass them.
    const cookieHeader = request.headers.get("cookie");
    const trackingMeta: MetaTrackingMeta = {
      fbp: meta.fbp || readCookieValue(cookieHeader, "_fbp"),
      fbc: meta.fbc || readCookieValue(cookieHeader, "_fbc"),
      eventSourceUrl: meta.eventSourceUrl,
    };

    const envRecipients = parseRecipients(process.env.ORDER_NOTIFICATION_EMAIL);
    const recipients =
      envRecipients.length > 0
        ? envRecipients
        : parseRecipients(ORDER_NOTIFICATION_EMAIL);

    if (!order?.number) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No notification recipients configured" },
        { status: 500 }
      );
    }

    const smtpUser = process.env.GMAIL_SMTP_USER;
    const smtpAppPassword = process.env.GMAIL_SMTP_APP_PASSWORD;
    const fromEmail = process.env.GMAIL_FROM_EMAIL || smtpUser;

    if (!smtpUser || !smtpAppPassword) {
      return NextResponse.json(
        { error: "Missing Gmail SMTP environment variables" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpAppPassword,
      },
    });

    try {
      await transporter.verify();
    } catch (verifyError) {
      const message = String((verifyError as Error)?.message || verifyError);
      console.error("[send-order] SMTP verify failed:", message);
      return NextResponse.json(
        { error: "SMTP authentication failed", details: message },
        { status: 500 }
      );
    }

    const info = await transporter.sendMail({
      from: `Emoura Orders <${fromEmail}>`,
      to: recipients,
      subject: LABELS[lang].subject(order.number),
      html: buildHtml(order, lang),
      replyTo: order?.email || undefined,
    });

    console.log("[send-order] sent:", {
      orderNumber: order.number,
      lang,
      to: recipients,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });

    if (info.rejected && info.rejected.length === recipients.length) {
      return NextResponse.json(
        {
          error: "All recipients rejected",
          details: `Rejected: ${info.rejected.join(", ")}`,
        },
        { status: 502 }
      );
    }

    // Best-effort Purchase event to Meta Conversions API. Don't fail the
    // request if this throws or the env isn't configured.
    try {
      await trackPurchase(request, order, trackingMeta);
    } catch (capiError) {
      console.error("[send-order] CAPI Purchase failed:", capiError);
    }

    return NextResponse.json({
      ok: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });
  } catch (error) {
    const message = String((error as Error)?.message || error);
    console.error("[send-order] failure:", message);
    return NextResponse.json(
      { error: "Server failure", details: message },
      { status: 500 }
    );
  }
}
