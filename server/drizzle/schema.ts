import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull().unique(),
  userId: int("userId").notNull().references(() => users.id),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const merchants = mysqlTable("merchants", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }).default("Tunisia"),
  apiKey: varchar("apiKey", { length: 255 }).notNull().unique(),
  rtoRate: int("rtoRate").default(0),
  totalOrders: int("totalOrders").default(0),
  successfulOrders: int("successfulOrders").default(0),
  status: mysqlEnum("status", ["active", "inactive", "suspended"]).default(
    "active"
  ),
  subscriptionPlan: mysqlEnum("subscriptionPlan", [
    "starter",
    "growth",
    "enterprise",
  ]).default("starter"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Merchant = typeof merchants.$inferSelect;
export type InsertMerchant = typeof merchants.$inferInsert;

export const phoneVerifications = mysqlTable("phoneVerifications", {
  id: int("id").autoincrement().primaryKey(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  otp: varchar("otp", { length: 6 }),
  isVerified: int("isVerified").default(0),
  trustScore: int("trustScore").default(50),
  rtoCount: int("rtoCount").default(0),
  successfulOrders: int("successfulOrders").default(0),
  lastVerifiedAt: timestamp("lastVerifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PhoneVerification = typeof phoneVerifications.$inferSelect;
export type InsertPhoneVerification = typeof phoneVerifications.$inferInsert;

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  merchantId: int("merchantId").notNull().references(() => merchants.id),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  orderAmount: int("orderAmount").notNull(),
  trustScore: int("trustScore").default(50),
  verificationStatus: mysqlEnum("verificationStatus", [
    "pending",
    "verified",
    "failed",
    "rejected",
  ]).default("pending"),
  orderStatus: mysqlEnum("orderStatus", [
    "placed",
    "shipped",
    "delivered",
    "returned",
    "cancelled",
  ]).default("placed"),
  requiresVerification: int("requiresVerification").default(0),
  verificationMethod: mysqlEnum("verificationMethod", [
    "sms",
    "ivr",
    "email",
    "none",
  ]).default("none"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const plugins = mysqlTable("plugins", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["shopify", "woocommerce", "custom", "api"]).notNull(),
  version: varchar("version", { length: 20 }).default("1.0.0"),
  status: mysqlEnum("status", ["active", "inactive", "deprecated"]).default(
    "active"
  ),
  downloadUrl: varchar("downloadUrl", { length: 500 }),
  documentationUrl: varchar("documentationUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Plugin = typeof plugins.$inferSelect;
export type InsertPlugin = typeof plugins.$inferInsert;

export const merchantPlugins = mysqlTable("merchantPlugins", {
  id: int("id").autoincrement().primaryKey(),
  merchantId: int("merchantId").notNull().references(() => merchants.id),
  pluginId: int("pluginId").notNull().references(() => plugins.id),
  isActive: int("isActive").default(1),
  config: text("config"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MerchantPlugin = typeof merchantPlugins.$inferSelect;
export type InsertMerchantPlugin = typeof merchantPlugins.$inferInsert;
