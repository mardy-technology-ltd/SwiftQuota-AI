import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await prisma.user.findFirst();

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Account & Business Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Configure invoice branding, default currency, and payment details</p>
      </div>

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "18px", padding: "2rem", maxWidth: "600px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
              Business Name
            </label>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)" }}>
              {user?.businessName || "Apex Creative Agency"}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
              Email Address
            </label>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)" }}>
              {user?.email || "admin@swiftquote.ai"}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
              Default Currency & Tax Rate
            </label>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)" }}>
              {user?.currency || "USD"} ({user?.taxRate || 10}% Tax)
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
              Payment Details & Stripe Link
            </label>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "0.9rem" }}>
              {user?.paymentDetails || "Stripe Payment Link Enabled"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
