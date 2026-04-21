import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cache for employee data fetched from Google Sheets
 * Stores aggregated employee hours with TTL for performance
 */
export const employeeDataCache = mysqlTable("employeeDataCache", {
  id: int("id").autoincrement().primaryKey(),
  // Composite key: employee name + source identifier
  employeeName: varchar("employeeName", { length: 255 }).notNull(),
  // Aggregated total hours for April
  totalHours: int("totalHours").notNull(),
  // JSON string containing source breakdown
  sourceBreakdown: text("sourceBreakdown").notNull(),
  // Timestamp when this cache entry was created
  cachedAt: timestamp("cachedAt").defaultNow().notNull(),
  // Timestamp when this cache entry expires
  expiresAt: timestamp("expiresAt").notNull(),
});

export type EmployeeDataCache = typeof employeeDataCache.$inferSelect;
export type InsertEmployeeDataCache = typeof employeeDataCache.$inferInsert;
