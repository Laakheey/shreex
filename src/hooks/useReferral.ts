import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "../components/providers/SupabaseProvider";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL;

export type DownlineUser = {
  id: string;
  level: number;
  username?: string;
  total_invested: number;
  active_invested: number;
  children: DownlineUser[];
};

export type ReferralBonuses = {
  one_time_total: number;
  ongoing_total: number;
  grand_total: number;
};

export function useReferral() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const supabase = useSupabase();
  const [myReferralCode, setMyReferralCode] = useState<string>("");
  const [downline, setDownline] = useState<DownlineUser | null>(null);
  const [bonuses, setBonuses] = useState<ReferralBonuses>({
    one_time_total: 0,
    ongoing_total: 0,
    grand_total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hasReferrer, setHasReferrer] = useState(false);
  
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    async function fetchData() {
      if (!user || !supabase) return;

      try {
        setLoading(true);

        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("referrer_id, referral_code")
          .eq("id", user.id)
          .single();

        if (!isMountedRef.current) return;

        if (userError) {
          console.error("Error fetching user data:", userError);
          setLoading(false);
          return;
        }

        setMyReferralCode(userData?.referral_code || user.id);
        if (userData?.referrer_id) setHasReferrer(true);

        const { data: treeData, error: treeError } = await supabase.rpc("get_downline_tree_v2", {
          root_user_id: user.id,
        });
        
        if (!isMountedRef.current) return;

        if (treeError) {
          console.error("Error fetching tree:", treeError);
        } else {
          setDownline(treeData || null);
        }

        const { data: bonusData, error: bonusError } = await supabase
          .from("referral_bonuses")
          .select("amount, bonus_type")
          .eq("referrer_id", user.id);

        if (!isMountedRef.current) return;

        if (bonusError) {
          console.error("Error fetching bonuses:", bonusError);
        } else if (bonusData) {
          const oneTime = bonusData
            .filter((b: any) => b.bonus_type === "first_investment")
            .reduce((sum: any, b: any) => sum + Number(b.amount), 0);
          const ongoing = bonusData
            .filter((b: any) => b.bonus_type === "ongoing")
            .reduce((sum: any, b: any) => sum + Number(b.amount), 0);
          
          setBonuses({
            one_time_total: oneTime,
            ongoing_total: ongoing,
            grand_total: oneTime + ongoing,
          });
        }
      } catch (error) {
        console.error("Unexpected error in fetchData:", error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, [user, supabase]);

  const applyReferralCode = async (code: string) => {
    if (!user) return false;

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

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { duration: 4000 });
        setHasReferrer(true);
        
        window.location.reload();
        return true;
      } else {
        toast.error(data.error);
        return false;
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
      return false;
    }
  };

  return { myReferralCode, downline, bonuses, loading, applyReferralCode, hasReferrer };
}