import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useSupabase } from '../components/providers/SupabaseProvider';

export function useInvest() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const supabase = useSupabase();

  const invest = async (
    amount: number,
    plan: "monthly" | "half-yearly" | "yearly", // Updated type union
    currentBalance: number,
    mutate: () => Promise<void>,
    onSuccess?: () => Promise<void>
  ) => {
    if (!user || !supabase) return false;
    setLoading(true);

    let investmentId: number | null = null;

    try {
      // 1. Create investment and retrieve its ID
      const { data: invData, error: invError } = await supabase
        .from('investments')
        .insert({
          user_id: user.id,
          amount_tokens: amount,
          initial_amount: amount,
          plan_type: plan,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
        })
        .select('id')
        .single();

      if (invError) throw invError;
      investmentId = invData.id;

      // 2. Deduct from user balance
      const newBalance = currentBalance - amount;
      const { error: balError } = await supabase
        .from('users')
        .update({ token_balance: newBalance })
        .eq('id', user.id);

      if (balError) throw balError;

      // 3. Log transaction
      // Dynamic description based on the new plans
      const planLabel = 
        plan === 'monthly' ? 'Monthly' : 
        plan === 'half-yearly' ? '6-Month' : 'Yearly';

      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'investment_deposit',
        amount: amount,
        plan_type: plan,
        investment_id: investmentId,
        description: `Invested ${amount.toLocaleString()} tokens in ${planLabel} plan`,
        reference_id: null,
      });

      if (txError) console.error('Failed to log transaction:', txError);

      // 4. Refresh UI
      await mutate();
      if (onSuccess) await onSuccess();

      // 5. Dynamic Success Message
      let successMsg = "";
      if (plan === 'monthly') {
        successMsg = `${amount.toLocaleString()} tokens invested! 10% monthly rewards started.`;
      } else if (plan === 'half-yearly') {
        successMsg = `${amount.toLocaleString()} tokens locked! 1.75x return in 6 months.`;
      } else {
        successMsg = `${amount.toLocaleString()} tokens locked! 3x return in 1 year.`;
      }

      toast.success(successMsg);
      return true;
    } catch (error: any) {
      console.error('Investment error:', error);
      toast.error('Investment failed: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { invest, loading };
}