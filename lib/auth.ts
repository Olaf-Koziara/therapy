import { cache } from "react";
import db from "@/lib/db";

export const getCurrentUser = cache(async () => {
  // MOCK AUTH for MVP
  // In real app: import { auth } from "@clerk/nextjs"; const { userId } = auth();

  // Find the first user in DB or create one if none exists (Auto-seed for dev)
  const user = await db.user.findFirst({
    include: { tenant: true }
  });

  if (user) {
    return user;
  }

  // Seed if empty
  console.log("Seeding database with initial Tenant and User...");
  const newTenant = await db.tenant.create({
    data: {
      name: "Gabinet Terapeutyczny (Demo)",
      users: {
        create: {
          clerkId: "mock_clerk_id",
          email: "demo@therapyflow.pl",
          role: "OWNER"
        }
      }
    },
    include: { users: true }
  });

  return newTenant.users[0];
});
