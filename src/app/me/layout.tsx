import Footer from "@/src/components/layout/footer";
import Header from "@/src/components/layout/header";
import Sidebar from "@/src/components/layout/sidebar";
import { appConfig } from "@/src/core/config";
import { getSession } from "@/src/core/session/session";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

/**
 * AdminLayout — the main admin dashboard layout.
 */
export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div
        className="flex flex-col flex-1 h-full overflow-hidden"
        style={{ marginLeft: appConfig.sidebarWidth }}
      >
        {/* Sticky header */}
        <Header />

        {/* Main content scrollable area */}
        <main className="flex-1 overflow-y-auto px-6 py-4">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
