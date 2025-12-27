import React, { useEffect } from "react";
import { useReferral } from "../../hooks/useReferral";
import { Copy, Users, DollarSign } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import Loading from "../Loading";

const GrowthPage: React.FC = () => {
  const {
    myReferralCode,
    downline,
    bonuses,
    loading,
    applyReferralCode,
    hasReferrer,
  } = useReferral();
  
  const { user, isLoaded } = useUser();
  const referralLink = `${window.location.origin}/?ref=${myReferralCode}`;

  useEffect(() => {
    const autoApply = async () => {
      if (isLoaded && user && !hasReferrer) {
        const savedCode = localStorage.getItem("pending_referral_code");
        
        if (savedCode) {
          const success = await applyReferralCode(savedCode);
          if (success) {
            localStorage.removeItem("pending_referral_code"); // Clean up
          }
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

  const renderTree = (node: any) => (
    <li className="ml-6" key={node.id}>
      <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
        <p className="font-medium">{node.display_name || `User...${node.id.slice(-5)}`}</p>
        <p className="text-sm text-gray-600">
          Level {node.level} • Active: ${Number(node.active_invested || 0).toFixed(2)}
        </p>
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="mt-2 border-l-2 border-indigo-200 pl-4">
          {node.children.map((child: any) => renderTree(child))}
        </ul>
      )}
    </li>
  );

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Growth & Referrals</h1>

        <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4">Invite & Earn Passive Income</h2>
            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
              <code className="flex-1 px-4 text-sm font-mono truncate">
                {referralLink}
              </code>
              <button
                onClick={copyLink}
                className="p-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <Copy size={20} />
              </button>
            </div>
            <p className="mt-4 text-sm text-indigo-100">
              New users clicking your link will be automatically added to your network.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-800">${bonuses.one_time_total.toFixed(2)}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">One-time Bonuses</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-gray-800">${bonuses.ongoing_total.toFixed(2)}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Ongoing Passive</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-gray-800">${bonuses.grand_total.toFixed(2)}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Earnings</p>
          </div>
        </div>

        {/* Network Tree */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-gray-800">
            <Users size={24} className="text-indigo-600" />
            Your Referral Network
          </h2>

          {downline?.children?.length ? (
            <div className="overflow-x-auto">
              <ul className="space-y-6">
                <li className="font-bold text-center bg-gray-50 py-4 rounded-2xl border border-dashed border-gray-200 mb-8">
                  <p className="text-gray-400 text-xs uppercase mb-1">Root Account</p>
                  {user?.firstName || "You"}
                </li>
                {downline.children.map((child: any) => renderTree(child))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No direct referrals yet</p>
              <p className="text-sm text-gray-400 mt-1">Share your link to start earning commissions.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GrowthPage;