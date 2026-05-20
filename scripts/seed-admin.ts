import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const EMAIL = "admin@janseva.in";
const PASSWORD = "Admin@1234";
const NAME = "Janseva Admin";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");

  const db = drizzle(neon(url));

  const existing = await db.select().from(users).where(eq(users.email, EMAIL));
  if (existing.length > 0) {
    console.log("Admin already exists:", EMAIL);
    return;
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  await db.insert(users).values({
    name: NAME,
    email: EMAIL,
    passwordHash,
    role: "admin",
  });

  console.log("Admin user created:");
  console.log("  Email:   ", EMAIL);
  console.log("  Password:", PASSWORD);
}

main().catch(console.error);
