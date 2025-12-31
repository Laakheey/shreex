import React, { useEffect } from "react";
import { useReferral } from "../../hooks/useReferralTest";
import { Copy, Users, DollarSign, Lock, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

const GrowthPage: React.FC = () => {
  const {
    myReferralCode,
    downline,
    bonuses,
    loading,
    applyReferralCode,
    hasReferrer,
    isEligible,
  } = useReferral();

  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const referralLink = `${window.location.origin}/?ref=${myReferralCode}`;

  useEffect(() => {
    const autoApply = async () => {
      if (isLoaded && user && !hasReferrer) {
        const savedCode = localStorage.getItem("pending_referral_code");
        if (savedCode) {
          const success = await applyReferralCode(savedCode);
          if (success) localStorage.removeItem("pending_referral_code");
        }
      }
    };
    autoApply();
  }, [user, isLoaded, hasReferrer, applyReferralCode]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success("Referral link copied!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  if (!isLoaded || loading) return <Loading />;

  if (!isEligible) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] p-8 md:p-16 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Referral Program Locked</h1>
          <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            To maintain a high-quality network, you must have at least one 
            <span className="font-bold text-gray-800"> active investment plan </span> 
            to generate your referral link and earn commissions.
          </p>
          <button 
            onClick={() => navigate("/invest")}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Get Started <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const renderTree = (node: any) => {
    if (!node) return null;
    const shortId = node.id ? node.id.slice(-5) : "Unknown";
    const displayName = node.display_name || `User...${shortId}`;

    return (
      <li className="ml-6" key={node.id || Math.random()}>
        <div className="bg-indigo-50/50 px-4 py-3 rounded-2xl border border-indigo-100 flex justify-between items-center">
          <div>
            <p className="font-bold text-indigo-900">{displayName}</p>
            <p className="text-xs text-indigo-600 font-medium">Level {node.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">${Number(node.active_invested || 0).toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Active Invested</p>
          </div>
        </div>
        {node.children && node.children.length > 0 && (
          <ul className="mt-3 border-l-2 border-indigo-100 pl-4 space-y-3">
            {node.children.map((child: any) => renderTree(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Growth & Referrals</h1>
          <p className="text-gray-500 font-medium">Build your network and earn passive bonuses.</p>
        </header>

        <div className="bg-linear-to-br from-indigo-600 to-purple-700 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4">Invite & Earn Passive Income</h2>
            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl backdrop-blur-xl border border-white/20">
              <code className="flex-1 px-4 text-sm font-mono truncate opacity-90">
                {referralLink}
              </code>
              <button
                onClick={copyLink}
                className="p-3 bg-white text-indigo-600 rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>
          <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "One-time Bonuses", val: bonuses.one_time_total, color: "text-green-600", icon: <DollarSign /> },
            { label: "Ongoing Passive", val: bonuses.ongoing_total, color: "text-blue-600", icon: <Users /> },
            { label: "Total Earnings", val: bonuses.grand_total, color: "text-purple-600", icon: <DollarSign /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 bg-gray-50 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-gray-900">${stat.val.toFixed(2)}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Network Tree */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-gray-900">
            <Users size={24} className="text-indigo-600" />
            Your Referral Network
          </h2>

          {downline?.children?.length ? (
            <div className="overflow-x-auto">
              <ul className="space-y-6">
                <li className="font-bold text-center bg-gray-50/50 py-4 rounded-2xl border-2 border-dashed border-gray-100 mb-8 text-gray-400 text-sm">
                  {user?.firstName || "Your Root Account"}
                </li>
                {downline.children.map((child: any) => renderTree(child))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 font-medium">No referrals found yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GrowthPage;