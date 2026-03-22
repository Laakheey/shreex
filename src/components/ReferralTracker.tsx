// utils/referralTracker.tsx
'use client';

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      localStorage.setItem("pending_referral_code", refCode);
    }
  }, [searchParams]);

  return null;
}
