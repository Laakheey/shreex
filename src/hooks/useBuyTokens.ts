import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabase } from '../components/providers/SupabaseProvider';

export function useBuyTokens() {
  const { user } = useUser();
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabase();

  const startPurchase = (usdtAmount: string) => {
    if (!usdtAmount || parseFloat(usdtAmount) <= 0) return;
    setAmount(usdtAmount);
    setShowDetails(true);
  };

  const submitPurchase = async () => {
    if (!user || !amount || !file) return;

    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('token_requests')
        .insert({
          user_id: user.id,
          amount_usdt: parseFloat(amount),
          screenshot_url: publicUrl,
          status: 'pending',
        });

      if (dbError) throw dbError;

      setPending(true);
      setShowDetails(false);
      setAmount('');
      setFile(null);
      alert('Payment proof submitted! Admin will review and credit tokens soon.');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAmount('');
    setFile(null);
    setShowDetails(false);
    setPending(false);
  };

  return {
    amount,
    setAmount,
    file,
    setFile,
    showDetails,
    pending,
    loading,
    startPurchase,
    submitPurchase,
    reset,
  };
}