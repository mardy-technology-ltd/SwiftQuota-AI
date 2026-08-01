import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { _count: { select: { documents: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Client Directory</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Manage your solopreneur clients and contact details</p>
      </div>

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "18px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "1rem 1.5rem" }}>Client Name</th>
              <th style={{ padding: "1rem 1.5rem" }}>Email</th>
              <th style={{ padding: "1rem 1.5rem" }}>Phone</th>
              <th style={{ padding: "1rem 1.5rem" }}>Address</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Documents</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1rem 1.5rem", fontWeight: 700 }}>{c.name}</td>
                <td style={{ padding: "1rem 1.5rem", color: "var(--primary)" }}>{c.email}</td>
                <td style={{ padding: "1rem 1.5rem" }}>{c.phone || "N/A"}</td>
                <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>{c.address || "N/A"}</td>
                <td style={{ padding: "1rem 1.5rem", textAlign: "right", fontWeight: 700 }}>{c._count.documents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
