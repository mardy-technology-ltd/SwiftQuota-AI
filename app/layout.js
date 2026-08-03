import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "SwiftQuote AI - Solopreneur Invoicing",
  description: "Create and send professional estimates and invoices with digital signatures in seconds.",
  keywords: ["AI Invoice", "Quote Builder", "Solopreneurs", "Digital Signatures", "Invoicing Software"],
  authors: [{ name: "SwiftQuote AI Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${outfit.variable} ${outfit.className}`}>
        {children}
      </body>
    </html>
  );
}
