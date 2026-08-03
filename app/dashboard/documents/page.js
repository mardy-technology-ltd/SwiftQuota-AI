import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const documents = await prisma.invoiceOrQuote.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const countThisMonth = await prisma.invoiceOrQuote.count({
    where: { createdAt: { gte: startOfMonth } },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>All Documents</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.25rem" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
              Manage invoices, estimates, and digital signatures
            </p>
            <span
              style={{
                background: countThisMonth >= 3 ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                color: countThisMonth >= 3 ? "#fca5a5" : "#34d399",
                border: `1px solid ${countThisMonth >= 3 ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
                padding: "0.2rem 0.6rem",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              ● {countThisMonth} / 3 Free Monthly Invoices Used
            </span>
          </div>
        </div>
        <Link
          href="/dashboard/documents/new"
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)",
            color: "#fff",
            padding: "0.75rem 1.4rem",
            borderRadius: "10px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          + Create New Estimate
        </Link>
      </div>

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "18px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "1rem 1.5rem" }}>Number</th>
              <th style={{ padding: "1rem 1.5rem" }}>Client</th>
              <th style={{ padding: "1rem 1.5rem" }}>Type</th>
              <th style={{ padding: "1rem 1.5rem" }}>Status</th>
              <th style={{ padding: "1rem 1.5rem" }}>Due Date</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Total Amount</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "center" }}>Client Portal</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1rem 1.5rem", fontWeight: 700, color: "var(--primary)" }}>{doc.number}</td>
                <td style={{ padding: "1rem 1.5rem" }}>{doc.client?.name || "N/A"}</td>
                <td style={{ padding: "1rem 1.5rem" }}>{doc.type}</td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <span style={{ padding: "0.25rem 0.65rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                    {doc.status}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>{new Date(doc.dueDate).toLocaleDateString()}</td>
                <td style={{ padding: "1rem 1.5rem", textAlign: "right", fontWeight: 700 }}>${doc.totalAmount.toFixed(2)}</td>
                <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                  <Link
                    href={`/view/${doc.id}`}
                    target="_blank"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    View Portal 🔗
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
