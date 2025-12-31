import { useUser, useAuth } from "@clerk/clerk-react";
import { useSupabase } from "../components/providers/SupabaseProvider";
import { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useReferral() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const supabase = useSupabase();
  const [myReferralCode, setMyReferralCode] = useState<string>("");
  const [downline, setDownline] = useState<any>(null);
  const [bonuses, setBonuses] = useState({
    one_time_total: 0,
    ongoing_total: 0,
    grand_total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hasReferrer, setHasReferrer] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    async function fetchData() {
      if (!user || !supabase) return;
      try {
        setLoading(true);

        const { data: userData } = await supabase
          .from("users")
          .select("referrer_id, referral_code")
          .eq("id", user.id)
          .single();
        
        if (userData) {
          setMyReferralCode(userData.referral_code || user.id);
          if (userData.referrer_id) setHasReferrer(true);
        }

        const { count } = await supabase
          .from("investments")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        
        setIsEligible((count ?? 0) > 0);

        const { data: treeData } = await supabase.rpc("get_downline_tree_v2", {
          root_user_id: user.id,
        });
        setDownline(treeData);

        const { data: bonusData } = await supabase
          .from("referral_bonuses")
          .select("amount, bonus_type")
          .eq("referrer_id", user.id);

        if (bonusData) {
          const oneTime = bonusData
            .filter((b: any) => b.bonus_type === "first_investment")
            .reduce((s: any, b: any) => s + Number(b.amount), 0);
          const ongoing = bonusData
            .filter((b: any) => b.bonus_type === "ongoing")
            .reduce((s: any, b: any) => s + Number(b.amount), 0);
          
          setBonuses({
            one_time_total: oneTime,
            ongoing_total: ongoing,
            grand_total: oneTime + ongoing,
          });
        }
      } catch (err) {
        console.error("Referral Sync Error:", err);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    }
    fetchData();
    return () => { isMountedRef.current = false; };
  }, [user, supabase]);

  const applyReferralCode = async (code: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/referral/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ referralCode: code }),
      });
      if (res.ok) {
        setHasReferrer(true);
        return true;
      }
    } catch (error) {
      console.error("Failed to apply code", error);
    }
    return false;
  };

  return {
    myReferralCode,
    downline,
    bonuses,
    loading,
    applyReferralCode,
    hasReferrer,
    isEligible,
  };
}