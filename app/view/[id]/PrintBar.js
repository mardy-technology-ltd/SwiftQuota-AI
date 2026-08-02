"use client";

import { useState } from "react";
import styles from "./view.module.css";

export default function PrintBar({ docNumber, docType }) {
  const [hideHeader, setHideHeader] = useState(false);

  const toggleHideHeader = () => {
    const nextState = !hideHeader;
    setHideHeader(nextState);
    const paper = document.getElementById("document-paper-container");
    if (paper) {
      if (nextState) {
        paper.classList.add(styles.hideHeaderMode);
      } else {
        paper.classList.remove(styles.hideHeaderMode);
      }
    }
  };

  return (
    <div className={styles.actionBar}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <div style={{ fontSize: "0.95rem", color: "#f8fafc", fontWeight: 700 }}>
          Client Portal View — {docType} #{docNumber}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
          Official Company Letterhead & Document Approval
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Pre-Printed Paper Toggle */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: hideHeader ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.06)",
            border: hideHeader ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.15)",
            padding: "0.5rem 0.85rem",
            borderRadius: "10px",
            color: hideHeader ? "#fcd34d" : "#cbd5e1",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <input
            type="checkbox"
            checked={hideHeader}
            onChange={toggleHideHeader}
            style={{ accentColor: "#f59e0b", cursor: "pointer" }}
          />
          🖨️ Hide Header (For Pre-printed Paper)
        </label>

        {/* Print / Download Button */}
        <button onClick={() => window.print()} className={styles.printBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Download PDF / Print
        </button>
      </div>
    </div>
  );
}
