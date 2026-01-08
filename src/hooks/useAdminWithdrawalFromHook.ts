// hooks/useAdminWithdrawals.ts

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { supabase } from "../utils/supabase";
import { useAdmin } from "./useAdmin";

interface Withdrawal {
  id: number;
  user_id: string;
  amount: number;
  wallet_address: string | null;
  phone_number: string | null;
  status: string;
  tx_hash: string | null;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

export const useAdminWithdrawals = () => {
  const { loading: adminLoading, error: adminError } = useAdmin();

  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchWithdrawals = useCallback(async () => {
    try {
      const { data: rawWithdrawals, error } = await supabase
        .from("withdrawals")
        .select(
          "id, user_id, amount, wallet_address, phone_number, status, tx_hash, created_at, updated_at"
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!rawWithdrawals || rawWithdrawals.length === 0) {
        setWithdrawals([]);
        return;
      }

      const userIds = [
        ...new Set(rawWithdrawals.map((w: Withdrawal) => w.user_id)),
      ];

      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, first_name, last_name")
        .in("id", userIds);

      if (usersError) throw usersError;

      const userMap = new Map<string, User>();
      users?.forEach((user) => {
        userMap.set(user.id, user);
      });

      const enriched = rawWithdrawals.map((w: Withdrawal) => {
        const user = userMap.get(w.user_id);

        const fullName = user
          ? [user.first_name, user.last_name].filter(Boolean).join(" ").trim()
          : "";

        return {
          ...w,
          user_name: fullName || "Unknown User",
          user_email: user?.email || "N/A",
          withdrawal_method: w.wallet_address ? "Tron Wallet" : "Mobile Money",
        };
      });

      setWithdrawals(enriched);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
      toast.error("Failed to load withdrawals");
    }
  }, []);

  // Fetch active payout wallets
  const fetchWallets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("payout_wallets")
        .select("id, name, address, balance, is_active")
        .eq("is_active", true);

      if (error) throw error;
      setWallets(data || []);
    } catch (err) {
      console.error("Failed to fetch wallets:", err);
      toast.error("Failed to load payout wallets");
    }
  }, []);

  // Full data refresh
  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchWithdrawals(), fetchWallets()]);
    setLoading(false);
  }, [fetchWithdrawals, fetchWallets]);

  // Process single withdrawal
  const processWithdrawal = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    if (status === "approved" && !selectedWallet) {
      toast.error("Please select a payout wallet first");
      return;
    }

    try {
      const { data: withdrawal } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("id", id)
        .eq("status", "pending")
        .single();

      if (!withdrawal) {
        toast.error("Withdrawal not found or already processed");
        return;
      }

      const isPhoneWithdrawal = !!withdrawal.phone_number;

      if (status === "rejected") {
        // Refund tokens
        const { data: user } = await supabase
          .from("users")
          .select("token_balance")
          .eq("id", withdrawal.user_id)
          .single();

        if (user) {
          await supabase
            .from("users")
            .update({
              token_balance: Number(user.token_balance) + withdrawal.amount,
            })
            .eq("id", withdrawal.user_id);
        }

        await supabase
          .from("withdrawals")
          .update({ status: "rejected", updated_at: new Date().toISOString() })
          .eq("id", id);

        toast.success("Withdrawal rejected & tokens refunded");
      } else if (isPhoneWithdrawal) {
        // Mobile money – just mark as sent
        await supabase
          .from("withdrawals")
          .update({ status: "sent", updated_at: new Date().toISOString() })
          .eq("id", id);

        toast.success(`Marked as sent to ${withdrawal.phone_number}`);
      } else {
        // Tron withdrawal – SIMULATED (NEVER do real crypto in frontend!)
        // In real app: this must be done securely on backend
        const txHash = `SIMULATED_TX_${Date.now()}`; // ← Replace with real backend call in production

        await supabase
          .from("withdrawals")
          .update({
            status: "sent",
            tx_hash: txHash,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        toast.success(`USDT sent! Tx: ${txHash.substring(0, 12)}...`);
      }

      await fetchData(); // Refresh list
      setSelectedIds([]);
    } catch (err) {
      console.error("Process error:", err);
      toast.error("Failed to process withdrawal");
    }
  };

  // Bulk actions
  const bulkApprove = async (status: "approved" | "rejected") => {
    if (status === "approved" && !selectedWallet) {
      toast.error("Select a payout wallet first");
      return;
    }
    if (selectedIds.length === 0) {
      toast.error("No withdrawals selected");
      return;
    }

    toast.loading(`Processing ${selectedIds.length} withdrawals...`);

    for (const id of selectedIds) {
      await processWithdrawal(id, status);
    }

    toast.dismiss();
    toast.success(`Bulk ${status} completed`);
  };

  // Selection helpers
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const pendingIds = withdrawals
      .filter((w) => w.status === "pending")
      .map((w) => w.id);

    if (selectedIds.length === pendingIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingIds);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
    // Optional: auto-refresh every 30 seconds
    // const interval = setInterval(fetchData, 30000);
    // return () => clearInterval(interval);
  }, [fetchData]);

  return {
    withdrawals,
    wallets,
    loading: loading || adminLoading,
    error: adminError,
    selectedWallet,
    setSelectedWallet,
    processWithdrawal,
    bulkApprove,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    fetchData,
  };
};
