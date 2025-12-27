import React from "react";
import { Check } from "lucide-react";

const InvestmentPlans: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Investment Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Buy tokens after registration and start earning high returns instantly.
          </p>
        </div>

        {/* Responsive grid: 1 col mobile, 2 col md, 3 col lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Monthly Growth Plan */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition">
            <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Monthly Growth</h3>
              <div className="text-5xl font-extrabold">10%</div>
              <p className="text-lg mt-2 opacity-90">Per Month</p>
            </div>

            <div className="p-8 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <Check className="h-6 w-6 text-green-500 mr-3 shrink-0" />
                  <span>Flexible – withdraw anytime</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-6 w-6 text-green-500 mr-3 shrink-0" />
                  <span>Compounding monthly returns</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-6 w-6 text-green-500 mr-3 shrink-0" />
                  <span>Ideal for regular income</span>
                </li>
              </ul>

              <div className="pt-6">
                <button className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                  Start Monthly Plan
                </button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Available after login
                </p>
              </div>
            </div>
          </div>

          {/* New: 6-Month Fixed Plan */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-teal-500 relative hover:shadow-2xl transition">
            <div className="absolute top-0 right-0 bg-teal-600 text-white px-6 py-2 rounded-bl-lg text-sm font-bold">
              BEST BALANCE
            </div>

            <div className="bg-linear-to-r from-teal-500 to-cyan-600 text-white p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">6-Month Lock-In</h3>
              <div className="text-5xl font-extrabold">1.75x</div>
              <p className="text-lg mt-2 opacity-90">After 6 Months</p>
            </div>

            <div className="p-8 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <Check className="h-6 w-6 text-teal-500 mr-3 shrink-0" />
                  <span>Lock tokens for 6 months</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-6 w-6 text-teal-500 mr-3 shrink-0" />
                  <span>Get 1.75× your investment</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-6 w-6 text-teal-500 mr-3 shrink-0" />
                  <span>Great mid-term returns</span>
                </li>
              </ul>

              <div className="pt-6">
                <button className="w-full py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition">
                  Start 6-Month Plan
                </button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Available after login
                </p>
              </div>
            </div>
          </div>

          {/* 12-Month Fixed Plan (Most Popular) */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-500 relative hover:shadow-2xl transition">
            <div className="absolute top-0 right-0 bg-purple-600 text-white px-6 py-2 rounded-bl-lg text-sm font-bold">
              MOST POPULAR
            </div>

            <div className="bg-linear-to-r from-purple-600 to-indigo-600 text-white p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">12-Month Lock-In</h3>
              <div className="text-5xl font-extrabold">3x</div>
              <p className="text-lg mt-2 opacity-90">After 12 Months</p>
            </div>

            <div className="p-8 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <Check className="h-6 w-6 text-purple-500 mr-3 shrink-0" />
                  <span>Lock tokens for 12 months</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-6 w-6 text-purple-500 mr-3 shrink-0" />
                  <span>Get 3 times your investment</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-6 w-6 text-purple-500 mr-3 shrink-0" />
                  <span>Highest long-term returns</span>
                </li>
              </ul>

              <div className="pt-6">
                <button className="w-full py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                  Start 12-Month Plan
                </button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Available after login
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentPlans;