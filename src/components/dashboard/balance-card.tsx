"use client";

import { Wallet } from "lucide-react";

interface Props {
  balance: number;
}

export function BalanceCard({ balance }: Props) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">Token Balance</p>
          <p className="text-4xl font-extrabold">
            {balance.toLocaleString()}{" "}
            <span className="text-lg font-normal opacity-80">tokens</span>
          </p>
        </div>
        <div className="bg-white/20 p-4 rounded-2xl">
          <Wallet className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
