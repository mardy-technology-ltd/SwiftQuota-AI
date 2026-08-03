"use client";

import { useState } from "react";
import ClientSignatureSection from "./ClientSignatureSection";
import ClientPaymentModal from "./ClientPaymentModal";
import styles from "./view.module.css";

export default function DocumentActionSection({
  documentId,
  docType,
  status,
  totalAmount,
  currency,
  paidAmount,
  paymentMethod,
  trxId,
  signaturePath,
  signedAt,
  rejectionReason,
  clientName,
  merchantUser,
}) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const merchantPaymentInfo = {
    bkashNumber: merchantUser?.bkashNumber,
    nagadNumber: merchantUser?.nagadNumber,
    bankDetails: merchantUser?.bankDetails,
    paymentLink: merchantUser?.paymentLink,
  };

  const isInvoice = docType === "INVOICE";
  const isPaid = status === "PAID";
  const isPendingVerification = status === "PENDING_VERIFICATION";
  const isRejected = status === "REJECTED";

  return (
    <div style={{ marginTop: "2rem" }}>
      {/* PAYMENT PROOF BADGE / STATUS NOTIFICATION */}
      {isPendingVerification && (
        <div style={{ background: "#fef3c7", border: "1px solid #fde68a", color: "#92400e", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 800, fontSize: "1rem" }}>⏳ Payment Pending Verification</div>
          <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Payment proof submitted via <strong>{paymentMethod || "Mobile Banking"}</strong> (TrxID: <code>{trxId}</code>). The merchant is verifying your transaction.
          </div>
        </div>
      )}

      {isPaid && (
        <div style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#166534", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 800, fontSize: "1rem" }}>✓ Payment Completed & Verified</div>
          <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Total Paid: <strong>{currency} {paidAmount || totalAmount}</strong> via {paymentMethod || "Direct Payment"} {trxId ? `(TrxID: ${trxId})` : ""}
          </div>
        </div>
      )}

      {/* CALL TO ACTION FOR INVOICE PAYMENTS */}
      {isInvoice && !isPaid && !isPendingVerification && (
        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 60%, #f0fdf4 100%)",
            color: "#0f172a",
            padding: "1.5rem 1.75rem",
            borderRadius: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            boxShadow: "0 8px 25px rgba(99, 102, 241, 0.12)",
            border: "1.5px solid #c7d2fe",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              💳 Pay Invoice Online (Upfront or Upon Completion)
            </div>
            <div style={{ fontSize: "0.85rem", color: "#475569", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <span style={{ background: "#dcfce7", color: "#15803d", padding: "0.15rem 0.55rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                ⚡ Flexible: Pay Now or Post-Completion
              </span>
              <span>Accepted:</span>
              <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "0.15rem 0.55rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>Card / Gateway</span>
              <span style={{ background: "#fce7f3", color: "#be185d", padding: "0.15rem 0.55rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                bKash {merchantPaymentInfo?.bkashNumber ? `(${merchantPaymentInfo.bkashNumber})` : ""}
              </span>
              <span style={{ background: "#ffedd5", color: "#c2410c", padding: "0.15rem 0.55rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                Nagad {merchantPaymentInfo?.nagadNumber ? `(${merchantPaymentInfo.nagadNumber})` : ""}
              </span>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "0.15rem 0.55rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>Bank Wire</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            style={{
              padding: "0.85rem 1.6rem",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "0.98rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(79, 70, 229, 0.3)",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            🔒 Pay {currency} {totalAmount.toFixed(2)} Now
          </button>
        </div>
      )}

      {/* ESTIMATE SIGNATURE & APPROVAL SECTION */}
      {!isInvoice && (
        <ClientSignatureSection
          documentId={documentId}
          initialStatus={status}
          signaturePath={signaturePath}
          signedAt={signedAt}
          clientName={clientName}
          rejectionReason={rejectionReason}
        />
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <ClientPaymentModal
          documentId={documentId}
          totalAmount={totalAmount}
          currency={currency}
          merchantPaymentInfo={merchantPaymentInfo}
          showPlanSelection={false}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
