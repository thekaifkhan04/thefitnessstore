import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EnquiriesManager } from "@/components/admin/enquiries-manager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const enquiries = await prisma.orderEnquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <EnquiriesManager initialEnquiries={enquiries} />
    </div>
  );
}
