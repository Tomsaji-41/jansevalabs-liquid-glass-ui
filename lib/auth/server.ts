import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "admin") {
    redirect("/sign-in");
  }
  return session!;
}

export async function requirePatient() {
  const session = await auth();
  if (!session) redirect("/sign-in");
  return session;
}
