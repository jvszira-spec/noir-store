import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NOIR — Premium Tobacco & Smoke",
    template: "%s | NOIR",
  },
  description:
    "NOIR is a premium curated tobacco and smoke products store. Discover an exceptional selection of cigarettes, cigars, rolling products, and accessories.",
  keywords: ["tobacco", "cigarettes", "cigars", "rolling tobacco", "accessories", "premium"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: "NOIR",
    title: "NOIR — Premium Tobacco & Smoke",
    description: "Curated. Refined. Essential.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-[#FFFFF8] text-[#2F1820] antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#FFFDFA",
              color: "#2F1820",
              border: "1px solid #EADCDF",
              borderRadius: "8px",
            },
          }}
        />
      </body>
    </html>
  );
}
