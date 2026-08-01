"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState("");

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
          setCurrency(profile.currency || "USD");
          setTaxRate(profile.taxRate || 0);
          setPaymentDetails(profile.paymentDetails || "");
        }
      } catch (err) {
        console.error("Failed to load profile settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
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
          currency,
          taxRate: parseFloat(taxRate) || 0,
          paymentDetails,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg("Settings updated successfully!");
        // Small delay to let user see success message, then reload to update sidebar layout
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
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Account & Business Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Configure invoice branding, default currency, and payment details</p>
      </div>

      <form onSubmit={handleSave} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "18px", padding: "2rem", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "1.25rem", boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}>
        {successMsg && (
          <div style={{ background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)", color: "#34d399", padding: "0.75rem", borderRadius: "10px", fontSize: "0.85rem", fontWeight: "600", textAlign: "center" }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", padding: "0.75rem", borderRadius: "10px", fontSize: "0.85rem", fontWeight: "600", textAlign: "center" }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Business Name</label>
          <input
            type="text"
            required
            style={{ background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none" }}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Email Address</label>
          <input
            type="email"
            required
            style={{ background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Business Address</label>
          <input
            type="text"
            style={{ background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none" }}
            value={address}
            placeholder="e.g. 123 Tech Lane, San Francisco, CA"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Default Currency</label>
            <input
              type="text"
              required
              style={{ background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none" }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
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

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>Payment Instructions / Stripe Link</label>
          <textarea
            style={{ background: "rgba(2, 6, 23, 0.6)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border)", color: "var(--foreground)", outline: "none", minHeight: "80px", resize: "vertical", fontFamily: "inherit" }}
            value={paymentDetails}
            placeholder="e.g. Please send payments to Stripe link: stripe.com/pay/abc or Bank Transfer: Acct 1234-5678"
            onChange={(e) => setPaymentDetails(e.target.value)}
          />
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
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
          }}
        >
          {saving ? "Saving Changes..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
