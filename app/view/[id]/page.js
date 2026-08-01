import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PrintButton from "./PrintButton";
import ClientSignatureSection from "./ClientSignatureSection";
import styles from "./view.module.css";

export const dynamic = "force-dynamic";

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
      <div className={styles.actionBar}>
        <div style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: 600 }}>
          Client Portal View — {doc.type} #{doc.number}
        </div>
        <PrintButton />
      </div>

      {/* Main Document Paper Container */}
      <div className={styles.documentPaper}>
        {/* Floating Status Badge */}
        <div
          className={`${styles.statusBadgeFloating} ${
            styles[`status${doc.status}`] || styles.statusSENT
          }`}
        >
          ● {doc.status}
        </div>

        {/* Document Header */}
        <div className={styles.docHeader}>
          <div>
            <div className={styles.businessLogo}>
              ⚡ {doc.user?.businessName || "Apex Creative Agency"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.25rem" }}>
              {doc.user?.address || "789 Enterprise Way, Suite 400, Austin, TX"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
              {doc.user?.email || "admin@swiftquote.ai"}
            </div>
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
