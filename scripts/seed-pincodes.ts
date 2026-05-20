import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pincodes } from "../lib/db/schema";

const PINCODES = [
  // Mumbai
  { pincode: "400001", areaName: "Fort", city: "Mumbai", state: "Maharashtra", homeCollectionAvailable: true },
  { pincode: "400051", areaName: "Bandra West", city: "Mumbai", state: "Maharashtra", homeCollectionAvailable: true },
  { pincode: "400053", areaName: "Andheri West", city: "Mumbai", state: "Maharashtra", homeCollectionAvailable: true },
  { pincode: "400069", areaName: "Powai", city: "Mumbai", state: "Maharashtra", homeCollectionAvailable: true },
  { pincode: "400076", areaName: "Chembur", city: "Mumbai", state: "Maharashtra", homeCollectionAvailable: false },
  // Delhi
  { pincode: "110001", areaName: "Connaught Place", city: "New Delhi", state: "Delhi", homeCollectionAvailable: true },
  { pincode: "110016", areaName: "Hauz Khas", city: "New Delhi", state: "Delhi", homeCollectionAvailable: true },
  { pincode: "110025", areaName: "Lajpat Nagar", city: "New Delhi", state: "Delhi", homeCollectionAvailable: true },
  { pincode: "110017", areaName: "Malviya Nagar", city: "New Delhi", state: "Delhi", homeCollectionAvailable: true },
  { pincode: "110092", areaName: "Preet Vihar", city: "New Delhi", state: "Delhi", homeCollectionAvailable: false },
  // Bengaluru
  { pincode: "560001", areaName: "MG Road", city: "Bengaluru", state: "Karnataka", homeCollectionAvailable: true },
  { pincode: "560034", areaName: "Jayanagar", city: "Bengaluru", state: "Karnataka", homeCollectionAvailable: true },
  { pincode: "560037", areaName: "HSR Layout", city: "Bengaluru", state: "Karnataka", homeCollectionAvailable: true },
  { pincode: "560066", areaName: "Whitefield", city: "Bengaluru", state: "Karnataka", homeCollectionAvailable: true },
  { pincode: "560068", areaName: "Marathahalli", city: "Bengaluru", state: "Karnataka", homeCollectionAvailable: false },
  // Hyderabad
  { pincode: "500001", areaName: "Hyderabad Old City", city: "Hyderabad", state: "Telangana", homeCollectionAvailable: true },
  { pincode: "500032", areaName: "Banjara Hills", city: "Hyderabad", state: "Telangana", homeCollectionAvailable: true },
  { pincode: "500081", areaName: "Gachibowli", city: "Hyderabad", state: "Telangana", homeCollectionAvailable: true },
  // Chennai
  { pincode: "600001", areaName: "Chennai Egmore", city: "Chennai", state: "Tamil Nadu", homeCollectionAvailable: true },
  { pincode: "600020", areaName: "T. Nagar", city: "Chennai", state: "Tamil Nadu", homeCollectionAvailable: true },
  { pincode: "600041", areaName: "Adyar", city: "Chennai", state: "Tamil Nadu", homeCollectionAvailable: true },
  // Pune
  { pincode: "411001", areaName: "Pune Camp", city: "Pune", state: "Maharashtra", homeCollectionAvailable: true },
  { pincode: "411004", areaName: "Deccan Gymkhana", city: "Pune", state: "Maharashtra", homeCollectionAvailable: true },
  { pincode: "411045", areaName: "Hinjewadi", city: "Pune", state: "Maharashtra", homeCollectionAvailable: false },
  // Kolkata
  { pincode: "700001", areaName: "BBD Bagh", city: "Kolkata", state: "West Bengal", homeCollectionAvailable: true },
  { pincode: "700019", areaName: "Ballygunge", city: "Kolkata", state: "West Bengal", homeCollectionAvailable: true },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");

  const db = drizzle(neon(url));

  let inserted = 0;
  let skipped = 0;

  for (const p of PINCODES) {
    try {
      await db.insert(pincodes).values({ ...p, isActive: true }).onConflictDoNothing();
      inserted++;
    } catch {
      skipped++;
    }
  }

  console.log(`Done. ${inserted} inserted, ${skipped} skipped.`);
}

main().catch(console.error);
