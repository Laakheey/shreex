import React, { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { useWithdrawalRequest } from "../../hooks/useWithdrawalRequest";

interface CashOutCardProps {
  currentBalance: number;
  onSuccess?: () => void;
}

const CashOutCardTest: React.FC<CashOutCardProps> = ({ currentBalance, onSuccess }) => {
  const [method, setMethod] = useState<"tron" | "phone">("tron");

  const {
    amount,
    setAmount,
    walletAddress,
    setWalletAddress,
    phoneNumber,
    setPhoneNumber,
    loading,
    requestWithdrawal,
  } = useWithdrawalRequest({ onSuccess });

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md mx-auto md:p-8 my-10 border border-gray-100 font-sans">
      <h2 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
        Withdraw Tokens to USDT
      </h2>

      <p className="text-center text-gray-600 mb-6">
        Balance: <strong>{currentBalance.toLocaleString()}</strong> Tokens
      </p>

      {/* Amount Input */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to withdraw"
        className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl mb-5 focus:border-red-500 outline-none transition-all"
        min="1"
        max={currentBalance}
      />

      {/* Withdrawal Method Toggle */}
      <div className="mb-6">
        <p className="text-center text-sm font-medium text-gray-700 mb-3">
          Withdrawal Method
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMethod("tron")}
            className={`py-4 rounded-2xl font-semibold transition-all shadow-sm ${
              method === "tron"
                ? "bg-linear-to-r from-red-600 to-pink-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tron Wallet
          </button>
          <button
            type="button"
            onClick={() => setMethod("phone")}
            className={`py-4 rounded-2xl font-semibold transition-all shadow-sm ${
              method === "phone"
                ? "bg-linear-to-r from-red-600 to-pink-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Mobile Money
          </button>
        </div>
      </div>

      {/* Conditional Inputs */}
      {method === "tron" ? (
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Tron address (starts with T)"
          className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl mb-6 focus:border-red-500 outline-none transition-all"
        />
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
            Phone Number for Mobile Money
          </label>

          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="IN"
            value={phoneNumber}
            onChange={(value) => setPhoneNumber(value)}
            placeholder="Enter phone number"
            className="phone-input-container"
          />

          <style>{`
            .phone-input-container .PhoneInputInput {
              height: 3.5rem;
              padding-left: 1rem;
              padding-right: 1rem;
              border: 2px solid #d1d5db;
              border-radius: 1rem;
              font-size: 1rem;
              outline: none;
              margin-top: 0.5rem;
            }
            .phone-input-container .PhoneInputInput:focus {
              border-color: #f43f5e;
            }
          `}</style>
        </div>
      )}

      <button
        onClick={requestWithdrawal}
        disabled={
          loading ||
          !amount ||
          Number(amount) <= 0 ||
          Number(amount) > currentBalance ||
          (method === "tron"
            ? !walletAddress.trim()
            : !phoneNumber || !isValidPhoneNumber(phoneNumber || ""))
        }
        className="w-full py-6 bg-linear-to-r from-red-600 to-pink-600 text-white text-xl font-bold rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed hover:from-red-700 hover:to-pink-700 transition-all shadow-lg"
      >
        {loading ? "Submitting Request..." : "Request Withdrawal"}
      </button>

      <p className="text-sm text-gray-500 text-center mt-6 bg-yellow-50 py-4 rounded-xl border border-yellow-200">
        ⏱️ Requests are processed manually within <strong>24 working hours</strong>
      </p>

      {method === "phone" && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
          <p className="text-sm font-medium text-green-800">
            Admin will send USDT via Mobile Money.
          </p>
        </div>
      )}
    </div>
  );
};

export default CashOutCardTest;