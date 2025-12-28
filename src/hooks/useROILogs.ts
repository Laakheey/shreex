import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "../components/providers/SupabaseProvider";

export function useUserFinanceData() {
  const { user } = useUser();
  const supabase = useSupabase();
  const [rewards, setRewards] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    monthly: 0,
    halfYearly: 0,
    yearly: 0,
    currentMonthEarning: 0,
  });

  useEffect(() => {
    async function fetchData() {
      if (!user?.id || !supabase) return;
      setLoading(true);

      const { data: summaryData } = await supabase
        .from("user_earning_summaries")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const { data: monthlyData, error: monthlyError } = await supabase
        .from("user_monthly_performance")
        .select("*")
        .eq("user_id", user.id)
        .order("month_year", { ascending: false })
        .limit(100);

      const { data: payoutData } = await supabase
        .from("interest_payouts")
        .select(`id, amount_added, created_at, investments!inner(plan_type, initial_amount, user_id)`)
        .eq("investments.user_id", user.id)
        .order("created_at", { ascending: false });

      const { data: withdrawalData } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (summaryData) {
        setStats(prev => ({
          ...prev,
          total: Number(summaryData.total_lifetime_roi),
          monthly: Number(summaryData.total_monthly_roi),
          halfYearly: Number(summaryData.total_half_yearly_roi),
          yearly: Number(summaryData.total_yearly_roi),
        }));
      }
      console.log(monthlyError);

      if (monthlyData) {
        setMonthlyStats(monthlyData);
        const now = new Date();
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const currentMonth = monthlyData.find((m: any) => m.month_year === currentMonthStr);
        if (currentMonth) {
          setStats(prev => ({ ...prev, currentMonthEarning: Number(currentMonth.monthly_roi) }));
        }
      }

      if (payoutData) setRewards(payoutData);
      if (withdrawalData) setWithdrawals(withdrawalData);

      setLoading(false);
    }

    fetchData();
  }, [user?.id, supabase]);

  return { rewards, withdrawals, monthlyStats, stats, loading };
}