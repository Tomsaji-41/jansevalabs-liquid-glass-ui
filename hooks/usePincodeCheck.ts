"use client";

import { useState, useCallback } from "react";

interface PincodeResult {
  available: boolean;
  homeCollection: boolean;
  areaName?: string;
  city?: string;
}

export function usePincodeCheck() {
  const [result, setResult] = useState<PincodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async (pincode: string) => {
    if (pincode.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pincodes/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Failed to check pincode. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, check };
}
