"use client";

import { useState, useEffect } from "react";
import ClientPaymentModal from "@/app/view/[id]/ClientPaymentModal";

const CURRENCY_LIST = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AED", symbol: "AED", name: "UAE Dirham" },
  { code: "SAR", symbol: "SAR", name: "Saudi Riyal" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "KWD", symbol: "KWD", name: "Kuwaiti Dinar" },
  { code: "QAR", symbol: "QAR", name: "Qatari Riyal" },
  { code: "OMR", symbol: "OMR", name: "Omani Rial" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
];

function SearchableCurrencySelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = CURRENCY_LIST.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCurr = CURRENCY_LIST.find((c) => c.code === value) || {
    code: value || "USD",
    symbol: "$",
    name: "US Dollar",
  };

  return (
    <div style={{ position: "relative" }}>
      {/* TRIGGER BUTTON */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "rgba(2, 6, 23, 0.6)",
          padding: "0.75rem 1rem",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
          cursor: "pointer",
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          fontSize: "0.95rem",
          fontWeight: 600,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "var(--primary)", fontWeight: 800 }}>{selectedCurr.symbol}</span>
          <span>{selectedCurr.code} - {selectedCurr.name}</span>
        </div>
        <span style={{ opacity: 0.6, fontSize: "0.75rem" }}>▼</span>
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#0f172a",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            borderRadius: "12px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            zIndex: 100,
            padding: "0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            maxHeight: "260px",
          }}
        >
          {/* SEARCH INPUT */}
          <input
            type="text"
            placeholder="🔍 Search currency (e.g. BDT, USD, Taka...)"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              padding: "0.55rem 0.75rem",
              color: "#ffffff",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />

          {/* LIST ITEMS */}
          <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "0.5rem", fontSize: "0.8rem", color: "#94a3b8", textAlign: "center" }}>
                No currency found
              </div>
            ) : (
              filtered.map((c) => (
                <div
                  key={c.code}
                  onClick={() => {
                    onChange(c.code);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: c.code === value ? "rgba(99, 102, 241, 0.25)" : "transparent",
                    color: c.code === value ? "#a5b4fc" : "#cbd5e1",
                    display: "flex",
                    justify: "space-between",
                    alignItems: "center",
                    fontSize: "0.88rem",
                    fontWeight: c.code === value ? 700 : 500,
                    transition: "background 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 800, width: "24px" }}>{c.symbol}</span>
                    <span>{c.code}</span>
                    <span style={{ fontSize: "0.78rem", opacity: 0.7 }}>({c.name})</span>
                  </div>
                  {c.code === value && <span>✓</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [stampUrl, setStampUrl] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");
  const [nagadNumber, setNagadNumber] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [activePaymentTab, setActivePaymentTab] = useState("card");
  const [isLocked, setIsLocked] = useState(false);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingStamp, setUploadingStamp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        const json = await res.json();
        if (json.success && json.data) {
          const profile = json.data;
          setBusinessName(profile.businessName || "");
          setEmail(profile.email || "");
          setPhone(profile.phone || "");
          setAddress(profile.address || "");
          setTaxId(profile.taxId || "");
          setLogoUrl(profile.logoUrl || "");
          setStampUrl(profile.stampUrl || "");
          setCurrency(profile.currency || "USD");
          setTaxRate(profile.taxRate || 0);
          setPaymentDetails(profile.paymentDetails || "");
          setBkashNumber(profile.bkashNumber || "");
          setNagadNumber(profile.nagadNumber || "");
          setBankDetails(profile.bankDetails || "");
          setPaymentLink(profile.paymentLink || "");
          setIsLocked(!!profile.isLocked);
        }
      } catch (err) {
        console.error("Failed to load profile settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileUpload = async (e, setTargetUrl, setUploadingState) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingState(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setTargetUrl(json.url);
      } else {
        setErrorMsg(json.error || "Failed to upload image file");
      }
    } catch (err) {
      console.error("File upload error", err);
      setErrorMsg("Error uploading image file. Please try again.");
    } finally {
      setUploadingState(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!isLocked) {
      const confirmSave = window.confirm(
        `Are you sure you want to save these business details?\n\nBusiness Name: ${businessName}\nEmail Address: ${email}\n\nOnce saved, these details will be permanently locked to your license to prevent account abuse. Double check for spelling errors!`
      );
      if (!confirmSave) return;
    }

    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          email,
          phone,
          address,
          taxId,
          logoUrl,
          stampUrl,
          currency,
          taxRate: parseFloat(taxRate) || 0,
          paymentDetails,
          bkashNumber,
          nagadNumber,
          bankDetails,
          paymentLink,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg("Branding & Business settings updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setErrorMsg(json.error || "Failed to save settings");
      }
    } catch (err) {
      console.error("Save settings error", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: "var(--text-muted)" }}>Loading business settings...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Account & Official Brand Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Configure company letterhead, logo, official seal/stamp, default currency & tax rules
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
        {/* LEFT COLUMN: BRANDING FORM */}
        <form
          onSubmit={handleSave}
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
          }}
        >
          {successMsg && (
            <div
              style={{
                background: "rgba(52, 211, 153, 0.15)",
                border: "1px solid rgba(52, 211, 153, 0.3)",
                color: "#34d399",
                padding: "0.75rem",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#fca5a5",
                padding: "0.75rem",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {errorMsg}
            </div>
          )}

          {isLocked ? (
            <div
              style={{
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                color: "#a5b4fc",
                padding: "0.75rem",
                borderRadius: "10px",
                fontSize: "0.8rem",
                textAlign: "left",
                lineHeight: "1.4",
              }}
            >
              🔒 <strong>License details are locked:</strong> Registered Business Name and Email are permanent. Other letterhead settings can be modified anytime.
            </div>
          ) : (
            <div
              style={{
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                color: "#fcd34d",
                padding: "0.75rem",
                borderRadius: "10px",
                fontSize: "0.8rem",
                textAlign: "left",
                lineHeight: "1.4",
              }}
            >
              ⚠️ <strong>License Setup:</strong> Once you customize and save your Business Name and Email, they will be permanently locked to your subscription.
            </div>
          )}

          {/* Section: Official Business Identity */}
          <div style={{ fontSize: "0.95rem", fontWeight: 700, borderBottom: "1px solid var(--border)", paddingBottom: "0.4rem", color: "var(--primary)" }}>
            1. Official Company Identity & Letterhead
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Business Name</label>
              {isLocked && <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: "600" }}>🔒 Locked</span>}
            </div>
            <input
              type="text"
              required
              disabled={isLocked}
              style={{
                background: isLocked ? "rgba(255, 255, 255, 0.03)" : "rgba(2, 6, 23, 0.6)",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                color: isLocked ? "var(--text-muted)" : "var(--foreground)",
                outline: "none",
              }}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          {/* Company Logo Upload & URL Field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Company Logo</label>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <input
                type="text"
                placeholder="https://example.com/logo.png or Upload file"
                style={{ flex: 1, background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none" }}
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
              <label
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {uploadingLogo ? "Uploading..." : "📁 Upload Logo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setLogoUrl, setUploadingLogo)}
                  style={{ display: "none" }}
                  disabled={uploadingLogo}
                />
              </label>
            </div>
          </div>

          {/* Official Seal / Stamp Upload & URL Field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Official Seal / Signature Stamp</label>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <input
                type="text"
                placeholder="https://example.com/stamp.png or Upload file"
                style={{ flex: 1, background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none" }}
                value={stampUrl}
                onChange={(e) => setStampUrl(e.target.value)}
              />
              <label
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  color: "#ffffff",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {uploadingStamp ? "Uploading..." : "📁 Upload Stamp"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setStampUrl, setUploadingStamp)}
                  style={{ display: "none" }}
                  disabled={uploadingStamp}
                />
              </label>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Tax / VAT Registration ID</label>
              <input
                type="text"
                placeholder="e.g. VAT-987654321"
                style={{ background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none" }}
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Phone Number</label>
              <input
                type="text"
                style={{ background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none" }}
                value={phone}
                placeholder="e.g. +1 (555) 0192"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Official Business Address</label>
            <input
              type="text"
              style={{ background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none" }}
              value={address}
              placeholder="e.g. 123 Tech Lane, San Francisco, CA"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Email Address</label>
            <input
              type="email"
              required
              disabled={isLocked}
              style={{
                background: isLocked ? "rgba(255, 255, 255, 0.03)" : "rgba(2, 6, 23, 0.6)",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                color: isLocked ? "var(--text-muted)" : "var(--foreground)",
                outline: "none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Section: Defaults & Payments */}
          <div style={{ fontSize: "0.95rem", fontWeight: 700, borderBottom: "1px solid var(--border)", paddingBottom: "0.4rem", marginTop: "0.5rem", color: "var(--primary)" }}>
            2. Payment & Accounting Defaults
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Default Currency</label>
              <SearchableCurrencySelect value={currency} onChange={setCurrency} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Default Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                required
                style={{ background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none" }}
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
              />
            </div>
          </div>

          {/* INTERACTIVE MERCHANT PAYMENT CONFIGURATION CARD (EXACT IMAGE 2 AESTHETICS) */}
          <div
            style={{
              background: "#0f172a",
              borderRadius: "22px",
              padding: "1.75rem",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              marginTop: "0.5rem",
              color: "#f8fafc",
            }}
          >
            {/* Header matching Image 2 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.01em" }}>
                  Configure Client Checkout
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "0.25rem 0 0 0" }}>
                  Total Payable Preview: <span style={{ color: "#34d399", fontWeight: 800 }}>USD 1,500.00</span>
                </p>
              </div>
            </div>

            {/* PAYMENT TABS (EXACT MATCHING IMAGE 2 TABS) */}
            <div
              style={{
                display: "flex",
                background: "#1e293b",
                padding: "0.35rem",
                borderRadius: "14px",
                gap: "0.3rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => setActivePaymentTab("card")}
                style={{
                  flex: 1,
                  background: activePaymentTab === "card" ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" : "transparent",
                  color: activePaymentTab === "card" ? "#ffffff" : "#94a3b8",
                  border: "none",
                  padding: "0.65rem 0.5rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  boxShadow: activePaymentTab === "card" ? "0 4px 14px rgba(99, 102, 241, 0.35)" : "none",
                }}
              >
                💳 Card
              </button>
              <button
                type="button"
                onClick={() => setActivePaymentTab("bank")}
                style={{
                  flex: 1,
                  background: activePaymentTab === "bank" ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" : "transparent",
                  color: activePaymentTab === "bank" ? "#ffffff" : "#94a3b8",
                  border: "none",
                  padding: "0.65rem 0.5rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                🏦 Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => setActivePaymentTab("bkash")}
                style={{
                  flex: 1,
                  background: activePaymentTab === "bkash" ? "#ec4899" : "transparent",
                  color: activePaymentTab === "bkash" ? "#ffffff" : "#94a3b8",
                  border: "none",
                  padding: "0.65rem 0.5rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                💖 bKash
              </button>
              <button
                type="button"
                onClick={() => setActivePaymentTab("nagad")}
                style={{
                  flex: 1,
                  background: activePaymentTab === "nagad" ? "#f97316" : "transparent",
                  color: activePaymentTab === "nagad" ? "#ffffff" : "#94a3b8",
                  border: "none",
                  padding: "0.65rem 0.5rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                🟠 Nagad
              </button>
            </div>

            {/* TAB CONTENTS (MATCHING IMAGE 2 EXACT FORM LAYOUT) */}
            {activePaymentTab === "card" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#f1f5f9" }}>Credit card details</div>

                {/* Card Number Input with embedded Card Brand Logos */}
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    style={{
                      width: "100%",
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      padding: "0.8rem 7.5rem 0.8rem 1rem",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      letterSpacing: "1px",
                      fontFamily: "monospace",
                      outline: "none",
                    }}
                  />
                  <div style={{ position: "absolute", right: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", pointerEvents: "none" }}>
                    <span style={{ background: "#1a1f71", color: "#ffffff", fontSize: "0.65rem", fontWeight: 900, padding: "0.2rem 0.4rem", borderRadius: "4px", fontStyle: "italic" }}>VISA</span>
                    <span style={{ width: "22px", height: "14px", background: "radial-gradient(circle at 35% 50%, #eb001b 0%, #eb001b 60%, transparent 61%), radial-gradient(circle at 65% 50%, #f79e1b 0%, #f79e1b 60%, transparent 61%)", borderRadius: "3px" }}></span>
                    <span style={{ background: "#0077a2", color: "#ffffff", fontSize: "0.6rem", fontWeight: 800, padding: "0.2rem 0.35rem", borderRadius: "4px" }}>AMEX</span>
                    <span style={{ background: "#334155", color: "#94a3b8", fontSize: "0.6rem", fontWeight: 700, padding: "0.2rem 0.35rem", borderRadius: "4px" }}>DISCOVER</span>
                  </div>
                </div>

                {/* Expiry & CVC Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="MM / YYYY"
                      maxLength={7}
                      style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "0.8rem 1rem", color: "#ffffff", fontSize: "0.9rem", outline: "none" }}
                    />
                    <span style={{ position: "absolute", right: "1rem", fontSize: "0.95rem", opacity: 0.7 }}>📅</span>
                  </div>

                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input
                      type="password"
                      placeholder="CVC"
                      maxLength={4}
                      style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "0.8rem 1rem", color: "#ffffff", fontSize: "0.9rem", outline: "none" }}
                    />
                    <span style={{ position: "absolute", right: "1rem", fontSize: "0.95rem", opacity: 0.7 }}>🛡️</span>
                  </div>
                </div>

                <p style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.45, margin: "0.25rem 0 0 0" }}>
                  By providing your card information, you allow us to charge your card for future payments in accordance with their terms.
                </p>

                {/* Billing Address Section */}
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#f1f5f9", marginTop: "0.4rem" }}>Billing address</div>

                <div>
                  <select
                    style={{
                      width: "100%",
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      padding: "0.8rem 1rem",
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      outline: "none",
                      appearance: "none",
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1rem",
                    }}
                  >
                    <option value="Bangladesh">Bangladesh BD</option>
                    <option value="United States">United States US</option>
                    <option value="United Kingdom">United Kingdom UK</option>
                    <option value="Canada">Canada CA</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Postal code"
                    style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "0.8rem 1rem", color: "#ffffff", fontSize: "0.9rem", outline: "none" }}
                  />
                </div>

                {/* Merchant Online Gateway Link Field */}
                <div style={{ marginTop: "0.6rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#34d399", display: "block", marginBottom: "0.3rem" }}>
                    Online Gateway Payment Link (Stripe / SSLCommerz URL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://buy.stripe.com/example or https://pay.yourdomain.com"
                    style={{ width: "100%", background: "#1e293b", border: "1px solid #6366f1", borderRadius: "12px", padding: "0.8rem 1rem", color: "#ffffff", fontSize: "0.9rem", outline: "none" }}
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                  />
                </div>
              </div>
            )}

            {activePaymentTab === "bank" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#60a5fa" }}>Bank Wire Transfer Account Details</div>
                <textarea
                  style={{
                    width: "100%",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "0.8rem 1rem",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    outline: "none",
                    minHeight: "90px",
                    fontFamily: "inherit",
                  }}
                  value={bankDetails}
                  placeholder="Bank: City Bank PLC&#10;Account Name: Apex Creative&#10;Account #: 123456789&#10;Branch: Gulshan&#10;Routing: 11026"
                  onChange={(e) => setBankDetails(e.target.value)}
                />
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                  Clients selecting Bank Transfer will see these account instructions to remit their payment.
                </p>
              </div>
            )}

            {activePaymentTab === "bkash" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#f472b6" }}>bKash Account Settings (Merchant / Personal)</div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#a1a1aa", display: "block", marginBottom: "0.38rem" }}>
                    bKash Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01712345678"
                    style={{ width: "100%", background: "#1e293b", border: "1px solid #ec4899", borderRadius: "12px", padding: "0.8rem 1rem", color: "#ffffff", fontSize: "0.9rem", outline: "none" }}
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                  />
                </div>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                  Clients paying via bKash will be shown this number with a 1-click Copy button to transfer funds.
                </p>
              </div>
            )}

            {activePaymentTab === "nagad" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#fb923c" }}>Nagad Account Settings (Personal / Merchant)</div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#a1a1aa", display: "block", marginBottom: "0.38rem" }}>
                    Nagad Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01812345678"
                    style={{ width: "100%", background: "#1e293b", border: "1px solid #f97316", borderRadius: "12px", padding: "0.8rem 1rem", color: "#ffffff", fontSize: "0.9rem", outline: "none" }}
                    value={nagadNumber}
                    onChange={(e) => setNagadNumber(e.target.value)}
                  />
                </div>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                  Clients paying via Nagad will be shown this number with a 1-click Copy button.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              background: "linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)",
              color: "#ffffff",
              padding: "0.85rem",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              marginTop: "0.5rem",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
            }}
          >
            {saving ? "Saving Changes..." : "Save Branding & Settings"}
          </button>
        </form>

        {/* RIGHT COLUMN: LIVE LETTERHEAD PAPER PREVIEW */}
        <div style={{ position: "sticky", top: "2rem" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--foreground)" }}>
            ⚡ Live Official Letterhead Preview
          </div>
          <div
            style={{
              background: "#ffffff",
              color: "#0f172a",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              fontFamily: "'Outfit', sans-serif",
              minHeight: "500px",
              display: "flex",
              flexDirection: "column",
              justify: "space-between",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Top Official Letterhead Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #6366f1", paddingBottom: "1.25rem" }}>
                <div>
                  {/* BOTH Logo AND Business Name rendered together */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                    {logoUrl && (
                      <img src={logoUrl} alt="Logo" style={{ maxHeight: "44px", objectFit: "contain" }} />
                    )}
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}>
                      {businessName || "Your Business Name"}
                    </div>
                  </div>

                  {taxId && (
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginTop: "0.1rem" }}>
                      TAX / REG ID: {taxId}
                    </div>
                  )}
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>
                    {address || "123 Business Street, Suite 100, City"}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#4f46e5" }}>INVOICE / ESTIMATE</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{email || "admin@company.com"}</div>
                  {phone && <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{phone}</div>}
                </div>
              </div>

              {/* Sample Content Watermark */}
              <div style={{ margin: "2rem 0 1rem 0", textAlign: "center", opacity: 0.25, border: "2px dashed #94a3b8", borderRadius: "12px", padding: "2rem 1rem" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>INVOICE & ESTIMATE CONTENT GOES HERE</div>
                <div style={{ fontSize: "0.8rem" }}>Client Details • Line Items • Totals & Math</div>
              </div>

              {/* Live Interactive Payment Action Banner Visual Preview */}
              <div
                style={{
                  background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
                  color: "#ffffff",
                  borderRadius: "14px",
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 10px 25px rgba(30, 27, 75, 0.35)",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    💳 Secure Client Checkout Action Banner
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.45rem", flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(255, 255, 255, 0.15)", color: "#fff", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}>
                      💳 Card / Gateway
                    </span>
                    {bkashNumber ? (
                      <span style={{ background: "rgba(236, 72, 153, 0.3)", color: "#f472b6", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}>
                        💖 bKash ({bkashNumber})
                      </span>
                    ) : (
                      <span style={{ background: "rgba(236, 72, 153, 0.15)", color: "#f472b6", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 500, opacity: 0.7 }}>
                        💖 bKash
                      </span>
                    )}
                    {nagadNumber ? (
                      <span style={{ background: "rgba(249, 115, 22, 0.3)", color: "#fb923c", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}>
                        🟠 Nagad ({nagadNumber})
                      </span>
                    ) : (
                      <span style={{ background: "rgba(249, 115, 22, 0.15)", color: "#fb923c", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 500, opacity: 0.7 }}>
                        🟠 Nagad
                      </span>
                    )}
                    {bankDetails ? (
                      <span style={{ background: "rgba(59, 130, 246, 0.3)", color: "#60a5fa", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}>
                        🏦 Bank Wire
                      </span>
                    ) : (
                      <span style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 500, opacity: 0.7 }}>
                        🏦 Bank Wire
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", color: "#ffffff", padding: "0.55rem 1rem", borderRadius: "10px", fontSize: "0.8rem", fontWeight: 800, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)" }}>
                  🔒 Pay Invoice Now
                </div>
              </div>
            </div>

            {/* Footer Stamp & Payment Details */}
            <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ maxWidth: "60%" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Payment Instructions:</div>
                <div style={{ fontSize: "0.8rem", color: "#334155", marginTop: "0.2rem" }}>
                  {paymentDetails || "Remit payment to Stripe or Bank Wire."}
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                {stampUrl ? (
                  <img src={stampUrl} alt="Official Seal" style={{ maxHeight: "64px", objectFit: "contain", marginBottom: "0.2rem" }} />
                ) : (
                  <div style={{ border: "2px dashed #a5b4fc", borderRadius: "50%", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#6366f1" }}>
                    SEAL / STAMP
                  </div>
                )}
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", marginTop: "0.25rem" }}>Authorized Signatory</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
