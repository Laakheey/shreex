// hooks/useCashOut.ts
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

interface UseCashOutProps {
  onSuccess?: () => void;
}

export const useCashOut = ({ onSuccess }: UseCashOutProps = {}) => {
  const { getToken, isSignedIn } = useAuth();
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const cashOut = async () => {
    if (!isSignedIn) return toast.error("Please sign in");
    if (!amount || Number(amount) <= 0) return toast.error("Enter valid amount");
    if (!walletAddress.trim()) return toast.error("Enter wallet address");

    const numAmount = Number(amount);

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/withdrawal/withdrawals`, {
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
        toast.success(`Success! ${numAmount} USDT sent 🎉`);
        toast.success(`Tx: ${data.txHash}`, { duration: 10000 });
        setAmount("");
        setWalletAddress("");
        if (onSuccess) onSuccess(); // Refresh balance everywhere
      } else {
        toast.error(data.error || "Cashout failed");
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
    cashOut,
  };
};