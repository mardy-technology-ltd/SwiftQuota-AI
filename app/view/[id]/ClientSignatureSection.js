"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SignaturePad from "@/components/SignaturePad";
import styles from "./view.module.css";

export default function ClientSignatureSection({ documentId, initialStatus, signaturePath, signedAt, clientName, rejectionReason }) {
  const [status, setStatus] = useState(initialStatus);
  const [signerName, setSignerName] = useState(clientName || "");
  const [submitting, setSubmitting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reasonText, setReasonText] = useState("");
  const sigPadRef = useRef(null);
  const router = useRouter();

  const handleClear = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
    }
  };

  const handleApproveAndSign = async () => {
    const dataUrl = sigPadRef.current?.toDataURL();
    if (!dataUrl) {
      alert("Please draw your signature in the canvas box before approving.");
      return;
    }

    if (!signerName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/documents/${documentId}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerName,
          signatureImage: dataUrl,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setStatus("SIGNED");
        router.refresh();
      } else {
        alert(json.error || "Failed to sign document.");
      }
    } catch (err) {
      console.error("Signing error", err);
      alert("An unexpected error occurred while signing.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!reasonText.trim()) {
      alert("Please enter your reason or required changes.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/documents/${documentId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rejectionReason: reasonText.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setStatus("REJECTED");
        setShowRejectModal(false);
        router.refresh();
      } else {
        alert(json.error || "Failed to submit feedback.");
      }
    } catch (err) {
      console.error("Rejection submission error", err);
      alert("An error occurred while submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "REJECTED") {
    return (
      <div className={styles.rejectedBlock}>
        <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#991b1b" }}>
          ❌ Revision Requested / Quote Declined
        </div>
        <div style={{ fontSize: "0.85rem", color: "#7f1d1d", marginTop: "0.4rem" }}>
          Client Feedback: &quot;{rejectionReason || reasonText || "Revision requested"}&quot;
        </div>
      </div>
    );
  }

  if (status === "SIGNED" || status === "PAID" || status === "APPROVED") {
    return (
      <div className={styles.signedBlock}>
        <div className={styles.signedMeta}>
          <div style={{ fontSize: "1.05rem" }}>✓ Approved & Legally Signed</div>
          <div style={{ fontSize: "0.82rem", color: "#166534", marginTop: "0.25rem" }}>
            Signed by <strong>{signerName}</strong> on {signedAt ? new Date(signedAt).toLocaleDateString() : new Date().toLocaleDateString()}
          </div>
        </div>

        {signaturePath && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={signaturePath}
              alt="Client Signature"
              className={styles.signedImg}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.signatureSection}>
      <div className={styles.sigTitle}>✍️ Approve & Sign this Estimate</div>
      <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0 }}>
        By signing below, you agree to the scope of work and pricing outlined above.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
          Full Signer Name *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. John Doe"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          style={{
            padding: "0.65rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "0.9rem",
            outline: "none",
          }}
        />
      </div>

      <div>
        <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem", display: "block" }}>
          Digital Signature Pad *
        </label>
        <SignaturePad ref={sigPadRef} />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
        <button
          type="button"
          onClick={() => setShowRejectModal(true)}
          style={{
            padding: "0.65rem 1.1rem",
            borderRadius: "8px",
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#e11d48",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          ❌ Request Revision / Decline
        </button>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: "0.65rem 1.25rem",
              borderRadius: "8px",
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              color: "#475569",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Clear Signature
          </button>

          <button
            type="button"
            onClick={handleApproveAndSign}
            disabled={submitting}
            style={{
              padding: "0.65rem 1.4rem",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            {submitting ? "Processing..." : "✓ Approve & Sign Document"}
          </button>
        </div>
      </div>

      {/* REVISION REQUEST MODAL */}
      {showRejectModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRejectModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, color: "#991b1b" }}>❌ Request Revision / Decline Quote</h3>
              <button className={styles.closeBtn} onClick={() => setShowRejectModal(false)}>×</button>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0.5rem 0" }}>
              Please let the merchant know why you are requesting changes or declining this estimate.
            </p>
            <textarea
              rows={4}
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="e.g. Please adjust the hourly rate or update line item #2..."
              className={styles.modalInput}
              style={{ minHeight: "90px", resize: "vertical" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleRejectSubmit}
                style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none", background: "#e11d48", color: "#fff", fontWeight: 700, cursor: "pointer" }}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
