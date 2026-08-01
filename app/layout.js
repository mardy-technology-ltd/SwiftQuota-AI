import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "SwiftQuote AI - Solopreneur Invoicing",
  description: "Create and send professional estimates and invoices with digital signatures in seconds.",
  keywords: ["AI Invoice", "Quote Builder", "Solopreneurs", "Digital Signatures", "Invoicing Software"],
  authors: [{ name: "SwiftQuote AI Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth">
      <body className={`${outfit.variable} ${outfit.className}`}>
        {children}
      </body>
    </html>
  );
}
