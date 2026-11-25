import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_TC, Noto_Serif_TC, Outfit } from "next/font/google";
import "./globals.css";
import { HOTEL } from "@/lib/hotel";
import { LocaleProvider } from "@/lib/i18n";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
});

const notoSansTc = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-noto-sans-tc",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerifTc = Noto_Serif_TC({
  subsets: ["latin"],
  variable: "--font-noto-serif-tc",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${HOTEL.name} · Boutique Hotel in Pokhara`,
  description:
    "A boutique hotel in Pokhara, Nepal — Himalayan serenity, modern rooms, and direct WhatsApp inquiry. No online booking.",
  icons: {
    icon: "/brand/logo.jpg",
    apple: "/brand/logo.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-locale="en"
      className={`${serif.variable} ${sans.variable} ${notoSansTc.variable} ${notoSerifTc.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-paper font-sans text-ink antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
