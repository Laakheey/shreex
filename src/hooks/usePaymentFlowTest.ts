import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export type InvestmentPlan = "monthly" | "half-yearly" | "yearly";

export const usePaymentFlowTest = () => {
  const { getToken, isSignedIn } = useAuth();
  
  // State Management
  const [amount, setAmount] = useState<string>("");
  const [plan, setPlan] = useState<InvestmentPlan>("monthly");
  const [requestId, setRequestId] = useState<number | null>(null);
  const [adminAddress, setAdminAddress] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);

  const initiatePayment = async () => {
    if (!isSignedIn) {
      return toast.error("Please sign in to continue");
    }

    const numAmount = Number(amount);
    if (!amount || numAmount < 10) {
      return toast.error("Minimum investment is 10 USDT");
    }

    setLoading(true);
    try {
      const token = await getToken();
      
      const res = await fetch(`${API_URL}/api/test/payment/initiate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          amount: numAmount,
          plan: plan,
          network: "BEP20"
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      // 3. Set Payment Details
      setRequestId(data.requestId);
      setAdminAddress(data.adminAddress);
      
      toast.success("Request created! Please send USDT (BEP20) only.", {
        duration: 5000,
        icon: '🚀'
      });

    } catch (err: any) {
      toast.error(err.message || "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submits the TX Hash to the backend for blockchain verification
   */
  const verifyPayment = async () => {
    if (!txHash.trim()) {
      return toast.error("Please paste the transaction hash (TXID)");
    }

    // Basic TX Hash length validation for BSC (64 chars + 0x)
    if (txHash.length < 60) {
      return toast.error("Invalid transaction hash format");
    }

    setVerifying(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/test/payment/submit-tx-hash`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          requestId, 
          txHash: txHash.trim() 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Verified! ${data.tokensAdded} Tokens added to your account.`);
        reset(); // Clear form on success
        return true;
      } else {
        toast.error(data.error || "Verification failed. Check your hash.");
        return false;
      }
    } catch (error) {
      toast.error("Network error. Please try again later.");
      return false;
    } finally {
      setVerifying(false);
    }
  };

  const copyAddress = () => {
    if (!adminAddress) return;
    navigator.clipboard.writeText(adminAddress);
    toast.success("Address copied to clipboard!");
  };

  const reset = () => {
    setRequestId(null);
    setAmount("");
    setPlan("monthly");
    setAdminAddress("");
    setTxHash("");
  };

  return {
    // State
    amount,
    setAmount,
    plan,
    setPlan,
    requestId,
    adminAddress,
    txHash,
    setTxHash,
    loading,
    verifying,
    // Actions
    initiatePayment,
    verifyPayment,
    copyAddress,
    reset
  };
};