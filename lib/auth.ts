import db from "@/lib/db";
import { cache } from 'react';

// Cache the user lookup per request to prevent multiple DB calls
export const getCurrentUser = cache(async () => {
  // MOCK AUTH for MVP
  // In real app: import { auth } from "@clerk/nextjs"; const { userId } = auth();

  // Find the first user in DB or create one if none exists (Auto-seed for dev)
  try {
    const user = await db.user.findFirst({
      include: { tenant: true }
    });

    if (user) {
      return user;
    }

    // Seed if empty - use upsert or check again inside transaction to be safe from race conditions
    console.log("Seeding database with initial Tenant and User...");
    // We use a transaction to ensure atomicity, although SQLite has single-writer locking
    // But for "find then create" pattern in async environments (like next build static generation),
    // it's safer to handle potential conflicts or use upsert if possible.
    // Since we're creating a new tenant AND user, upsert is tricky on top level.
    // Let's try to find one more time or create.

    const count = await db.user.count();
    if (count > 0) {
        return db.user.findFirstOrThrow({ include: { tenant: true }});
    }

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
  } catch (error) {
    // If race condition happened during build, just fetch again
    console.error("Auth helper error (likely race condition during seed):", error);
    const user = await db.user.findFirst({ include: { tenant: true }});
    if (user) return user;
    throw error;
  }
});
