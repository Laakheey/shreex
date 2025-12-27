// hooks/useUserHistory.ts

import { useState, useEffect } from "react";
import { useSupabase } from "../components/providers/SupabaseProvider";
import toast from "react-hot-toast";

export type HistoryFilter = "all" | "token_purchases" | "investments";

export interface HistoryItem {
  id: string | number;
  type: string;
  amount: number;
  status?: string | null;
  description?: string | null;
  tx_hash?: string | null;
  plan_type?: string | null;
  created_at: string;
  source: "token_request" | "transaction" | "investment";
}

export const useUserHistory = (userId: string | null) => {
  const supabase = useSupabase();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [searchHash, setSearchHash] = useState("");

  const fetchHistory = async () => {
    if (!supabase || !userId) return;

    setLoading(true);

    try {
      let allItems: HistoryItem[] = [];

      // Token purchases (token_requests)
      const { data: purchases } = await supabase
        .from("token_requests")
        .select("*")
        .eq("user_id", userId);

      allItems = allItems.concat(
        (purchases || []).map((p: any) => ({
          id: p.id,
          type: "token_purchase",
          amount: Number(p.amount_usdt),
          status: p.status,
          description: p.status === "conflicted" ? `Mismatch: detected ${p.detected_amount}` : null,
          tx_hash: p.tx_hash,
          created_at: p.created_at,
          source: "token_request" as const,
        }))
      );

      // General transactions
      const { data: txs } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId);

      allItems = allItems.concat(
        (txs || []).map((t: any) => ({
          id: t.id,
          type: t.type || "unknown",
          amount: t.amount,
          description: t.description,
          tx_hash: t.reference_id,
          created_at: t.created_at,
          source: "transaction" as const,
        }))
      );

      // Investments
      const { data: invs } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", userId);

      allItems = allItems.concat(
        (invs || []).map((i: any) => ({
          id: i.id,
          type: "investment",
          amount: Number(i.amount_tokens || i.initial_amount || 0),
          description: i.plan_type ? `Plan: ${i.plan_type}` : null,
          status: i.status,
          plan_type: i.plan_type,
          created_at: i.created_at || i.start_date || new Date().toISOString(),
          source: "investment" as const,
        }))
      );

      // Sort by date descending
      allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Apply filter
      let filtered = allItems;
      if (filter === "token_purchases") {
        filtered = allItems.filter((i) => i.source === "token_request");
      } else if (filter === "investments") {
        filtered = allItems.filter((i) => i.source === "investment");
      }

      // Search by tx_hash
      if (searchHash) {
        filtered = filtered.filter((i) =>
          i.tx_hash?.toLowerCase().includes(searchHash.toLowerCase())
        );
      }

      setItems(filtered);
    } catch (err) {
      toast.error("Failed to load history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchHistory();
  }, [userId, filter, searchHash]);

  return {
    items,
    loading,
    filter,
    setFilter,
    searchHash,
    setSearchHash,
    refetch: fetchHistory,
  };
};