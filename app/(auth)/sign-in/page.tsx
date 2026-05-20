"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.ok) {
      toast.success("Signed in successfully");
      const session = await fetch("/api/auth/session").then((r) => r.json());
      const role = session?.user?.role;
      router.push(role === "admin" ? "/admin/dashboard" : "/patient/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-border shadow-card-hover p-7">
        <h1 className="text-2xl font-bold text-[#0B1F4E] mb-1">Welcome back</h1>
        <p className="text-slate-500 text-sm mb-6">Sign in to view your reports and appointments.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white h-11 font-semibold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          New patient?{" "}
          <Link href="/sign-up" className="text-[#0D9488] hover:underline font-medium">
            Create an account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate-500">
          <Link href="/results" className="text-[#0D9488] hover:underline">
            Quick result view (no login)
          </Link>
        </p>
      </div>
    </div>
  );
}
