// hooks/useWithdrawalRequest.ts
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export const useWithdrawalRequest = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { getToken, isSignedIn } = useAuth();
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const requestWithdrawal = async () => {
    if (!isSignedIn) return toast.error("Please sign in");
    if (!amount || Number(amount) <= 0) return toast.error("Enter valid amount");
    if (!walletAddress.trim()) return toast.error("Enter wallet address");

    const numAmount = Number(amount);
    if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(walletAddress.trim())) {
      return toast.error("Invalid Tron address");
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/withdrawal/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: numAmount,
          walletAddress: walletAddress.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Withdrawal request submitted! 🎉");
        toast.success("It will be processed within 24 working hours.", { duration: 8000 });
        setAmount("");
        setWalletAddress("");
        onSuccess?.();
      } else {
        toast.error(data.error || "Request failed");
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    amount,
    setAmount,
    walletAddress,
    setWalletAddress,
    loading,
    requestWithdrawal,
  };
};