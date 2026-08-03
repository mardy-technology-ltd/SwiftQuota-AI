import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
  title: "Terms of Service - SwiftQuote AI",
  description: "Review the Terms of Service for using SwiftQuote AI SaaS invoicing platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.headerWrapper}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <span>SwiftQuote</span>
            <span className={styles.logoBadge}>AI SaaS</span>
          </Link>
          <Link href="/" className={styles.getStartedBtn}>
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content Body */}
      <main className={styles.main} style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: "800px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Terms of Service</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2.5rem" }}>
          Effective Date: August 3, 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", lineHeight: 1.7, color: "var(--foreground)" }}>
          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using SwiftQuote AI ("Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              2. Description of Service
            </h2>
            <p>
              SwiftQuote AI provides freelancers, solopreneurs, and agencies with AI-powered invoicing, quote generation, client portal viewing, and digital e-signature capabilities.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              3. User Accounts & License Rules
            </h2>
            <p style={{ marginBottom: "0.75rem" }}>
              Users are responsible for maintaining the confidentiality of their account credentials. To prevent software license abuse:
            </p>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>Business Name and Email details lock permanently after first profile setup.</li>
              <li>You may not resell, sub-license, or share single-user licenses across multiple independent companies.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              4. Digital Signatures & Legal Validity
            </h2>
            <p>
              Digital signatures collected via SwiftQuote AI client portal are timestamped with audit logs. Users acknowledge that electronic signatures are legally binding under applicable e-signature laws (such as ESIGN Act & eIDAS), subject to jurisdiction.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              5. Subscription & Payment Terms
            </h2>
            <p>
              Monthly subscriptions renew automatically unless cancelled prior to the renewal date. Lifetime Passes grant perpetual access to core software features for a single upfront payment.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              6. Limitation of Liability
            </h2>
            <p>
              SwiftQuote AI shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} SwiftQuote AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
