import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { UIProvider } from "@/components/UIProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import CartDrawer from "@/components/CartDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import ProductModal from "@/components/ProductModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://emoura.example"),
  title: "Emoura | منتجات عناية طبيعية",
  description:
    "Emoura - منتجات عناية طبيعية 100٪ مناسبة لجميع الفئات العمرية، توصيل لكل محافظات مصر.",
  keywords: [
    "Emoura",
    "إيمورا",
    "عناية",
    "طبيعي",
    "سيروم رموش",
    "ليب أويل",
    "سيروم الأظافر",
    "مصر",
  ],
  openGraph: {
    type: "website",
    title: "Emoura | منتجات عناية طبيعية",
    description: "منتجات عناية طبيعية 100٪ - توصيل لكل محافظات مصر",
    images: ["/assets/hero-background.jpeg"],
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%23a9783d'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='Georgia,serif' font-size='32' font-weight='700' fill='%23fffaf2'%3EE%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#a9783d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen overflow-x-hidden">
        <StoreProvider>
          <UIProvider>
            <Navbar />
            {children}
            <Footer />
            <CartDrawer />
            <SearchOverlay />
            <ProductModal />
            <Toast />
          </UIProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
