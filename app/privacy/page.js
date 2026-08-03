import Link from "next/link";
import styles from "../page.module.css";

export const metadata = {
  title: "Privacy Policy - SwiftQuote AI",
  description: "Read SwiftQuote AI's Privacy Policy to understand how we protect and manage your business data.",
};

export default function PrivacyPolicyPage() {
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
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Privacy Policy</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2.5rem" }}>
          Last Updated: August 3, 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", lineHeight: 1.7, color: "var(--foreground)" }}>
          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              1. Overview & Data Commitment
            </h2>
            <p>
              At SwiftQuote AI, we take your privacy and business confidentiality seriously. This Privacy Policy outlines how we collect, use, and protect the information you provide when using our platform to generate estimates, invoices, and collect digital signatures.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              2. Information We Collect
            </h2>
            <p style={{ marginBottom: "0.75rem" }}>
              We collect minimal information necessary to deliver seamless invoicing and AI parser services:
            </p>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li><strong>Account Profile Data:</strong> Business name, email address, phone number, address, and uploaded logo/stamp.</li>
              <li><strong>Document Data:</strong> Estimates and invoices created, line item details, client contact information, and billing terms.</li>
              <li><strong>Signature Logs:</strong> IP addresses, audit timestamps, and digital signature records when clients sign documents.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              3. How We Use AI Prompts
            </h2>
            <p>
              Natural language prompts submitted to our AI Quick-Fill Parser are processed in real-time solely to extract structured invoice data (items, rates, quantities). Prompts are never sold to third parties or used to train public AI models.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              4. Data Security & Storage
            </h2>
            <p>
              Your data is stored using industry-standard encryption protocol (AES-256 at rest and HTTPS in transit). We perform regular database backups to ensure data integrity and zero loss.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#6366f1", marginBottom: "0.75rem" }}>
              5. Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact our support team at{" "}
              <a href="mailto:privacy@swiftquote.ai" style={{ color: "#34d399", fontWeight: "700" }}>
                privacy@swiftquote.ai
              </a>.
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
