import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const API_URL = import.meta.env.VITE_API_URL;

export const useWithdrawalRequest = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { getToken, isSignedIn } = useAuth();
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const requestWithdrawal = async () => {
    if (!isSignedIn) return toast.error("Please sign in");

    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) return toast.error("Enter a valid amount");

    const hasTron = walletAddress.trim().length > 0;
    const hasPhone = phoneNumber && isValidPhoneNumber(phoneNumber);

    if (!hasTron && !hasPhone) {
      return toast.error("Please enter either Tron wallet or phone number");
    }
    if (hasTron && hasPhone) {
      return toast.error("Please use only one withdrawal method");
    }

    if (hasTron && !/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(walletAddress.trim())) {
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
          walletAddress: hasTron ? walletAddress.trim() : null,
          phoneNumber: hasPhone ? phoneNumber : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Withdrawal request submitted! 🎉");
        toast.success("It will be processed within 24 working hours.", { duration: 8000 });
        setAmount("");
        setWalletAddress("");
        setPhoneNumber(undefined);
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
    phoneNumber,
    setPhoneNumber: (value: string | undefined) => setPhoneNumber(value),
    loading,
    requestWithdrawal,
  };
};