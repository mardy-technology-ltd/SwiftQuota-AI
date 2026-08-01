"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./form.module.css";

export default function FormBuilderPage() {
  const router = useRouter();

  // Document config
  const [docType, setDocType] = useState("ESTIMATE");
  const [number, setNumber] = useState(`SQ-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issuedDate, setIssuedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );

  // Clients state
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [loadingClients, setLoadingClients] = useState(true);

  // Quick Client Modal
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");
  const [savingClient, setSavingClient] = useState(false);

  // Dynamic Itemized Rows
  const [items, setItems] = useState([
    { description: "UI/UX Interface Design", quantity: 10, rate: 75 },
    { description: "React Frontend Integration", quantity: 15, rate: 100 },
  ]);

  // Tax & Discount
  const [taxRate, setTaxRate] = useState(10);
  const [discount, setDiscount] = useState(0);

  // Submit state
  const [submitting, setSubmitting] = useState(false);

  // Fetch clients on mount
  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const res = await fetch("/api/clients");
      const json = await res.json();
      if (json.success) {
        setClients(json.data);
        if (json.data.length > 0 && !selectedClientId) {
          setSelectedClientId(json.data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load clients", err);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Item helpers
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Live Math Calculations
  const subtotal = items.reduce((acc, item) => {
    const q = parseFloat(item.quantity) || 0;
    const r = parseFloat(item.rate) || 0;
    return acc + q * r;
  }, 0);

  const taxAmount = subtotal * ((parseFloat(taxRate) || 0) / 100);
  const discountAmount = subtotal * ((parseFloat(discount) || 0) / 100);
  const grandTotal = subtotal + taxAmount - discountAmount;

  // Selected Client Details for Live Preview
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Handle Quick Create Client Submit
  const handleQuickClientSubmit = async (e) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail) return;

    try {
      setSavingClient(true);
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClientName,
          email: newClientEmail,
          phone: newClientPhone,
          address: newClientAddress,
        }),
      });

      const json = await res.json();
      if (json.success) {
        const createdClient = json.data;
        setClients([createdClient, ...clients]);
        setSelectedClientId(createdClient.id);
        setShowClientModal(false);
        setNewClientName("");
        setNewClientEmail("");
        setNewClientPhone("");
        setNewClientAddress("");
      }
    } catch (err) {
      console.error("Failed to create client", err);
    } finally {
      setSavingClient(false);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number,
          type: docType,
          status: "SENT",
          issuedDate,
          dueDate,
          items: JSON.stringify(items),
          taxRate: parseFloat(taxRate) || 0,
          discount: parseFloat(discount) || 0,
          totalAmount: grandTotal,
          clientId: selectedClientId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        router.push("/dashboard/documents");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to save document", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <Link href="/dashboard" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1 className={styles.title}>
            Create New {docType === "ESTIMATE" ? "Estimate" : "Invoice"}
          </h1>
        </div>
      </div>

      <div className={styles.splitGrid}>
        {/* LEFT COLUMN: FORM EDITOR */}
        <form onSubmit={handleSubmit} className={styles.formCard}>
          {/* Section 1: Document Type & Number */}
          <div>
            <div className={styles.sectionTitle}>1. Document Type & Number</div>
            <div className={styles.typeToggleGroup} style={{ marginBottom: "1rem" }}>
              <button
                type="button"
                className={`${styles.typeBtn} ${
                  docType === "ESTIMATE" ? styles.typeBtnActive : ""
                }`}
                onClick={() => setDocType("ESTIMATE")}
              >
                Estimate / Quote
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${
                  docType === "INVOICE" ? styles.typeBtnActive : ""
                }`}
                onClick={() => setDocType("INVOICE")}
              >
                Invoice
              </button>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Document Number</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Issued Date</label>
                <input
                  type="date"
                  required
                  className={styles.input}
                  value={issuedDate}
                  onChange={(e) => setIssuedDate(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field} style={{ marginTop: "1rem" }}>
              <label className={styles.label}>Due Date</label>
              <input
                type="date"
                required
                className={styles.input}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Client Selector */}
          <div>
            <div className={styles.sectionTitle}>2. Client Information</div>
            <div className={styles.field}>
              <label className={styles.label}>Select Client</label>
              <div className={styles.clientSelectorGroup}>
                <select
                  className={styles.input}
                  style={{ flex: 1 }}
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                >
                  {loadingClients ? (
                    <option>Loading clients...</option>
                  ) : clients.length === 0 ? (
                    <option value="">No clients found. Click Quick Add below!</option>
                  ) : (
                    clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))
                  )}
                </select>

                <button
                  type="button"
                  className={styles.quickClientBtn}
                  onClick={() => setShowClientModal(true)}
                >
                  + Quick Add Client
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Dynamic Itemized Rows */}
          <div>
            <div className={styles.sectionTitle}>3. Line Items & Services</div>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th style={{ width: "45%" }}>Description</th>
                  <th style={{ width: "15%" }}>Qty</th>
                  <th style={{ width: "20%" }}>Rate ($)</th>
                  <th style={{ width: "15%", textAlign: "right" }}>Total</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const rowTotal =
                    (parseFloat(item.quantity) || 0) *
                    (parseFloat(item.rate) || 0);

                  return (
                    <tr key={index}>
                      <td style={{ paddingRight: "0.5rem" }}>
                        <input
                          type="text"
                          required
                          placeholder="Line item scope"
                          className={styles.input}
                          style={{ padding: "0.5rem" }}
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(index, "description", e.target.value)
                          }
                        />
                      </td>
                      <td style={{ paddingRight: "0.5rem" }}>
                        <input
                          type="number"
                          min="1"
                          required
                          className={styles.input}
                          style={{ padding: "0.5rem" }}
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                      <td style={{ paddingRight: "0.5rem" }}>
                        <input
                          type="number"
                          step="0.01"
                          required
                          className={styles.input}
                          style={{ padding: "0.5rem" }}
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "700" }}>
                        ${rowTotal.toFixed(2)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button
              type="button"
              className={styles.addItemBtn}
              onClick={handleAddItem}
            >
              + Add Line Item
            </button>
          </div>

          {/* Section 4: Live Math Summary */}
          <div>
            <div className={styles.sectionTitle}>4. Taxes, Discounts & Total</div>
            <div className={styles.row2} style={{ marginBottom: "1rem" }}>
              <div className={styles.field}>
                <label className={styles.label}>Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className={styles.input}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Discount (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className={styles.input}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className={styles.calcSummary}>
              <div className={styles.calcRow}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: "600" }}>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.calcRow}>
                <span>Tax ({taxRate}%):</span>
                <span style={{ color: "#34d399" }}>+${taxAmount.toFixed(2)}</span>
              </div>
              <div className={styles.calcRow}>
                <span>Discount ({discount}%):</span>
                <span style={{ color: "#ef4444" }}>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className={`${styles.calcRow} ${styles.grandTotalRow}`}>
                <span>Grand Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={submitting} className={styles.submitBtn}>
            {submitting
              ? "Saving Document to Database..."
              : `Save & Send ${docType === "ESTIMATE" ? "Estimate" : "Invoice"} →`}
          </button>
        </form>

        {/* RIGHT COLUMN: LIVE PAPER PREVIEW PANEL */}
        <div>
          <div className={styles.sectionTitle} style={{ color: "var(--foreground)" }}>
            ⚡ Live Document Paper Preview
          </div>

          <div className={styles.previewPaper}>
            <div className={styles.previewHeader}>
              <div>
                <div className={styles.previewTitle}>
                  {docType === "ESTIMATE" ? "ESTIMATE / QUOTE" : "INVOICE"}
                </div>
                <div className={styles.previewNum}>#{number}</div>
              </div>
              <div className={styles.previewDates}>
                <div>Issued: {issuedDate}</div>
                <div>Due Date: {dueDate}</div>
              </div>
            </div>

            {/* Billed To Client Info */}
            <div className={styles.previewClientBlock}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700, marginBottom: "0.25rem" }}>
                Billed To Client:
              </div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a" }}>
                {selectedClient ? selectedClient.name : "Select Client Above..."}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                {selectedClient ? selectedClient.email : ""}
              </div>
              {selectedClient?.phone && (
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Phone: {selectedClient.phone}
                </div>
              )}
              {selectedClient?.address && (
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  {selectedClient.address}
                </div>
              )}
            </div>

            {/* Table Preview */}
            <table className={styles.previewTable}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Rate</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const amt =
                    (parseFloat(item.quantity) || 0) *
                    (parseFloat(item.rate) || 0);

                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{item.description || "Unspecified item"}</td>
                      <td style={{ textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ textAlign: "right" }}>${item.rate}</td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>${amt.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals Preview */}
            <div className={styles.previewTotalBox}>
              <div style={{ fontSize: "0.88rem", color: "#64748b" }}>
                Subtotal: <strong style={{ color: "#0f172a" }}>${subtotal.toFixed(2)}</strong>
              </div>
              {taxRate > 0 && (
                <div style={{ fontSize: "0.88rem", color: "#64748b" }}>
                  Tax ({taxRate}%): <strong style={{ color: "#059669" }}>+${taxAmount.toFixed(2)}</strong>
                </div>
              )}
              {discount > 0 && (
                <div style={{ fontSize: "0.88rem", color: "#64748b" }}>
                  Discount ({discount}%): <strong style={{ color: "#dc2626" }}>-${discountAmount.toFixed(2)}</strong>
                </div>
              )}
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#4f46e5", marginTop: "0.5rem" }}>
                Total Due: ${grandTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CLIENT CREATION MODAL */}
      {showClientModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>+ Quick Add New Client</h2>
              <button
                type="button"
                onClick={() => setShowClientModal(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickClientSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className={styles.field}>
                <label className={styles.label}>Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  className={styles.input}
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Client Email *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@acme.com"
                  className={styles.input}
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 0192"
                  className={styles.input}
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Address</label>
                <input
                  type="text"
                  placeholder="123 Tech Lane, San Francisco, CA"
                  className={styles.input}
                  value={newClientAddress}
                  onChange={(e) => setNewClientAddress(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingClient}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "none",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {savingClient ? "Saving..." : "Save Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
