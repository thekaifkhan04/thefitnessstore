import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OffersManager } from "@/components/admin/offers-manager";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const offers = await prisma.offer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <OffersManager offers={offers} />
    </div>
  );
}
