// BuyTokensCard.tsx

import React from "react";
import { Copy, Wallet, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Toaster } from "react-hot-toast";
import { usePaymentFlow } from "../../hooks/usePaymentFlow"; // Adjust path

const BuyTokensCard: React.FC = () => {
  const {
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
  } = usePaymentFlow();

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg mx-auto my-10">
      <Toaster position="bottom-center" />

      <h2 className="text-3xl font-bold text-center mb-8 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Buy Tokens with USDT
      </h2>

      {!requestId ? (
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2">Amount (USDT)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum 100"
              className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-sm text-gray-600 mt-3">
              Min: 100 USDT → <strong>1 USDT = 1 Tokens</strong>
            </p>
          </div>

          <button
            onClick={initiatePayment}
            disabled={loading || !amount || parseFloat(amount) < 100}
            className="w-full py-6 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl disabled:opacity-60"
          >
            {loading ? "Creating..." : "Continue"}
          </button>
        </div>
      ) : (
        <div className="space-y-8 text-center">
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-3xl p-8">
            <p className="text-2xl font-bold mb-6">
              Send <span className="text-indigo-700">{amount} USDT</span>
            </p>

            <div className="flex justify-center mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-2xl">
                <QRCodeSVG value={adminAddress} size={240} />
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl font-mono text-sm break-all mb-6">
              {adminAddress}
            </div>

            <div className="space-y-4">
              <button
                onClick={copyAddress}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-700"
              >
                <Copy className="h-5 w-5" /> Copy Address
              </button>

              {tronWeb && (
                <button
                  onClick={sendWithTronLink}
                  disabled={loading}
                  className="w-full py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  <Wallet className="h-5 w-5" />
                  {loading ? "Sending..." : "Pay with TronLink"}
                </button>
              )}
            </div>

            <p className="text-red-600 font-bold mt-6">
              ⚠️ TRC20 USDT Only • Exact amount preferred
            </p>

            {isCheckingStatus && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin" />
                <p className="text-lg font-semibold">Checking payment...</p>
                <p className="text-sm text-gray-600">You can close and return later</p>
              </div>
            )}
          </div>

          <button onClick={reset} className="text-gray-600 underline text-sm">
            Cancel & Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyTokensCard;