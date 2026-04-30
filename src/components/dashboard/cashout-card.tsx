"use client";

import { useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

interface Props {
  currentBalance: number;
  onSuccess: () => Promise<void>;
}

export function CashOutCard({ currentBalance, onSuccess }: Props) {
  const { getToken } = useAuth();
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [method, setMethod] = useState<"wallet" | "phone">("wallet");
  const [loading, setLoading] = useState(false);

  const handleCashOut = async () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (numAmount > currentBalance) {
      toast.error("Insufficient balance");
      return;
    }

    if (method === "wallet" && !walletAddress.trim()) {
      toast.error("Enter wallet address");
      return;
    }
    if (method === "phone" && !phoneNumber.trim()) {
      toast.error("Enter phone number");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/withdrawal/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: numAmount,
          walletAddress: method === "wallet" ? walletAddress.trim() : null,
          phoneNumber: method === "phone" ? phoneNumber.trim() : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Withdrawal request submitted!");
        setAmount("");
        setWalletAddress("");
        setPhoneNumber("");
        await onSuccess();
      } else {
        toast.error(data.error || "Request failed");
      }
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-orange-100 p-3 rounded-xl">
          <ArrowUpRight className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Cash Out</h3>
          <p className="text-sm text-gray-500">
            Withdraw to wallet or mobile money
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMethod("wallet")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            method === "wallet"
              ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          Tron Wallet
        </button>
        <button
          onClick={() => setMethod("phone")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1 ${
            method === "phone"
              ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <Phone className="h-4 w-4" /> Mobile Money
        </button>
      </div>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:ring-2 focus:ring-orange-500"
      />

      {method === "wallet" ? (
        <input
          type="text"
          placeholder="Tron wallet address (TRC20)"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-orange-500"
        />
      ) : (
        <input
          type="tel"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-orange-500"
        />
      )}

      <button
        onClick={handleCashOut}
        disabled={loading}
        className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Submit Withdrawal Request"}
      </button>
    </div>
  );
}
