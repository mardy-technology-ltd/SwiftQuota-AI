"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SignaturePad from "@/components/SignaturePad";
import styles from "./view.module.css";

export default function ClientSignatureSection({ documentId, initialStatus, signaturePath, signedAt, clientName }) {
  const [status, setStatus] = useState(initialStatus);
  const [signerName, setSignerName] = useState(clientName || "");
  const [submitting, setSubmitting] = useState(false);
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

  if (status === "SIGNED" || status === "PAID") {
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

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
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
  );
}
