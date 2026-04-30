"use client";

import { useState, useEffect } from "react";
import { Users, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { getReferralData } from "@/lib/actions/referral";

export function ReferralRules() {
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [referralInput, setReferralInput] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    getReferralData().then(setData);
  }, []);

  const copyLink = () => {
    const link = `${window.location.origin}?ref=${data?.myReferralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const applyCode = async () => {
    if (!referralInput.trim()) return;
    setApplying(true);
    try {
      const res = await fetch("/api/referral/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: referralInput.trim() }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        getReferralData().then(setData);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Network error");
    } finally {
      setApplying(false);
    }
  };

  if (!data) return null;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-xl">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Referral Program</h3>
          <p className="text-sm text-gray-500">
            Invite friends and earn bonuses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">
            {data.bonuses.one_time_total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">One-Time Bonuses</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">
            {data.bonuses.ongoing_total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Ongoing Bonuses</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">
            {data.bonuses.grand_total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total Earned</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 mb-4">
        <input
          readOnly
          value={`${typeof window !== "undefined" ? window.location.origin : ""}?ref=${data.myReferralCode}`}
          className="flex-1 bg-transparent text-sm font-mono truncate"
        />
        <button
          onClick={copyLink}
          className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {!data.hasReferrer && (
        <div className="flex gap-2">
          <input
            placeholder="Enter referral code"
            value={referralInput}
            onChange={(e) => setReferralInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <button
            onClick={applyCode}
            disabled={applying}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply"}
          </button>
        </div>
      )}
    </section>
  );
}
