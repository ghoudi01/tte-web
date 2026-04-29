/**
 * Seed script: populates the database with demo users, merchants, plugins,
 * orders, and phone verifications. Run from web/: pnpm seed
 * Requires DATABASE_URL in .env.
 */
import "dotenv/config";
import { eq, like, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  users,
  merchants,
  plugins,
  orders,
  phoneVerifications,
} from "./drizzle/schema";
import { getDb } from "./db";

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available. Set DATABASE_URL in .env");
    process.exit(1);
  }

  console.log("Seeding database...");

  // 1. Seed users (skip if seed users already exist)
  const existingSeedUsers = await db
    .select()
    .from(users)
    .where(like(users.openId, "seed-%"))
    .limit(1);
  if (existingSeedUsers.length > 0) {
    console.log("Seed users already exist, skipping user/merchant creation.");
  } else {
    await db.insert(users).values({
      openId: "seed-demo-1",
      name: "Demo Merchant",
      email: "demo@example.com",
      loginMethod: "email",
      role: "user",
    });
    const [userRow1] = await db
      .select()
      .from(users)
      .where(eq(users.openId, "seed-demo-1"))
      .limit(1);
    const uid1 = userRow1!.id;

    await db.insert(users).values({
      openId: "seed-demo-2",
      name: "Second Demo",
      email: "demo2@example.com",
      loginMethod: "email",
      role: "user",
    });
    const [userRow2] = await db
      .select()
      .from(users)
      .where(eq(users.openId, "seed-demo-2"))
      .limit(1);
    const uid2 = userRow2!.id;

    const apiKey1 = `tte_${nanoid(32)}`;
    const apiKey2 = `tte_${nanoid(32)}`;

    await db.insert(merchants).values({
      userId: uid1,
      businessName: "Tunisia Shop Demo",
      email: "demo@example.com",
      phone: "+216 12 345 678",
      address: "123 Avenue Habib Bourguiba, Tunis",
      city: "Tunis",
      country: "Tunisia",
      apiKey: apiKey1,
      rtoRate: 12,
      totalOrders: 150,
      successfulOrders: 132,
      status: "active",
      subscriptionPlan: "growth",
    });
    await db.insert(merchants).values({
      userId: uid2,
      businessName: "Sfax Commerce",
      email: "demo2@example.com",
      phone: "+216 98 765 432",
      address: "45 Rue de la République, Sfax",
      city: "Sfax",
      country: "Tunisia",
      apiKey: apiKey2,
      rtoRate: 8,
      totalOrders: 80,
      successfulOrders: 74,
      status: "active",
      subscriptionPlan: "starter",
    });
    console.log("Created 2 users and 2 merchants.");
  }

  // 2. Seed plugins (only if none exist)
  const existingPlugins = await db.select().from(plugins).limit(1);
  if (existingPlugins.length > 0) {
    console.log("Plugins already exist, skipping.");
  } else {
    await db.insert(plugins).values([
      {
        name: "Shopify Connector",
        description: "Connect your Shopify store for order sync and verification.",
        type: "shopify",
        version: "1.0.0",
        status: "active",
        documentationUrl: "https://docs.example.com/shopify",
      },
      {
        name: "WooCommerce Connector",
        description: "Integrate WooCommerce with Tunisia Trust Engine.",
        type: "woocommerce",
        version: "1.0.0",
        status: "active",
        documentationUrl: "https://docs.example.com/woocommerce",
      },
      {
        name: "REST API",
        description: "Use our REST API for custom integrations and webhooks.",
        type: "api",
        version: "1.0.0",
        status: "active",
        documentationUrl: "https://docs.example.com/api",
      },
      {
        name: "Custom Integration",
        description: "Build your own integration with our SDK.",
        type: "custom",
        version: "1.0.0",
        status: "active",
      },
    ]);
    console.log("Created 4 plugins.");
  }

  // 3. Seed orders and phone verifications (optional sample data)
  const [merchantRow] = await db
    .select()
    .from(merchants)
    .where(like(merchants.businessName, "%Demo%"))
    .limit(1);
  if (merchantRow) {
    const orderCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.merchantId, merchantRow.id));
    if (Number(orderCount[0]?.count ?? 0) === 0) {
      await db.insert(orders).values([
        {
          merchantId: merchantRow.id,
          phoneNumber: "+216 12 345 678",
          orderAmount: 15000,
          trustScore: 72,
          verificationStatus: "verified",
          orderStatus: "delivered",
          verificationMethod: "sms",
        },
        {
          merchantId: merchantRow.id,
          phoneNumber: "+216 98 111 222",
          orderAmount: 8500,
          trustScore: 45,
          verificationStatus: "pending",
          orderStatus: "placed",
          verificationMethod: "none",
        },
      ]);
      await db.insert(phoneVerifications).values([
        {
          phoneNumber: "+216 12 345 678",
          isVerified: 1,
          trustScore: 72,
          rtoCount: 0,
          successfulOrders: 5,
        },
        {
          phoneNumber: "+216 98 111 222",
          isVerified: 0,
          trustScore: 45,
          rtoCount: 2,
          successfulOrders: 1,
        },
      ]);
      console.log("Created sample orders and phone verifications.");
    }
  }

  console.log("Seed completed.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
