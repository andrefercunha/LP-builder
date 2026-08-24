import type { Metadata } from "next";
import { Instrument_Serif, Libre_Franklin } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-studio-display",
});

const sans = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-studio-sans",
});

export const metadata: Metadata = {
  title: "Estúdio LP",
  description: "Landing pages de alta conversão a partir de marca, fotos e copy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={`${display.variable} ${sans.variable} antialiased`}>{children}</body>
    </html>
  );
}
