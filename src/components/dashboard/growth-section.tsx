"use client";

import { TrendingUp, Shield, Users } from "lucide-react";

export function GrowthSection() {
  return (
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        How Your Money Grows
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: TrendingUp,
            title: "Compound Growth",
            desc: "Your monthly returns are reinvested automatically, accelerating growth.",
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            icon: Shield,
            title: "Secured Investments",
            desc: "All investments are protected by our multi-layer security infrastructure.",
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            icon: Users,
            title: "Referral Rewards",
            desc: "Earn bonuses when your referrals invest. Build your network and earn passively.",
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
            <div className={`${item.bg} p-3 rounded-xl w-fit mb-4`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
