// hooks/useAdminWithdrawals.ts
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export const useAdminWithdrawals = () => {
  const { getToken } = useAuth();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchData = async () => {
    try {
      const token = await getToken();
      const [wdRes, walletRes] = await Promise.all([
        fetch(`${API_URL}/api/withdrawal/withdrawals`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/withdrawal/wallets`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const wdData = await wdRes.json();
      const walletData = await walletRes.json();

      setWithdrawals(wdData.withdrawals || []);
      setWallets(walletData.wallets || []);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const processWithdrawal = async (id: number, status: "approved" | "rejected") => {
    if (status === "approved" && !selectedWallet) {
      return toast.error("Select a payout wallet first");
    }
    
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/withdrawal/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          withdrawalId: id,
          status,
          fromWalletId: selectedWallet,
        }),
      });

      if (res.ok) {
        toast.success(`Withdrawal ${status === "approved" ? "sent" : "rejected"}!`);
        fetchData();
        setSelectedIds([]);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const bulkApprove = async (status: "approved" | "rejected") => {
    if (status === "approved" && !selectedWallet) {
      return toast.error("Select a payout wallet");
    }
    if (selectedIds.length === 0) return;

    for (const id of selectedIds) {
      await processWithdrawal(id, status);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === withdrawals.filter((w) => w.status === "pending").length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(withdrawals.filter((w) => w.status === "pending").map((w) => w.id));
    }
  };

  useEffect(() => {
    fetchData();
    // const interval = setInterval(fetchData, 30000); // Refresh every 30s
    // return () => clearInterval(interval);
  }, []);

  return {
    withdrawals,
    loading,
    wallets,
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