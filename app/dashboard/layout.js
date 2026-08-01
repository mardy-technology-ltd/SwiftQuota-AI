import DashboardLayout from "@/components/DashboardLayout";

export const metadata = {
  title: "Dashboard - SwiftQuote AI",
};

export default function DashboardRootLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
