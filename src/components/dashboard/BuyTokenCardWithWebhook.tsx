import React from "react";
import {
  Copy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Star,
  ArrowLeft,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import toast, { Toaster } from "react-hot-toast";
import {
  usePaymentFlowTest,
  type InvestmentPlan,
} from "../../hooks/usePaymentFlowTest";

interface BuyTokensCardTestProps {
  onBuySuccess?: () => void;
}

const BuyTokensCardTest: React.FC<BuyTokensCardTestProps> = ({
  onBuySuccess,
}) => {
  const {
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
    initiatePayment,
    verifyPayment,
    copyAddress,
    reset,
  } = usePaymentFlowTest();

  const handleVerify = async () => {
    const success = await verifyPayment();
    if (success && onBuySuccess) {
      toast.success("Investment activated!");
      onBuySuccess();
    }
  };

  const planOptions: {
    id: InvestmentPlan;
    label: string;
    icon: any;
    roi: string;
  }[] = [
    { id: "monthly", label: "Monthly", icon: Clock, roi: "10%/mo" },
    {
      id: "half-yearly",
      label: "6 Months",
      icon: Calendar,
      roi: "1.75x Total",
    },
    { id: "yearly", label: "Yearly", icon: Star, roi: "3x Total" },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-lg mx-auto my-10 border border-gray-100 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
          Deposit <span className="text-indigo-600">USDT</span>
        </h2>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-widest">
          Network: BSC (BEP20)
        </div>
      </div>

      {!requestId ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Investment Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Min. 10 USDT"
                className="w-full px-5 py-4 text-2xl font-bold border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-300"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                USDT
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Minimum deposit requirement: 10 USDT
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Choose Your Multiplier
            </label>
            <div className="grid grid-cols-3 gap-3">
              {planOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setPlan(option.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                    plan === option.id
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 scale-[1.02] shadow-sm"
                      : "border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  <option.icon
                    className={`h-5 w-5 mb-2 ${
                      plan === option.id ? "text-indigo-600" : "text-gray-400"
                    }`}
                  />
                  <span className="text-xs font-bold whitespace-nowrap">
                    {option.label}
                  </span>
                  <span className="text-[10px] font-medium opacity-80 mt-1">
                    {option.roi}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={initiatePayment}
            disabled={loading}
            className="w-full py-5 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-gray-300 disabled:pointer-events-none"
          >
            {loading ? "Processing..." : "Generate Deposit Address"}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
          {/* Payment Details */}
          <div className="bg-indigo-50 rounded-3xl p-6 text-center border border-indigo-100">
            <div className="bg-white p-3 rounded-2xl inline-block shadow-sm mb-4">
              <QRCodeSVG value={adminAddress} size={160} />
            </div>

            <div className="text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase">
                  Wallet Address (BEP20)
                </span>
                <button
                  onClick={copyAddress}
                  className="text-indigo-600 text-xs font-bold flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <div className="bg-white px-4 py-3 rounded-xl font-mono text-xs break-all border border-indigo-100 text-gray-600">
                {adminAddress}
              </div>
            </div>
          </div>

          {/* Network Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Warning:</strong> Send only{" "}
              <strong>USDT via BSC (BEP20)</strong>. Sending via TRC20 or ERC20
              will result in permanent loss of funds.
            </p>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Paste Transaction Hash (TXID)
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x..."
              className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-green-500 outline-none mb-4 font-mono text-sm"
            />
            <button
              onClick={handleVerify}
              disabled={verifying || !txHash.trim()}
              className="w-full py-5 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {verifying ? (
                "Verifying Transaction..."
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" /> I Have Paid
                </>
              )}
            </button>
          </div>

          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 text-gray-400 text-sm font-medium hover:text-red-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel Transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyTokensCardTest;
