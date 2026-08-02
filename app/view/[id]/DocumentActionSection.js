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
            background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #1e1b4b 100%)",
            color: "#fff",
            padding: "1.75rem",
            borderRadius: "16px",
            display: "flex",
            justify: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            boxShadow: "0 15px 35px rgba(79, 70, 229, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              💳 Pay Invoice Securely Online
            </div>
            <div style={{ fontSize: "0.88rem", opacity: 0.9, marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <span>Accepted:</span>
              <span style={{ background: "rgba(255, 255, 255, 0.15)", padding: "0.15rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>Credit/Debit Card</span>
              <span style={{ background: "rgba(236, 72, 153, 0.3)", padding: "0.15rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>bKash</span>
              <span style={{ background: "rgba(249, 115, 22, 0.3)", padding: "0.15rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>Nagad</span>
              <span style={{ background: "rgba(59, 130, 246, 0.3)", padding: "0.15rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>Bank Wire</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            style={{
              padding: "0.85rem 1.6rem",
              borderRadius: "12px",
              background: "#ffffff",
              color: "#3730a3",
              fontWeight: 800,
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
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
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
