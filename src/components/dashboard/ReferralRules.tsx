import React from "react";

const ReferralRules = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-yellow-400 py-5 px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Referral Rewards – Super Simple
          </h2>
          <p className="text-gray-700 mt-2 text-lg">
            Invite friends and earn passive rewards!
          </p>
        </div>

        {/* Rules List */}
        <div className="p-6 md:p-8 space-y-8 text-gray-800">
          <div className="space-y-6">
            <RuleItem number={1}>
              When you invite a friend, you get:
              <br />
              <span className="font-bold text-yellow-600">
                5% one-time instant bonus
              </span>{" "}
              on their first investment
              <br />
              <span className="text-blue-800 font-bold">
                First Level:
              </span> +{" "}
              <span className="font-bold text-yellow-600">2% forever</span> of
              all their future active investments per month
            </RuleItem>

            <RuleItem number={2}>
              <span className="text-blue-800 font-bold">Second Level:</span>{" "}
              When your friend invites someone new, you get{" "}
              <span className="font-bold text-yellow-600">1%</span> forever from
              that new person's active investments
            </RuleItem>

            <RuleItem number={3}>
              <span className="text-blue-800 font-bold">Third Level:</span> When
              that new person invites someone, you get{" "}
              <span className="font-bold text-yellow-600">0.5%</span> forever
              from their investments
            </RuleItem>

            <RuleItem number={4}>
              <span className="text-blue-800 font-bold">Fourth Level:</span> One
              level deeper, you get{" "}
              <span className="font-bold text-yellow-600">0.25%</span> forever
              from their investments
            </RuleItem>

            <RuleItem number={5}>
              Anything deeper than that →{" "}
              <span className="font-bold text-red-600">0%</span>
              <br />
              <span className="text-sm">
                Only the first 4 levels give you rewards
              </span>
            </RuleItem>
          </div>

          <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center text-sm md:text-base">
            <p className="font-medium text-gray-700">
              All rewards are paid in tokens and added automatically to your
              balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable rule item component
const RuleItem: React.FC<{
  number: number;
  children: React.ReactNode;
}> = ({ number, children }) => (
  <div className="flex items-start gap-4">
    <div className="shrink-0 w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl font-bold">
      {number}
    </div>
    <p className="text-lg leading-relaxed">{children}</p>
  </div>
);

export default ReferralRules;
