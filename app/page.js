"use client";

import { useState } from "react";
import Link from "next/link";
import ClientPaymentModal from "./view/[id]/ClientPaymentModal";
import styles from "./page.module.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("web-design");
  const [openFaq, setOpenFaq] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState("lifetime");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mockPrompts = {
    "web-design": {
      prompt: "Bill Acme Corp $2,400 for website redesign: 20hrs UX design at $70/hr, 10hrs React dev at $100/hr. Include 10% early payment discount.",
      client: "Acme Corp",
      items: [
        { desc: "UX/UI Interface Design (20 hrs)", amount: "$1,400.00" },
        { desc: "Frontend React Development (10 hrs)", amount: "$1,000.00" },
        { desc: "Early Payment Discount (10%)", amount: "-$240.00" },
      ],
      total: "$2,160.00",
    },
    "voice-memo": {
      prompt: "Voice Note: 'Hey, create a quote for Sarah at TechStart for 3 mobile app mockups ($600 total) and logo vectorization ($250).'",
      client: "TechStart Inc.",
      items: [
        { desc: "Mobile App Mockup Design (3 screens)", amount: "$600.00" },
        { desc: "Brand Logo Vectorization & Assets", amount: "$250.00" },
      ],
      total: "$850.00",
    },
  };

  const currentMock = mockPrompts[activeTab];

  return (
    <div className={styles.container}>
      {/* Header & Navigation */}
      <header className={styles.headerWrapper}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <span>SwiftQuote</span>
            <span className={styles.logoBadge}>AI SaaS</span>
          </div>

          <nav className={styles.nav}>
            <ul className={styles.navLinks}>
              <li>
                <a href="#features" className={styles.navLink}>
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className={styles.navLink}>
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faqs" className={styles.navLink}>
                  FAQs
                </a>
              </li>
              <li>
                <Link href="/dashboard" className={styles.navLink} style={{ color: "#34d399", fontWeight: "700" }}>
                  ● Live DB Dashboard
                </Link>
              </li>
            </ul>

            <Link href="/dashboard" className={styles.getStartedBtn}>
              Go to Dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              type="button"
              className={styles.mobileMenuToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={styles.mobileDrawer}>
            <a href="#features" className={styles.mobileDrawerLink} onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#pricing" className={styles.mobileDrawerLink} onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </a>
            <a href="#faqs" className={styles.mobileDrawerLink} onClick={() => setMobileMenuOpen(false)}>
              FAQs
            </a>
            <Link
              href="/dashboard"
              className={styles.mobileDrawerLink}
              style={{ color: "#34d399", fontWeight: "700" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              ● Live DB Dashboard
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.pillTag}>
            <span>⚡ Next-Gen Micro-SaaS for Freelancers</span>
          </div>

          <h1 className={styles.heroTitle}>
            Invoice clients in <span className={styles.heroTitleGradient}>60 seconds using AI</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Draft professional invoices and estimates in seconds using AI, collect instant digital signatures, and automate client approvals effortlessly.
          </p>

          <div className={styles.heroCtaGroup}>
            <Link href="/dashboard" className={styles.primaryCta}>
              Try Free Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <a href="#demo" className={styles.secondaryCta}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Watch Demo (1 min)
            </a>
          </div>

          {/* Interactive Floating Mockup Placeholder */}
          <div className={styles.mockupContainer} id="demo">
            <div className={styles.mockupHeader}>
              <div className={styles.mockupDots}>
                <span className={`${styles.dot} ${styles.dotRed}`}></span>
                <span className={`${styles.dot} ${styles.dotYellow}`}></span>
                <span className={`${styles.dot} ${styles.dotGreen}`}></span>
              </div>
              <span className={styles.mockupTitle}>SwiftQuote Engine — Live AI Workspace Preview</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => setActiveTab("web-design")}
                  style={{
                    background: activeTab === "web-design" ? "rgba(99, 102, 241, 0.25)" : "transparent",
                    color: activeTab === "web-design" ? "#6366f1" : "#94a3b8",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "0.2rem 0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Prompt 1
                </button>
                <button
                  onClick={() => setActiveTab("voice-memo")}
                  style={{
                    background: activeTab === "voice-memo" ? "rgba(99, 102, 241, 0.25)" : "transparent",
                    color: activeTab === "voice-memo" ? "#6366f1" : "#94a3b8",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "0.2rem 0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Voice AI
                </button>
              </div>
            </div>

            <div className={styles.mockupBody}>
              {/* Left Column: Input Prompt */}
              <div className={styles.promptCard}>
                <div className={styles.promptLabel}>
                  <span>🤖 AI Prompt Parser</span>
                </div>
                <div className={styles.promptText}>
                  "{currentMock.prompt}"
                </div>
                <div className={styles.promptInputBox}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                  <span>AI listening for natural prompt or voice note...</span>
                </div>
              </div>

              {/* Right Column: Generated Invoice Preview */}
              <div className={styles.previewCard}>
                <div className={styles.previewHeader}>
                  <div>
                    <div className={styles.previewLogo}>INVOICE #SQ-8942</div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b" }}>To: {currentMock.client}</div>
                  </div>
                  <span className={styles.statusPill}>✓ Ready to Send</span>
                </div>

                <table className={styles.itemTable}>
                  <thead>
                    <tr>
                      <th>Line Item Description</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMock.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.desc}</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.totalRow}>
                  <span>Total Amount Due:</span>
                  <span style={{ color: "#4f46e5" }}>{currentMock.total}</span>
                </div>

                <div className={styles.signatureBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  One-Click Digital Signature & Payment Link Attached
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className={styles.features}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Built for Solopreneurs</span>
            <h2 className={styles.sectionTitle}>Everything you need to close deals faster</h2>
            <p className={styles.sectionSubtitle}>
              Stop wasting hours formatting PDFs. Turn raw scope ideas into payable contracts with zero friction.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {/* Feature 1 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎙️</div>
              <h3 className={styles.featureTitle}>Voice-to-Invoice AI Parsing</h3>
              <p className={styles.featureDesc}>
                Speak naturally or type a quick rough outline. Our specialized LLM extracts hourly rates, scope line items, discounts, and payment terms instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✍️</div>
              <h3 className={styles.featureTitle}>One-Click Client Signing</h3>
              <p className={styles.featureDesc}>
                Send interactive quote links directly to your clients. Clients can review, approve, and legally e-sign from any mobile device in seconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Expense & Status Tracking</h3>
              <p className={styles.featureDesc}>
                Get real-time notification alerts when a client views or signs your quote. Automatically track outstanding balances and send polite automated payment reminders.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className={styles.pricing}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Simple Transparent Pricing</span>
            <h2 className={styles.sectionTitle}>Invest once, save 10+ hours every month</h2>
            <p className={styles.sectionSubtitle}>No complicated tiers. Choose monthly flexibility or unlock lifetime savings.</p>
          </div>

          <div className={styles.pricingGrid}>
            {/* Card 1: $9/month */}
            <div className={styles.pricingCard}>
              <div className={styles.planName}>Solopreneur Monthly</div>
              <div className={styles.planDesc}>Ideal for freelancers and consultants starting out.</div>
              <div className={styles.priceWrapper}>
                <span className={styles.priceAmount}>$9</span>
                <span className={styles.pricePeriod}>/ month</span>
              </div>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span> Up to 30 AI Quotes & Invoices / mo
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span> Digital E-Signatures
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span> Custom Branding & Logo
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span> PDF & Web Link Export
                </li>
              </ul>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCheckoutPlan("monthly");
                  setShowCheckoutModal(true);
                }}
                className={`${styles.planCta} ${styles.planCtaStandard}`}
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Card 2: $39 Lifetime Deal */}
            <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
              <div className={styles.popularBadge}>High Converting Deal</div>
              <div className={styles.planName}>Founder Lifetime Pass</div>
              <div className={styles.planDesc}>Pay once, use forever. Unlimited AI generation & digital signatures.</div>
              <div className={styles.priceWrapper}>
                <span className={styles.priceAmount}>$39</span>
                <span className={styles.pricePeriod}>/ one-time</span>
              </div>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span> <strong>UNLIMITED</strong> AI Quotes & Invoices
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span> Unlimited Digital E-Signatures
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span> Custom Domain & Branding
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span> Priority Voice-to-Invoice AI Engine
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span> Lifetime Product Updates
                </li>
              </ul>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCheckoutPlan("lifetime");
                  setShowCheckoutModal(true);
                }}
                className={`${styles.planCta} ${styles.planCtaFeatured}`}
              >
                Get Lifetime Access — $39
              </button>
            </div>
          </div>
        </section>

        {/* SUBSCRIPTION CHECKOUT MODAL */}
        {showCheckoutModal && (
          <ClientPaymentModal
            currency="USD"
            initialPlan={checkoutPlan}
            showPlanSelection={true}
            onClose={() => setShowCheckoutModal(false)}
          />
        )}

        {/* FAQ Section */}
        <section id="faqs" className={styles.faq}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Got Questions?</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>

          <div className={styles.faqList}>
            {[
              {
                q: "How does Voice-to-Invoice parsing work?",
                a: "Simply speak into your phone or type a quick summary of the work you performed. SwiftQuote AI analyzes the text, structures line items, calculates totals with tax or discounts, and formats a clean invoice automatically.",
              },
              {
                q: "Are the digital signatures legally binding?",
                a: "Yes! SwiftQuote AI digital signatures include timestamped IP logs, audit trails, and recipient verification, making them compliant with standard e-signature regulations (such as the ESIGN Act).",
              },
              {
                q: "Can I customize invoices with my own business branding?",
                a: "Absolutely. You can upload your business logo, choose custom color palettes, add payment links (Stripe, PayPal, Wise), and use custom terms.",
              },
              {
                q: "What does the $39 Lifetime Deal include?",
                a: "The Lifetime Deal provides full, lifetime access to all core features, unlimited quote generation, digital signatures, and future updates without any recurring monthly subscriptions.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={styles.faqItem}
                style={{ cursor: "pointer" }}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className={styles.faqQuestion} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: "1.2rem", color: "#6366f1" }}>{openFaq === index ? "−" : "+"}</span>
                </div>
                {openFaq === index && <div className={styles.faqAnswer} style={{ marginTop: "0.75rem" }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <div className={styles.logoIcon} style={{ width: 30, height: 30, fontSize: "1rem" }}>⚡</div>
            <span>SwiftQuote AI</span>
          </div>

          <ul className={styles.footerLinks}>
            <li><a href="#features" className={styles.footerLink}>Features</a></li>
            <li><a href="#pricing" className={styles.footerLink}>Pricing</a></li>
            <li><a href="#faqs" className={styles.footerLink}>FAQs</a></li>
            <li><Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link></li>
            <li><Link href="/terms" className={styles.footerLink}>Terms of Service</Link></li>
          </ul>
        </div>

        <div className={styles.copyright}>
          © {new Date().getFullYear()} SwiftQuote AI. Designed for Solopreneurs & Freelancers worldwide. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
