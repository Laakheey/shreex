import { Check } from "lucide-react";

const plans = [
  {
    name: "Monthly Growth",
    return: "10%",
    period: "Per Month",
    gradient: "from-[#CD7F32] to-[#8B4513]",
    checkColor: "text-green-500",
    buttonBg: "bg-green-600 hover:bg-green-700",
    features: [
      "Flexible \u2013 withdraw anytime",
      "Compounding monthly returns",
      "Ideal for regular income",
    ],
  },
  {
    name: "6-Month Lock-In",
    return: "1.75x",
    period: "After 6 Months",
    gradient: "from-teal-500 to-cyan-600",
    checkColor: "text-teal-500",
    buttonBg: "bg-teal-600 hover:bg-teal-700",
    badge: "BEST BALANCE",
    badgeBg: "bg-teal-600",
    border: "border-2 border-teal-500",
    features: [
      "Lock tokens for 6 months",
      "Get 1.75\u00d7 your investment",
      "Great mid-term returns",
    ],
  },
  {
    name: "12-Month Lock-In",
    return: "3x",
    period: "After 12 Months",
    gradient: "from-purple-600 to-indigo-600",
    checkColor: "text-purple-500",
    buttonBg: "bg-purple-600 hover:bg-purple-700",
    badge: "MOST POPULAR",
    badgeBg: "bg-purple-600",
    border: "border-2 border-purple-500",
    features: [
      "Lock tokens for 12 months",
      "Get 3\u00d7 your investment",
      "Maximum long-term gains",
    ],
  },
];

export function InvestmentPlans() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Investment Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Buy tokens after registration and start earning high returns
            instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden ${plan.border || "border border-gray-200"} relative hover:shadow-2xl transition`}
            >
              {plan.badge && (
                <div
                  className={`absolute top-0 right-0 ${plan.badgeBg} text-white px-6 py-2 rounded-bl-lg text-sm font-bold`}
                >
                  {plan.badge}
                </div>
              )}
              <div
                className={`bg-gradient-to-r ${plan.gradient} text-white p-8 text-center`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-5xl font-extrabold">{plan.return}</div>
                <p className="text-lg mt-2 opacity-90">{plan.period}</p>
              </div>
              <div className="p-8 space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center text-gray-700">
                      <Check
                        className={`h-6 w-6 ${plan.checkColor} mr-3 shrink-0`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6">
                  <button
                    className={`w-full py-4 ${plan.buttonBg} text-white font-semibold rounded-lg transition`}
                  >
                    Start {plan.name.split(" ")[0]} Plan
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-3">
                    Available after login
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
