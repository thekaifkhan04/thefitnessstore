import React from "react";
import { getAdminSession } from "@/lib/auth";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";

  // The login page manages its own unauthenticated state
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {session && <AdminNavbar userEmail={session.email} />}
      <div className="flex-1">{children}</div>
    </div>
  );
}
