import { useState, useEffect } from "react";
import { useSupabase } from "../components/providers/SupabaseProvider";
import toast from "react-hot-toast";

interface Transaction {
  id: number;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  reference_type: string | null;
  status: string | null;
  tx_hash: string | null;
  created_at: string;
}

export const useUserTransactions = (userId: string | null) => {
  const supabase = useSupabase();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHash, setSearchHash] = useState("");

  const fetchTransactions = async () => {
    if (!supabase || !userId) return;

    setLoading(true);

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (searchHash) {
      query = query.ilike("tx_hash", `%${searchHash}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to load history");
      console.error(error);
    } else {
      setTransactions(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchTransactions();
  }, [userId, searchHash]);

  return {
    transactions,
    loading,
    searchHash,
    setSearchHash,
    refetch: fetchTransactions,
  };
};