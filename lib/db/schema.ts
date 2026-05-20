import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  date,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 200 }).notNull(),
  role: varchar("role", { length: 20 }).default("patient"),
  mobile: varchar("mobile", { length: 15 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testCategories = pgTable("test_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  icon: varchar("icon", { length: 50 }),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
});

export const pincodes = pgTable("pincodes", {
  id: serial("id").primaryKey(),
  pincode: varchar("pincode", { length: 10 }).unique().notNull(),
  areaName: varchar("area_name", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true),
  homeCollectionAvailable: boolean("home_collection_available").default(true),
});

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  code: varchar("code", { length: 50 }),
  categoryId: integer("category_id").references(() => testCategories.id),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 300 }),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  sampleType: varchar("sample_type", { length: 50 }),
  turnaroundHours: integer("turnaround_hours").default(24),
  preparationInstructions: text("preparation_instructions"),
  isActive: boolean("is_active").default(true),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
  isPopular: boolean("is_popular").default(false),
  isActive: boolean("is_active").default(true),
  testIds: integer("test_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }),
  mobile: varchar("mobile", { length: 15 }).unique().notNull(),
  dob: date("dob"),
  gender: varchar("gender", { length: 20 }),
  addressLine: text("address_line"),
  pincode: varchar("pincode", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collectionSlots = pgTable("collection_slots", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  timeLabel: varchar("time_label", { length: 50 }).notNull(),
  maxBookings: integer("max_bookings").default(10),
  currentBookings: integer("current_bookings").default(0),
  isAvailable: boolean("is_available").default(true),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 20 }).unique().notNull(),
  patientId: integer("patient_id")
    .references(() => patients.id)
    .notNull(),
  items: jsonb("items").notNull(),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").default(0),
  total: integer("total").notNull(),
  // paymentStatus: pending | paid | failed | refunded
  paymentStatus: varchar("payment_status", { length: 30 }).default("pending"),
  razorpayOrderId: varchar("razorpay_order_id", { length: 50 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 50 }),
  collectionMode: varchar("collection_mode", { length: 20 }).notNull(),
  collectionAddress: text("collection_address"),
  collectionPincode: varchar("collection_pincode", { length: 10 }),
  slotId: integer("slot_id").references(() => collectionSlots.id),
  // status: booked | sample_collected | processing | report_ready | cancelled
  status: varchar("status", { length: 30 }).default("booked"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  testId: integer("test_id")
    .references(() => tests.id)
    .notNull(),
  patientId: integer("patient_id")
    .references(() => patients.id)
    .notNull(),
  parameters: jsonb("parameters"),
  reportUrl: varchar("report_url", { length: 500 }),
  status: varchar("status", { length: 20 }).default("pending"),
  collectedAt: timestamp("collected_at"),
  processedAt: timestamp("processed_at"),
  releasedAt: timestamp("released_at"),
});

export type User = typeof users.$inferSelect;
export type Test = typeof tests.$inferSelect;
export type TestCategory = typeof testCategories.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Patient = typeof patients.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Result = typeof results.$inferSelect;
export type Pincode = typeof pincodes.$inferSelect;
export type CollectionSlot = typeof collectionSlots.$inferSelect;
