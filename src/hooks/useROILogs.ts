// // hooks/useUserFinanceData.ts (or useROILogs.ts)
// import { useEffect, useState } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { useSupabase } from "../components/providers/SupabaseProvider";

// // Define a clean, frontend-friendly type
// interface RewardItem {
//   id: number;
//   date: string; // formatted date
//   planType: string;
//   planBadgeClass: string; // ready-to-use Tailwind class
//   description: string; // computed, human-readable
//   profit: number; // amount_tokens - initial_amount
//   profitFormatted: string; // "1,234" ready for display
//   initialAmount: number;
// }

// export function useUserFinanceData() {
//   const { user } = useUser();
//   const supabase = useSupabase();
//   const [earnings, setEarnings] = useState<any>(null);

//   const [rewards, setRewards] = useState<RewardItem[]>([]);
//   const [withdrawals, setWithdrawals] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     total: 0,
//     monthly: 0,
//     yearly: 0,
//     halfYearly: 0,
//   });

//   useEffect(() => {
//     async function fetchData() {
//       if (!user?.id || !supabase) return;
//       setLoading(true);

//       const { data: rewardData, error: rewardError } = await supabase
//         .from("investments")
//         .select("*")
//         .eq("user_id", user.id)
//         .eq("status", "active")
//         .order("created_at", { ascending: false });

//       const { data: withdrawalData, error: withdrawalError } = await supabase
//         .from("withdrawals")
//         .select("*")
//         .eq("user_id", user.id)
//         .order("created_at", { ascending: false });

//       if (rewardError) console.error("Error fetching rewards:", rewardError);
//       if (withdrawalError)
//         console.error("Error fetching withdrawals:", withdrawalError);

//       if (rewardData) {
//         const formattedRewards = rewardData.map((r: any) => {
//           const initial = Number(r.initial_amount);
//           const tokens = Number(r.amount_tokens);
//           const profit = tokens - initial;

//           let description = "Investment recorded";
//           switch (r.plan_type) {
//             case "monthly":
//               description = `Monthly interest on ${initial.toLocaleString()} USDT investment`;
//               break;
//             case "half-yearly":
//               description = `6-Month plan interest on ${initial.toLocaleString()} USDT investment`;
//               break;
//             case "yearly":
//               description = `Yearly ROI reward on ${initial.toLocaleString()} USDT investment`;
//               break;
//           }

//           return {
//             id: r.id,
//             date: new Date(r.created_at).toLocaleDateString(),
//             planType: r.plan_type || "N/A",
//             planBadgeClass: getPlanBadge(r.plan_type),
//             description,
//             profit,
//             profitFormatted: profit.toLocaleString(),
//             initialAmount: initial,
//           } as RewardItem;
//         });

//         setRewards(formattedRewards);
//         if (withdrawalData) {
//           setWithdrawals(withdrawalData);
//         }

//         const totals = formattedRewards.reduce(
//           (acc: any, curr: any) => {
//             acc.total += curr.profit;
//             if (curr.planType === "monthly") acc.monthly += curr.profit;
//             if (curr.planType === "half-yearly") acc.halfYearly += curr.profit;
//             if (curr.planType === "yearly") acc.yearly += curr.profit;
//             return acc;
//           },
//           { total: 0, monthly: 0, yearly: 0, halfYearly: 0 }
//         );

//         setStats(totals);
//       }

//       setLoading(false);
//     }

//     fetchData();
//   }, [user?.id, supabase]);

//   return { rewards, withdrawals, stats, loading };
// }

// function getPlanBadge(type: string): string {
//   switch (type) {
//     case "monthly":
//       return "bg-green-100 text-green-700";
//     case "half-yearly":
//       return "bg-purple-100 text-purple-700";
//     case "yearly":
//       return "bg-indigo-100 text-indigo-700";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// }

import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "../components/providers/SupabaseProvider";

interface RewardItem {
  id: number;
  date: string;
  planType: string;
  planBadgeClass: string;
  description: string;
  amount: number;
  amountFormatted: string;
}

export function useUserFinanceData() {
  const { user } = useUser();
  const supabase = useSupabase();
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    monthly: 0,
    yearly: 0,
    halfYearly: 0,
  });

  useEffect(() => {
    async function fetchData() {
      if (!user?.id || !supabase) return;
      setLoading(true);

      // 1. Fetch Lifetime Stats from the VIEW
      const { data: summaryData } = await supabase
        .from("user_earning_summaries")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (summaryData) {
        setStats({
          total: Number(summaryData.total_lifetime_roi),
          monthly: Number(summaryData.total_monthly_roi),
          halfYearly: Number(summaryData.total_half_yearly_roi),
          yearly: Number(summaryData.total_yearly_roi),
        });
      }

      const { data: payoutData, error: payoutError } = await supabase
        .from("interest_payouts")
        .select(
          `
            id,
            amount_added,
            created_at,
            investments!inner (
              plan_type,
              initial_amount,
              user_id
            )
          `
        )
        .eq("investments.user_id", user.id)
        .order("created_at", { ascending: false });

      console.log(payoutError);

      if (payoutData) {
        const formatted = payoutData.map((p: any) => ({
          id: p.id,
          date: new Date(p.created_at).toLocaleDateString(),
          planType: p.investments?.plan_type || "N/A",
          planBadgeClass: getPlanBadge(p.investments?.plan_type),
          description: `Daily interest reward on ${Number(
            p.investments?.initial_amount
          ).toLocaleString()} USDT`,
          amount: Number(p.amount_added),
          amountFormatted: Number(p.amount_added).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
        }));
        setRewards(formatted);
      }

      const { data: withdrawalData } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (withdrawalData) setWithdrawals(withdrawalData);

      setLoading(false);
    }

    fetchData();
  }, [user?.id, supabase]);

  return { rewards, withdrawals, stats, loading };
}

function getPlanBadge(type: string): string {
  switch (type) {
    case "monthly":
      return "bg-green-100 text-green-700";
    case "half-yearly":
      return "bg-purple-100 text-purple-700";
    case "yearly":
      return "bg-indigo-100 text-indigo-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
