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
