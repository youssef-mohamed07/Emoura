import type { Category, Product } from "./types";

export const WHATSAPP = "201062441875";
export const EMAIL = "emabhf566@gmail.com";
export const PHONE = "01062441875";
// Owner email that receives new orders. Override via ORDER_NOTIFICATION_EMAIL env var.
export const ORDER_NOTIFICATION_EMAIL =
  process.env.ORDER_NOTIFICATION_EMAIL || "Omarsokar200f4@gmail.com";

export const products: Product[] = [
  { id: 1, name: { ar: "بوكس العيد للعناية الكاملة", en: "Eid Full Care Box" }, price: 499, oldPrice: 700, discount: 29, category: "offers", img: "/assets/offer-499-new.jpeg", rating: 5 },
  { id: 3, name: { ar: "عرض سيروم رموش مع سيروم الأظافر", en: "Lash Serum + Nail Serum Offer" }, price: 349, oldPrice: 550, discount: 36, category: "offers", img: "/assets/offer-lash-nail-349-new.jpeg", rating: 5 },
  { id: 4, name: { ar: "سيروم الأظافر", en: "Nail Serum" }, price: 199, oldPrice: 250, discount: 20, category: "nail-care", img: "/assets/nail-serum-1.jpeg", images: ["/assets/nail-serum-1.jpeg", "/assets/nail-serum-2.jpeg", "/assets/nail-serum-3.jpeg"], rating: 4 },
  { id: 8, name: { ar: "سيروم الرموش", en: "Lash Serum" }, price: 249, oldPrice: 350, discount: 29, category: "lash-care", img: "/assets/lash-serum-1.jpeg", images: ["/assets/lash-serum-1.jpeg", "/assets/lash-serum-2.jpeg", "/assets/lash-serum-3.jpeg"], rating: 5 },
  { id: 13, name: { ar: "ليب أويل Emoura", en: "Emoura Lip Oil" }, price: 150, oldPrice: 200, discount: 25, category: "lip-care", img: "/assets/lip-oil-1.jpeg", images: ["/assets/lip-oil-1.jpeg", "/assets/lip-oil-2.jpeg", "/assets/lip-oil-3.jpeg"], rating: 5 },
  { id: 14, name: { ar: "عرض 2 ليب أويل Emoura", en: "2 Emoura Lip Oil Offer" }, price: 199, oldPrice: 300, discount: 34, category: "offers", img: "/assets/offer-lip-oil-199.jpeg", rating: 5 },
  { id: 15, name: { ar: "عرض سيروم الرموش + ليب أويل", en: "Lash Serum + Lip Oil Offer" }, price: 299, oldPrice: 500, discount: 40, category: "offers", img: "/assets/offer-lash-lip-299.jpeg", rating: 5 },
  { id: 16, name: { ar: "عرض ليب أويل + سيروم الأظافر", en: "Lip Oil + Nail Serum Offer" }, price: 250, oldPrice: 400, discount: 38, category: "offers", img: "/assets/offer-lip-nail-250.jpeg", rating: 5 },
  { id: 17, name: { ar: "مجموعة العناية المتكاملة", en: "Complete Care Set" }, price: 499, oldPrice: 700, discount: 29, category: "offers", img: "/assets/offer-care-set-499.jpeg", rating: 5 },
  { id: 18, name: { ar: "عرض 2 Nail Oil", en: "2 Nail Oil Offer" }, price: 299, oldPrice: 400, discount: 25, category: "offers", img: "/assets/offer-2-nail-oil-299.jpeg", rating: 5 },
];

export const categories: Category[] = [
  { key: "nail-care", label: { ar: "العناية بالأظافر واليدين", en: "Nail & Hand Care" }, img: "/assets/nail-serum-1.jpeg" },
  { key: "lip-care", label: { ar: "العناية بالشفايف", en: "Lip Care" }, img: "/assets/lip-oil-1.jpeg" },
  { key: "lash-care", label: { ar: "العناية بالرموش", en: "Lash Care" }, img: "/assets/lash-serum-1.jpeg" },
  { key: "offers", label: { ar: "عروض وأوفرز", en: "Offers" }, img: "/assets/offer-499-new.jpeg" },
];

export const governorates: Record<"ar" | "en", string[]> = {
  ar: ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط", "الشرقية", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج"],
  en: ["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharqia", "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"],
};

// Each governorate has a stable key so labels in Arabic and English map to the same shipping fee.
// The order of the arrays above matches the order of GOVERNORATE_KEYS.
export const GOVERNORATE_KEYS = [
  "cairo", "giza", "alexandria", "dakahlia", "red-sea", "beheira", "fayoum",
  "gharbia", "ismailia", "monufia", "minya", "qalyubia", "new-valley", "suez",
  "aswan", "assiut", "beni-suef", "port-said", "damietta", "sharqia",
  "south-sinai", "kafr-el-sheikh", "matrouh", "luxor", "qena", "north-sinai", "sohag",
] as const;

export type GovernorateKey = (typeof GOVERNORATE_KEYS)[number];

export const governorateLabel = (key: GovernorateKey, lang: "ar" | "en"): string => {
  const index = GOVERNORATE_KEYS.indexOf(key);
  return governorates[lang][index] || key;
};

// Shipping fees in EGP, based on the carrier's updated price plan.
export const SHIPPING_FEES: Record<GovernorateKey, number> = {
  // Cairo & Giza – 70
  "cairo": 70,
  "giza": 70,
  // Alexandria – 85
  "alexandria": 85,
  // Lower Egypt (Delta) & Canal cities – 85
  "dakahlia": 85,
  "beheira": 85,
  "gharbia": 85,
  "monufia": 85,
  "qalyubia": 85,
  "sharqia": 85,
  "kafr-el-sheikh": 85,
  "damietta": 85,
  "ismailia": 85,
  "port-said": 85,
  "suez": 85,
  // Upper Egypt – 95
  "fayoum": 95,
  "minya": 95,
  "beni-suef": 95,
  "assiut": 95,
  "sohag": 95,
  "qena": 95,
  "luxor": 95,
  "aswan": 95,
  // Remote / Red Sea / Western Desert – 120
  "red-sea": 120,
  "matrouh": 120,
  "new-valley": 120,
  "north-sinai": 120,
  // Sharm El Sheikh / South Sinai – 145
  "south-sinai": 145,
};

export const getShippingFee = (governorate: string, lang: "ar" | "en" = "ar"): number => {
  // First try matching by label in either language
  const arIndex = governorates.ar.indexOf(governorate);
  if (arIndex !== -1) return SHIPPING_FEES[GOVERNORATE_KEYS[arIndex]];
  const enIndex = governorates.en.indexOf(governorate);
  if (enIndex !== -1) return SHIPPING_FEES[GOVERNORATE_KEYS[enIndex]];
  // Fallback to key lookup
  if ((GOVERNORATE_KEYS as readonly string[]).includes(governorate)) {
    return SHIPPING_FEES[governorate as GovernorateKey];
  }
  return 0;
};
