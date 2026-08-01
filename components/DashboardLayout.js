"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({ children }) {
  const [theme, setTheme] = useState("dark");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        const json = await res.json();
        if (json.success) {
          setProfile(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "📊" },
    { name: "Documents", href: "/dashboard/documents", icon: "📄" },
    { name: "Clients", href: "/dashboard/clients", icon: "👥" },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  ];

  return (
    <div className={styles.layoutWrapper}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <span>SwiftQuote</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${
                  isActive ? styles.navItemActive : ""
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              {(profile?.businessName || "A")[0].toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{profile?.businessName || "Admin User"}</span>
              <span className={styles.userEmail}>{profile?.email || "admin@swiftquote.ai"}</span>
            </div>
          </div>

          <button onClick={toggleTheme} className={styles.themeBtn}>
            <span>{theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
            <span>Toggle</span>
          </button>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <header className={styles.topBar}>
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>
            {profile?.businessName || "Apex Creative Agency"} — Admin Workspace
          </div>
          <Link
            href="/"
            style={{
              fontSize: "0.85rem",
              color: "var(--primary)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            View Public Site →
          </Link>
        </header>

        <main style={{ padding: "2rem", flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
