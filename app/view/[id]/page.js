import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PrintBar from "./PrintBar";
import ClientSignatureSection from "./ClientSignatureSection";
import styles from "./view.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const doc = await prisma.invoiceOrQuote.findUnique({
    where: { id },
    select: { number: true, type: true },
  });

  if (!doc) {
    return { title: "Document Not Found - SwiftQuote AI" };
  }

  const typeLabel = doc.type === "INVOICE" ? "Invoice" : "Estimate";
  return {
    title: `${typeLabel} ${doc.number} - SwiftQuote AI`,
    description: `View and sign ${typeLabel.toLowerCase()} #${doc.number} via SwiftQuote AI Client Portal.`,
  };
}

export default async function PublicDocumentView({ params }) {
  const { id } = await params;

  const doc = await prisma.invoiceOrQuote.findUnique({
    where: { id },
    include: {
      client: true,
      user: true,
    },
  });

  if (!doc) {
    notFound();
  }

  let items = [];
  try {
    items = typeof doc.items === "string" ? JSON.parse(doc.items) : doc.items || [];
  } catch {
    items = [];
  }

  const subtotal = items.reduce((sum, item) => {
    const q = parseFloat(item.quantity) || 0;
    const r = parseFloat(item.rate) || 0;
    return sum + q * r;
  }, 0);

  const taxAmount = subtotal * ((doc.taxRate || 0) / 100);
  const discountAmount = subtotal * ((doc.discount || 0) / 100);

  return (
    <div className={styles.pageBg}>
      {/* Top Action Bar (hidden in print) */}
      <PrintBar docNumber={doc.number} docType={doc.type} />

      {/* Main Document Paper Container */}
      <div className={styles.documentPaper} id="document-paper-container">
        {/* Floating Status Badge */}
        <div
          className={`${styles.statusBadgeFloating} ${
            styles[`status${doc.status}`] || styles.statusSENT
          }`}
        >
          ● {doc.status}
        </div>

        {/* Document Official Letterhead Header */}
        <div className={styles.docHeader}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
              {doc.user?.logoUrl && (
                <img src={doc.user.logoUrl} alt="Company Logo" className={styles.companyLogoImg} style={{ marginBottom: 0 }} />
              )}
              <div className={styles.businessLogo}>
                {doc.user?.businessName || "Apex Creative Agency"}
              </div>
            </div>
            {doc.user?.taxId && (
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginTop: "0.15rem" }}>
                TAX / REG ID: {doc.user.taxId}
              </div>
            )}
            <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.25rem" }}>
              {doc.user?.address || "789 Enterprise Way, Suite 400, Austin, TX"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
              {doc.user?.email || "admin@swiftquote.ai"}
            </div>
            {doc.user?.phone && (
              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                Phone: {doc.user.phone}
              </div>
            )}
          </div>

          <div className={styles.metaBlock}>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a" }}>
              {doc.type === "ESTIMATE" ? "ESTIMATE / QUOTE" : "INVOICE"}
            </div>
            <div style={{ fontWeight: 700, color: "#4f46e5" }}>#{doc.number}</div>
            <div>Issued: {new Date(doc.issuedDate).toLocaleDateString()}</div>
            <div>Due Date: {new Date(doc.dueDate).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Client & Billing Info */}
        <div className={styles.infoGrid}>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>Billed To (Client):</div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a" }}>
              {doc.client?.name || "Client Name"}
            </div>
            <div style={{ fontSize: "0.88rem", color: "#64748b" }}>
              {doc.client?.email || ""}
            </div>
            {doc.client?.phone && (
              <div style={{ fontSize: "0.88rem", color: "#64748b" }}>
                Phone: {doc.client.phone}
              </div>
            )}
            {doc.client?.address && (
              <div style={{ fontSize: "0.88rem", color: "#64748b" }}>
                {doc.client.address}
              </div>
            )}
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>Payment Instructions:</div>
            <div style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.5 }}>
              {doc.user?.paymentDetails || "Please remit payment via Stripe or direct bank wire."}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th style={{ width: "50%" }}>Description of Services</th>
              <th style={{ textAlign: "center", width: "15%" }}>Qty</th>
              <th style={{ textAlign: "right", width: "15%" }}>Rate ($)</th>
              <th style={{ textAlign: "right", width: "20%" }}>Total ($)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const rowAmt = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
              return (
                <tr key={index}>
                  <td style={{ fontWeight: 500 }}>{item.description}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>${parseFloat(item.rate).toFixed(2)}</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>${rowAmt.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Summary Totals */}
        <div className={styles.summaryBox}>
          <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
            Subtotal: <strong style={{ color: "#0f172a" }}>${subtotal.toFixed(2)}</strong>
          </div>
          {doc.taxRate > 0 && (
            <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
              Tax ({doc.taxRate}%): <strong style={{ color: "#059669" }}>+${taxAmount.toFixed(2)}</strong>
            </div>
          )}
          {doc.discount > 0 && (
            <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
              Discount ({doc.discount}%): <strong style={{ color: "#dc2626" }}>-${discountAmount.toFixed(2)}</strong>
            </div>
          )}
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#4f46e5", marginTop: "0.4rem" }}>
            Grand Total: ${doc.totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Official Stamp & Signatory Block if available */}
        {doc.user?.stampUrl && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <div style={{ textAlign: "center" }}>
              <img src={doc.user.stampUrl} alt="Official Seal" className={styles.companyStampImg} />
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginTop: "0.2rem" }}>
                Official Stamp / Seal
              </div>
            </div>
          </div>
        )}

        {/* Signature & Approval Section */}
        <ClientSignatureSection
          documentId={doc.id}
          initialStatus={doc.status}
          signaturePath={doc.signaturePath}
          signedAt={doc.signedAt}
          clientName={doc.client?.name}
        />
      </div>
    </div>
  );
}
