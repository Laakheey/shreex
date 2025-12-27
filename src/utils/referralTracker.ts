// utils/referralTracker.ts
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function ReferralTracker() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      localStorage.setItem("pending_referral_code", refCode);
    }
  }, [searchParams]);

  return null;
}