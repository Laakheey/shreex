import { useSupabase } from "../components/providers/SupabaseProvider";

type TransactionType = 'credit' | 'debit';

interface LogTransactionParams {
  userId: string;
  amount: number;                    // Always positive
  type: TransactionType;
  description: string;
  referenceId?: string;
  referenceType?: string;
}

export async function logTransaction({
  userId,
  amount,
  type,
  description,
  referenceId,
  referenceType,
}: LogTransactionParams) {
  const supabase = useSupabase();

  if (!supabase) return;

  const { error } = await supabase.from('transactions').insert({
    user_id: userId,
    amount: type === 'credit' ? amount : -amount, // optional: store signed
    type,
    description,
    reference_id: referenceId,
    reference_type: referenceType,
  });

  if (error) {
    console.error('Failed to log transaction:', error);
  }
}