"use client";

import { useState } from "react";
import { Upload, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  onBuySuccess: () => Promise<void>;
}

export function BuyTokensCard({ onBuySuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const walletAddress = process.env.NEXT_PUBLIC_TRON_WALLET || "TYourWalletAddressHere";

  const startPurchase = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setShowDetails(true);
  };

  const submitPurchase = async () => {
    if (!amount || !file) {
      toast.error("Please upload payment proof");
      return;
    }

    setLoading(true);
    try {
      toast.success(
        "Payment proof submitted! Admin will review and credit tokens soon."
      );
      setPending(true);
      setShowDetails(false);
      setAmount("");
      setFile(null);
      await onBuySuccess();
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (pending) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-green-200">
        <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Payment Under Review
        </h3>
        <p className="text-gray-500 mb-4">
          Your payment proof has been submitted. Tokens will be credited after
          admin approval.
        </p>
        <button
          onClick={() => setPending(false)}
          className="text-indigo-600 font-semibold hover:underline"
        >
          Buy More
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-indigo-100 p-3 rounded-xl">
          <CreditCard className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Buy Tokens</h3>
          <p className="text-sm text-gray-500">Send USDT and upload proof</p>
        </div>
      </div>

      {!showDetails ? (
        <>
          <input
            type="number"
            placeholder="Amount in USDT"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={startPurchase}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Continue
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Send {amount} USDT (TRC20) to:
            </p>
            <div className="flex justify-center mb-3">
              <QRCodeSVG value={walletAddress} size={120} />
            </div>
            <p className="text-xs font-mono bg-white p-2 rounded break-all border">
              {walletAddress}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Payment Screenshot
            </label>
            <label className="flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 transition">
              <Upload className="h-5 w-5 mr-2 text-gray-400" />
              <span className="text-gray-500">
                {file ? file.name : "Choose file"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDetails(false)}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={submitPurchase}
              disabled={loading || !file}
              className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Proof"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
