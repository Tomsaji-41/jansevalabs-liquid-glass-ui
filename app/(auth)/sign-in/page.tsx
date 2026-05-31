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
      <div 
        className="rounded-2xl p-7"
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
          WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          borderTop: "1px solid rgba(255, 255, 255, 0.45)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <h1 className="text-2xl font-bold mb-1" style={{ color: "rgba(255,255,255,0.95)" }}>Welcome back</h1>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>Sign in to view your reports and appointments.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" style={{ color: "rgba(255,255,255,0.9)" }}>Email</Label>
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
            <Label htmlFor="password" style={{ color: "rgba(255,255,255,0.9)" }}>Password</Label>
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
            className="w-full font-semibold"
            style={{
              background: "rgba(29,158,117,0.55)",
              border: "1px solid rgba(255,255,255,0.30)",
              borderTop: "1px solid rgba(255,255,255,0.50)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.2)",
              borderRadius: "14px",
              color: "rgba(255,255,255,0.95)",
              minHeight: "52px",
              fontSize: "16px"
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          New patient?{" "}
          <Link href="/sign-up" className="hover:underline font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>
            Create an account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          <Link href="/results" className="hover:underline" style={{ color: "rgba(255,255,255,0.9)" }}>
            Quick result view (no login)
          </Link>
        </p>
      </div>
    </div>
  );
}
