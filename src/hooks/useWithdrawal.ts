import { useState } from "react";
import { useSupabase } from "../components/providers/SupabaseProvider";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export function useWithdrawal(onSuccess: () => Promise<void>) {
  const { user } = useUser();
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);

  const executeWithdrawal = async (investment: any, amountStr: string) => {
    const amount = parseFloat(amountStr);

    if (!investment || !supabase || !user) {
      toast.error("Missing investment data or session");
      return false;
    }

    if (isNaN(amount) || amount <= 0 || amount > investment.amount_tokens) {
      toast.error("Please enter a valid amount");
      return false;
    }

    setLoading(true);

    try {
      // 1. Fetch latest user balance (fresh from DB)
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("token_balance")
        .eq("id", user.id)
        .single();

      if (fetchError) throw fetchError;

      const newBalance = (userData?.token_balance || 0) + amount;

      // 2. Update user balance
      const { error: balError } = await supabase
        .from("users")
        .update({ token_balance: newBalance })
        .eq("id", user.id);

      if (balError) throw balError;

      // 3. Mark current investment as inactive
      const { error: deactivateError } = await supabase
        .from("investments")
        .update({ status: "inactive" })
        .eq("id", investment.id)
        .eq("user_id", user.id);

      if (deactivateError) throw deactivateError;

      // 4. If partial withdrawal → create new active investment for remaining amount
      if (amount < investment.amount_tokens) {
        const remaining = investment.amount_tokens - amount;

        const { error: insertError } = await supabase
          .from("investments")
          .insert({
            user_id: user.id,
            plan_type: investment.plan_type,
            amount_tokens: remaining,
            start_date: investment.start_date,
            status: "active",
          });

        if (insertError) throw insertError;
      }

      // 5. Log transaction correctly for admin panel
      const { error: txError } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: "withdrawal",                    // Must match allowed value
        amount: amount,
        plan_type: investment.plan_type,
        investment_id: investment.id,
        description: `Withdrew ${amount.toLocaleString()} tokens from ${investment.plan_type} investment`,
        reference_id: null,
      });

      if (txError) {
        console.error("Failed to log withdrawal transaction:", txError);
        // Don't fail the withdrawal if logging fails
      }

      toast.success(`Successfully withdrew ${amount.toLocaleString()} tokens!`);
      await onSuccess();
      return true;
    } catch (err: any) {
      console.error("Withdrawal error:", err);
      toast.error(err.message || "Transaction failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { executeWithdrawal, loading };
}