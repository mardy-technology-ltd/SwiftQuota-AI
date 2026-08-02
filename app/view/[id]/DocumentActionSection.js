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

      {/* INLINE PAYMENT CARD FOR INVOICES (NO POPUP NEEDED) */}
      {isInvoice && !isPaid && !isPendingVerification && (
        <ClientPaymentModal
          documentId={documentId}
          totalAmount={totalAmount}
          currency={currency}
          merchantPaymentInfo={merchantPaymentInfo}
          showPlanSelection={false}
          isInline={true}
        />
      )}
    </div>
  );
}
