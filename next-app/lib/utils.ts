import { categories, WHATSAPP } from "./data";
import type { CategoryKey, Lang, Order, Product } from "./types";

export const currency = (value: number, lang: Lang = "ar"): string =>
  `${Number(value || 0).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")} ${
    lang === "ar" ? "ج.م" : "EGP"
  }`;

export const categoryName = (key: CategoryKey | string, lang: Lang = "ar"): string =>
  categories.find((c) => c.key === key)?.label?.[lang] || String(key);

export const productName = (product: Pick<Product, "name"> | undefined, lang: Lang = "ar"): string =>
  product?.name?.[lang] || product?.name?.ar || "";

export const productMainImage = (product: Pick<Product, "img" | "images"> | undefined): string =>
  product?.images?.[0] || product?.img || "";

export const waLink = (message: string): string =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

export const paymentLabel = (
  payment: Order["payment"] | string,
  lang: Lang = "ar"
): string => {
  const map: Record<Lang, Record<string, string>> = {
    ar: { cod: "الدفع عند الاستلام", instapay: "InstaPay", vodafone: "Vodafone Cash" },
    en: { cod: "Cash on Delivery", instapay: "InstaPay", vodafone: "Vodafone Cash" },
  };
  return map[lang]?.[payment] || payment;
};

export const validateEgPhone = (phone: string): boolean =>
  /^(\+?20)?(010|011|012|015)\d{8}$/.test((phone || "").replace(/\s+/g, ""));

export const formatOrder = (order: Order, lang: Lang = "ar"): string => {
  const lines =
    lang === "ar"
      ? [
          "طلب جديد من Emoura",
          `رقم الطلب: ${order.number}`,
          `الاسم: ${order.firstName} ${order.lastName || ""}`.trim(),
          `الهاتف: ${order.phone}`,
          order.email ? `البريد: ${order.email}` : "",
          `العنوان: ${order.governorate} - ${order.city || ""} - ${order.address}`,
          order.notes ? `ملاحظات: ${order.notes}` : "",
          `الدفع: ${paymentLabel(order.payment, lang)}`,
          "المنتجات:",
          ...order.items.map(
            (item) =>
              `- ${productName(item, lang)} × ${item.qty} = ${currency(
                item.price * item.qty,
                lang
              )}`
          ),
          typeof order.subtotal === "number"
            ? `الإجمالي الفرعي: ${currency(order.subtotal, lang)}`
            : "",
          typeof order.shippingFee === "number"
            ? `الشحن: ${currency(order.shippingFee, lang)}`
            : "",
          `الإجمالي: ${currency(order.total, lang)}`,
        ]
      : [
          "New order from Emoura",
          `Order #: ${order.number}`,
          `Name: ${order.firstName} ${order.lastName || ""}`.trim(),
          `Phone: ${order.phone}`,
          order.email ? `Email: ${order.email}` : "",
          `Address: ${order.governorate} - ${order.city || ""} - ${order.address}`,
          order.notes ? `Notes: ${order.notes}` : "",
          `Payment: ${paymentLabel(order.payment, lang)}`,
          "Items:",
          ...order.items.map(
            (item) =>
              `- ${productName(item, lang)} × ${item.qty} = ${currency(
                item.price * item.qty,
                lang
              )}`
          ),
          typeof order.subtotal === "number"
            ? `Subtotal: ${currency(order.subtotal, lang)}`
            : "",
          typeof order.shippingFee === "number"
            ? `Shipping: ${currency(order.shippingFee, lang)}`
            : "",
          `Total: ${currency(order.total, lang)}`,
        ];
  return lines.filter(Boolean).join("\n");
};
