import { eq, and, desc, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  users,
  merchants,
  phoneVerifications,
  orders,
  plugins,
  merchantPlugins,
  sessions,
  type InsertUser,
  type InsertMerchant,
  type InsertPhoneVerification,
  type InsertOrder,
  type InsertMerchantPlugin,
  type InsertSession,
} from "./drizzle/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _db: any = null;

export async function getDb() {
  if (!_db && typeof process !== "undefined" && process.env?.DATABASE_URL) {
    try {
      const mysql = await import("mysql2/promise");
      const pool = mysql.createPool(process.env.DATABASE_URL);
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db as ReturnType<typeof drizzle> | null;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required");
  const db = await getDb();
  if (!db) return;
  const updateSet: Record<string, unknown> = {
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    lastSignedIn: user.lastSignedIn ?? new Date(),
  };
  if (user.role !== undefined) updateSet.role = user.role;
  if ("passwordHash" in user && user.passwordHash !== undefined)
    updateSet.passwordHash = user.passwordHash;
  await db.insert(users).values(user).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return rows[0] ?? null;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createUser(data: InsertUser): Promise<typeof users.$inferSelect> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(users).values(data);
  const id = (result as { insertId?: number }).insertId ?? (result as unknown[])[0];
  const rows = await db.select().from(users).where(eq(users.id, Number(id))).limit(1);
  return rows[0]!;
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return rows[0] ?? null;
}

export async function getMerchantByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(merchants).where(eq(merchants.userId, userId)).limit(1);
  return rows[0] ?? null;
}

export async function getMerchantByApiKey(apiKey: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(merchants).where(eq(merchants.apiKey, apiKey)).limit(1);
  return rows[0] ?? null;
}

export async function createMerchant(data: InsertMerchant) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(merchants).values(data);
  const id = (result as { insertId?: number }).insertId ?? (result as unknown[])[0];
  const rows = await db.select().from(merchants).where(eq(merchants.id, Number(id))).limit(1);
  return rows[0]!;
}

export async function updateMerchant(id: number, data: Partial<InsertMerchant>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(merchants).set(data).where(eq(merchants.id, id));
}

export async function getPhoneVerification(phoneNumber: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(phoneVerifications).where(eq(phoneVerifications.phoneNumber, phoneNumber)).limit(1);
  return rows[0] ?? null;
}

export async function createOrUpdatePhoneVerification(data: InsertPhoneVerification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getPhoneVerification(data.phoneNumber);
  const payload = {
    phoneNumber: data.phoneNumber,
    otp: data.otp ?? existing?.otp ?? null,
    isVerified: data.isVerified ?? existing?.isVerified ?? 0,
    trustScore: data.trustScore ?? existing?.trustScore ?? 50,
    rtoCount: data.rtoCount ?? existing?.rtoCount ?? 0,
    successfulOrders: data.successfulOrders ?? existing?.successfulOrders ?? 0,
    lastVerifiedAt: data.lastVerifiedAt ?? existing?.lastVerifiedAt ?? null,
  };
  if (existing) {
    await db.update(phoneVerifications).set(payload).where(eq(phoneVerifications.id, existing.id));
    const rows = await db.select().from(phoneVerifications).where(eq(phoneVerifications.id, existing.id)).limit(1);
    return rows[0]!;
  }
  const result = await db.insert(phoneVerifications).values(payload);
  const insertId = (result as { insertId?: number }).insertId ?? (result as unknown[])[0];
  const rows = await db.select().from(phoneVerifications).where(eq(phoneVerifications.id, Number(insertId))).limit(1);
  return rows[0]!;
}

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(data);
  const insertId = (result as { insertId?: number }).insertId ?? (result as unknown[])[0];
  const rows = await db.select().from(orders).where(eq(orders.id, Number(insertId))).limit(1);
  return rows[0]!;
}

export async function getOrdersByMerchant(merchantId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.merchantId, merchantId)).orderBy(desc(orders.createdAt)).limit(limit);
}

export async function updateOrder(id: number, data: Partial<InsertOrder>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set(data).where(eq(orders.id, id));
}

export async function getAllPlugins() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(plugins).where(eq(plugins.status, "active"));
}

export async function getMerchantPlugins(merchantId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(merchantPlugins).where(eq(merchantPlugins.merchantId, merchantId));
}

export async function installPlugin(merchantId: number, pluginId: number, config?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(merchantPlugins).values({ merchantId, pluginId, config: config ?? null });
}

export async function createSession(data: InsertSession): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(sessions).values(data);
}

export async function getSessionBySessionId(sessionId: string): Promise<{ userId: number } | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select({ userId: sessions.userId })
    .from(sessions)
    .where(and(eq(sessions.sessionId, sessionId), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
}

export async function deleteSessionBySessionId(sessionId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(sessions).where(eq(sessions.sessionId, sessionId));
}
