export type Lang = "ar" | "en";

export type LocalizedText = { ar: string; en: string };

export type CategoryKey = "nail-care" | "lip-care" | "lash-care" | "offers";

export interface Product {
  id: number;
  name: LocalizedText;
  price: number;
  oldPrice: number;
  discount: number;
  category: CategoryKey;
  img: string;
  images?: string[];
  rating: number;
}

export interface Category {
  key: CategoryKey;
  label: LocalizedText;
  img: string;
}

export interface CartItem extends Product {
  qty: number;
}

export type PaymentMethod = "cod" | "instapay" | "vodafone";

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  address: string;
  notes: string;
  payment: PaymentMethod;
}

export interface Order extends CheckoutForm {
  number: string;
  items: CartItem[];
  total: number;
}
