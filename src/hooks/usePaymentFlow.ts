// hooks/usePaymentFlow.ts

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const USDT_CONTRACT_ADDRESS = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";

interface PendingPayment {
  requestId: number;
  amount: string;
  adminAddress: string;
}

export const usePaymentFlow = () => {
  const { getToken, isSignedIn } = useAuth();
  const [amount, setAmount] = useState("");
  const [requestId, setRequestId] = useState<number | null>(null);
  const [adminAddress, setAdminAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [tronWeb, setTronWeb] = useState<any>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    const pending = localStorage.getItem("pendingPayment");
    if (pending && !requestId) {
      const data: PendingPayment = JSON.parse(pending);
      setRequestId(data.requestId);
      setAmount(data.amount);
      setAdminAddress(data.adminAddress);
      toast.loading("Resuming payment check...", { id: "resume" });
      startPolling();
    }
  }, []);

  useEffect(() => {
    const check = () => {
      
      if (window.tronWeb && window.tronWeb.ready) {
        setTronWeb(window.tronWeb);
      }
    };
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  const savePending = (id: number, amt: string, addr: string) => {
    localStorage.setItem(
      "pendingPayment",
      JSON.stringify({ requestId: id, amount: amt, adminAddress: addr })
    );
  };

  const clearPending = () => {
    localStorage.removeItem("pendingPayment");
  };

  const initiatePayment = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in first");
      return false;
    }
    const numAmount = parseFloat(amount);
    if (numAmount < 0) {
      toast.error("Please enter an amount");
      return false;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/payment/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: numAmount }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create payment");
      }

      const data = await res.json();
      setRequestId(data.requestId);
      setAdminAddress(data.adminAddress);
      savePending(data.requestId, amount, data.adminAddress);
      toast.success(`Send ${numAmount} USDT to the address below`);
      startPolling();
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendWithTronLink = async () => {
    if (!tronWeb || !adminAddress || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 100) {
      toast.error("Invalid amount");
      return;
    }

    setLoading(true);
    try {
      const amountInSun = BigInt(Math.round(numAmount * 1000000));

      console.log(`Sending ${numAmount} USDT = ${amountInSun} sun units`);

      const contract = await tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
      const tx = await contract.transfer(adminAddress, amountInSun).send({
        feeLimit: 40000000,
      });

      console.log("Tx sent:", tx);

      toast.success("Transaction sent! Confirming...");
      startPolling(tx.txID || tx); // Pass new tx hash
    } catch (err: any) {
      console.error("Send failed:", err);
      toast.error("Send failed — not enough Energy/TRX for fee?");
      setLoading(false);
    }
  };

  const startPolling = (txHash?: string) => {
    if (!requestId) return;
    setIsCheckingStatus(true);

    let attempts = 0;
    const maxAttempts = 90;

    const poll = async () => {
      attempts++;
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/payment/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requestId,
            ...(txHash && { transactionHash: txHash }),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            toast.dismiss("resume");
            clearPending();
            toast.success(`${data.tokensAdded} tokens added! 🎉`, {
              duration: 8000,
            });
            setTimeout(() => window.location.reload(), 3000);
            return;
          }
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          toast.dismiss("resume");
          toast.error("Timeout — contact support if you sent payment");
        }
      } catch {
        if (attempts < maxAttempts) setTimeout(poll, 3000);
      }
    };

    poll();
  };

  const reset = () => {
    clearPending();
    setAmount("");
    setRequestId(null);
    setAdminAddress("");
    setIsCheckingStatus(false);
  };

  const copyAddress = () => {
    if (adminAddress) {
      navigator.clipboard.writeText(adminAddress);
      toast.success("Address copied!");
    }
  };

  return {
    amount,
    setAmount,
    requestId,
    adminAddress,
    loading,
    tronWeb,
    isCheckingStatus,
    initiatePayment,
    sendWithTronLink,
    copyAddress,
    reset,
  };
};
