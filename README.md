# SwiftQuote AI

> Instant Invoice & Quote Builder for Solopreneurs powered by Next.js, Prisma, SQLite & Interactive HTML5 Digital Signatures.

## ⚡ Features

- **Dark-Mode First SaaS Design System**: Built with modern CSS custom variables, Outfit Google font, glassmorphism, and responsive layouts.
- **Solopreneur Dashboard**: Track total revenue, active estimates, outstanding balances, and recent client activity in real-time.
- **Invoice & Estimate Form Builder**: Live paper document preview with real-time recalculation of subtotals, tax rates, and discounts.
- **Public Client Portal (`/view/[id]`)**: Client-facing portal allowing clients to view estimates, draw legally binding HTML5 canvas signatures, and download A4/Letter PDF printouts.
- **Cookie-based Session Authentication**: Secure HTTP-only cookie authentication with protected dashboard routes via Next.js Proxy/Middleware.
- **Prisma ORM & SQLite Database**: Relational schema modeling Solopreneurs, Clients, and Invoices/Estimates with seed data.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Migration & Seed**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Demo Credentials

- **Email**: `admin@swiftquote.ai`
- **Password**: `EliteStandard2026!`
