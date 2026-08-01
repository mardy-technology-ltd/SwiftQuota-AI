import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "./overview.module.css";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const documents = await prisma.invoiceOrQuote.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  // Calculate aggregates
  const totalInvoiced = documents
    .filter((d) => d.type === "INVOICE")
    .reduce((sum, d) => sum + d.totalAmount, 0);

  const revenuePaid = documents
    .filter((d) => d.type === "INVOICE" && d.status === "PAID")
    .reduce((sum, d) => sum + d.totalAmount, 0);

  const outstanding = documents
    .filter((d) => d.type === "INVOICE" && d.status !== "PAID" && d.status !== "DRAFT")
    .reduce((sum, d) => sum + d.totalAmount, 0);

  const pendingApprovalCount = documents.filter(
    (d) => d.type === "ESTIMATE" && d.status === "SENT"
  ).length;

  const recentDocs = documents.slice(0, 5);

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Track revenue, active estimates, and recent client activity</p>
        </div>
        <Link href="/dashboard/documents/new" className={styles.actionBtn}>
          + Create New Estimate
        </Link>
      </div>

      {/* 4-Column Responsive Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Total Invoiced</span>
            <div className={styles.metricIcon}>💰</div>
          </div>
          <div className={styles.metricValue}>${totalInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className={styles.metricTrend} style={{ color: "var(--accent)" }}>
            ▲ All Invoices Generated
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Revenue Paid</span>
            <div className={styles.metricIcon}>✅</div>
          </div>
          <div className={styles.metricValue} style={{ color: "#34d399" }}>
            ${revenuePaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className={styles.metricTrend} style={{ color: "#34d399" }}>
            ▲ Settled Payments
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Outstanding</span>
            <div className={styles.metricIcon}>⏳</div>
          </div>
          <div className={styles.metricValue} style={{ color: "#f59e0b" }}>
            ${outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className={styles.metricTrend} style={{ color: "#f59e0b" }}>
            ● Pending Client Payment
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Pending Approval</span>
            <div className={styles.metricIcon}>📝</div>
          </div>
          <div className={styles.metricValue} style={{ color: "#6366f1" }}>
            {pendingApprovalCount}
          </div>
          <div className={styles.metricTrend} style={{ color: "#6366f1" }}>
            ● Sent Estimates Awaiting Sign
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Recent Activity (Latest Documents)</span>
          <Link href="/dashboard/documents" style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: "600" }}>
            View All Documents →
          </Link>
        </div>

        {recentDocs.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            No documents found. Click "+ Create New Estimate" to get started!
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Doc #</th>
                <th>Client Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Issued Date</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th style={{ textAlign: "center" }}>Client Portal</th>
              </tr>
            </thead>
            <tbody>
              {recentDocs.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: "700", color: "var(--primary)" }}>{doc.number}</td>
                  <td>{doc.client?.name || "N/A"}</td>
                  <td style={{ fontWeight: "500" }}>{doc.type}</td>
                  <td>
                    <span className={`${styles.statusPill} ${styles[`status${doc.status}`] || styles.statusDRAFT}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{new Date(doc.issuedDate).toLocaleDateString()}</td>
                  <td style={{ textAlign: "right", fontWeight: "700" }}>${doc.totalAmount.toFixed(2)}</td>
                  <td style={{ textAlign: "center" }}>
                    <Link
                      href={`/view/${doc.id}`}
                      target="_blank"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      View Portal 🔗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
