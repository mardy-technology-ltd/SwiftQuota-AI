"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./view.module.css";

export default function ClientPaymentModal({
  documentId,
  totalAmount = 120,
  currency = "USD",
  merchantPaymentInfo,
  onClose,
  showPlanSelection = true,
}) {
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("yearly"); // "yearly" | "monthly"
  const [activeTab, setActiveTab] = useState("card");
  const [senderPhone, setSenderPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Lock background scrolling while modal is active
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  // Credit Card Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [postalCode, setPostalCode] = useState("");

  const router = useRouter();

  // Dynamic calculated amount based on plan selection or passed document total
  const currentPayableAmount = showPlanSelection
    ? selectedBillingCycle === "yearly"
      ? 120
      : 12
    : totalAmount;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const getCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (clean.startsWith("5") || clean.startsWith("2")) return "MASTERCARD";
    if (clean.startsWith("3")) return "AMEX";
    return "CARD";
  };

  const handleSubmitTrx = async (methodName, customTrx = null) => {
    const finalTrx = customTrx || trxId.trim();
    if (!finalTrx) {
      alert("Please enter the Transaction ID (TrxID) or Card Details.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/documents/${documentId || "subscription"}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: methodName,
          trxId: finalTrx,
          senderPhone: senderPhone.trim(),
          paidAmount: currentPayableAmount,
          note: `Plan: ${selectedBillingCycle} | ${note}`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert(json.message || "Payment submitted successfully!");
        onClose();
        router.refresh();
      } else {
        alert(json.error || "Failed to submit payment details.");
      }
    } catch (err) {
      console.error("Payment submission error", err);
      alert("An unexpected error occurred while submitting payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 14 || !cardExpiry || cardCvc.length < 3) {
      alert("Please enter valid Credit/Debit Card details.");
      return;
    }
    const cleanNum = cardNumber.replace(/\s/g, "");
    const cardRef = `${getCardBrand()}-${cleanNum.slice(-4)}-${Date.now().toString().slice(-6)}`;
    handleSubmitTrx("CREDIT_CARD", cardRef);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.darkModalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.darkModalHeader}>
          <div>
            <h2 className={styles.darkModalTitle}>
              {showPlanSelection ? "Upgrade & Complete Checkout" : "Complete Payment"}
            </h2>
            <p className={styles.darkModalSubtitle}>
              Total Payable:{" "}
              <span className={styles.highlightAmount}>
                {currency} {currentPayableAmount.toFixed(2)}
                {showPlanSelection && (selectedBillingCycle === "yearly" ? " / year" : " / month")}
              </span>
            </p>
          </div>
          <button className={styles.darkCloseBtn} onClick={onClose}>×</button>
        </div>

        {/* CHOOSE YOUR PLAN SECTION (MATCHING REFERENCE IMAGE) */}
        {showPlanSelection && (
          <div className={styles.planSelectionWrapper}>
            <div className={styles.sectionHeader} style={{ marginBottom: "0.5rem" }}>Choose your plan</div>

            <div
              className={`${styles.planOptionCard} ${selectedBillingCycle === "yearly" ? styles.planOptionActive : ""}`}
              onClick={() => setSelectedBillingCycle("yearly")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div className={styles.radioCheckCircle}>
                  {selectedBillingCycle === "yearly" && <span className={styles.radioCheckInner}>✓</span>}
                </div>
                <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "#ffffff" }}>Yearly</span>
                <span className={styles.discountTag}>-16%</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ffffff" }}>$120/year</div>
            </div>

            <div
              className={`${styles.planOptionCard} ${selectedBillingCycle === "monthly" ? styles.planOptionActive : ""}`}
              onClick={() => setSelectedBillingCycle("monthly")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div className={styles.radioCheckCircle}>
                  {selectedBillingCycle === "monthly" && <span className={styles.radioCheckInner}>✓</span>}
                </div>
                <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "#ffffff" }}>Monthly</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ffffff" }}>$12/month</div>
            </div>
          </div>
        )}

        {/* Payment Method Switcher Tabs */}
        <div className={styles.darkTabContainer}>
          <button
            type="button"
            className={`${styles.darkTabPill} ${activeTab === "card" ? styles.darkTabActive : ""}`}
            onClick={() => setActiveTab("card")}
          >
            💳 Card
          </button>
          <button
            type="button"
            className={`${styles.darkTabPill} ${activeTab === "bank" ? styles.darkTabActive : ""}`}
            onClick={() => setActiveTab("bank")}
          >
            🏦 Bank Transfer
          </button>
          <button
            type="button"
            className={`${styles.darkTabPill} ${activeTab === "bkash" ? styles.darkTabActive : ""}`}
            onClick={() => setActiveTab("bkash")}
          >
            💖 bKash
          </button>
          <button
            type="button"
            className={`${styles.darkTabPill} ${activeTab === "nagad" ? styles.darkTabActive : ""}`}
            onClick={() => setActiveTab("nagad")}
          >
            🟠 Nagad
          </button>
        </div>

        {/* TAB 1: CREDIT CARD FORM (MATCHING EXAMPLE IMAGE) */}
        {activeTab === "card" && (
          <form onSubmit={handleCardSubmit} className={styles.darkFormSection}>
            <div className={styles.sectionHeader}>Credit card details</div>

            {/* Card Number Input with embedded Card Brand Logos */}
            <div className={styles.inputWrapper}>
              <input
                type="text"
                required
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className={styles.darkInputWithIcons}
              />
              <div className={styles.cardLogosRow}>
                <span className={styles.visaBadge}>VISA</span>
                <span className={styles.mastercardBadge}></span>
                <span className={styles.amexBadge}>AMEX</span>
                <span className={styles.unionBadge}>DISCOVER</span>
              </div>
            </div>

            {/* Expiry & CVC Grid */}
            <div className={styles.twoColumnGrid}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  required
                  placeholder="MM / YYYY"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  className={styles.darkInput}
                />
                <span className={styles.inlineIcon}>📅</span>
              </div>

              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  required
                  maxLength={4}
                  placeholder="CVC"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className={styles.darkInput}
                />
                <span className={styles.inlineIcon}>🛡️</span>
              </div>
            </div>

            <p className={styles.disclaimerText}>
              By providing your card information, you allow us to charge your card for future payments in accordance with their terms.
            </p>

            {/* Billing Address Section */}
            <div className={styles.sectionHeader} style={{ marginTop: "0.6rem" }}>Billing address</div>

            <div className={styles.inputWrapper}>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={styles.darkSelect}
              >
                <option value="Bangladesh">Bangladesh 🇧🇩</option>
                <option value="United States">United States 🇺🇸</option>
                <option value="United Kingdom">United Kingdom 🇬🇧</option>
                <option value="Canada">Canada 🇨🇦</option>
                <option value="Australia">Australia 🇦🇺</option>
                <option value="Germany">Germany 🇩🇪</option>
                <option value="Singapore">Singapore 🇸🇬</option>
              </select>
            </div>

            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={styles.darkInput}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={styles.darkPrimaryPayBtn}
            >
              {submitting ? "Processing..." : `Pay ${currency} ${currentPayableAmount.toFixed(2)}`}
            </button>
          </form>
        )}

        {/* TAB 2: BANK TRANSFER */}
        {activeTab === "bank" && (
          <div className={styles.darkFormSection}>
            <div className={styles.localPaymentCard} style={{ borderColor: "rgba(59, 130, 246, 0.4)", background: "rgba(59, 130, 246, 0.08)" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                Bank Wire Account Details
              </div>
              <div style={{ fontSize: "0.88rem", color: "#bfdbfe", whiteSpace: "pre-line", lineHeight: 1.5, fontWeight: 600 }}>
                {merchantPaymentInfo?.bankDetails || "Bank: City Bank PLC\nAccount Name: SwiftQuote AI SaaS\nAccount #: 1234567890\nBranch: Main Branch"}
              </div>
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.darkLabel}>Bank Deposit / Wire Reference No. *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ref # 99882211 or Deposit Slip #"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className={styles.darkInput}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.darkLabel}>Additional Notes / Depositor Name</label>
              <input
                type="text"
                placeholder="e.g. Deposited via Online Banking"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={styles.darkInput}
              />
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmitTrx("BANK_WIRE")}
              className={styles.darkPrimaryPayBtn}
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "#fff" }}
            >
              {submitting ? "Submitting..." : "Submit Bank Transfer Details"}
            </button>
          </div>
        )}

        {/* TAB 3: BKASH */}
        {activeTab === "bkash" && (
          <div className={styles.darkFormSection}>
            <div className={styles.localPaymentCard} style={{ borderColor: "rgba(236, 72, 153, 0.4)", background: "rgba(236, 72, 153, 0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f472b6", textTransform: "uppercase" }}>bKash Merchant / Personal</span>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f472b6", marginTop: "0.1rem" }}>
                    {merchantPaymentInfo?.bkashNumber || "01700000000"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(merchantPaymentInfo?.bkashNumber || "01700000000", "bkash")}
                  className={styles.darkCopyBtn}
                >
                  {copiedField === "bkash" ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#fbcfe8", marginTop: "0.6rem", marginBottom: 0, lineHeight: 1.4 }}>
                Send <strong>{currency} {currentPayableAmount.toFixed(2)}</strong> via bKash App Send Money or Payment, then enter your TrxID below.
              </p>
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.darkLabel}>Sender Phone Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 01712345678"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className={styles.darkInput}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.darkLabel}>bKash Transaction ID (TrxID) *</label>
              <input
                type="text"
                required
                placeholder="e.g. BK89X2Z491"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className={styles.darkInput}
              />
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmitTrx("BKASH")}
              className={styles.darkPrimaryPayBtn}
              style={{ background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)", color: "#fff" }}
            >
              {submitting ? "Submitting..." : "Submit bKash Payment Proof"}
            </button>
          </div>
        )}

        {/* TAB 4: NAGAD */}
        {activeTab === "nagad" && (
          <div className={styles.darkFormSection}>
            <div className={styles.localPaymentCard} style={{ borderColor: "rgba(249, 115, 22, 0.4)", background: "rgba(249, 115, 22, 0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fb923c", textTransform: "uppercase" }}>Nagad Account Number</span>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fb923c", marginTop: "0.1rem" }}>
                    {merchantPaymentInfo?.nagadNumber || "01800000000"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(merchantPaymentInfo?.nagadNumber || "01800000000", "nagad")}
                  className={styles.darkCopyBtn}
                >
                  {copiedField === "nagad" ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#fed7aa", marginTop: "0.6rem", marginBottom: 0, lineHeight: 1.4 }}>
                Send <strong>{currency} {currentPayableAmount.toFixed(2)}</strong> via Nagad App Send Money, then enter your TrxID below.
              </p>
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.darkLabel}>Sender Phone Number</label>
              <input
                type="text"
                placeholder="e.g. 01812345678"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className={styles.darkInput}
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.darkLabel}>Nagad Transaction ID (TrxID) *</label>
              <input
                type="text"
                required
                placeholder="e.g. 71A890X2"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className={styles.darkInput}
              />
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmitTrx("NAGAD")}
              className={styles.darkPrimaryPayBtn}
              style={{ background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)", color: "#fff" }}
            >
              {submitting ? "Submitting..." : "Submit Nagad Payment Proof"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
