import { useUser } from "@clerk/clerk-react";
import { AlertTriangle } from "lucide-react"; // Add this import
import Loading from "../Loading";

interface BalanceCardProps {
  balance: number;
  isLoaded: boolean;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, isLoaded }) => {
  const { user } = useUser();

  if (!isLoaded || !user) return <Loading/>;

  const showWarning = balance > 1;

  return (
    <div className="relative my-12 overflow-hidden rounded-3xl bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-1 shadow-2xl">
      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-yellow-400 via-amber-500 to-orange-500 opacity-30 blur-xl"></div>

      <div className="relative rounded-3xl bg-gray-900/95 backdrop-blur-xl p-10 md:p-16 text-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="flex flex-wrap justify-center items-center h-full gap-8 px-8">
            <img
              src="https://www.shutterstock.com/image-vector/golden-bitcoin-cryptocurrency-concept-floating-600nw-2540840221.jpg"
              alt="Golden cryptocurrency token floating"
              className="max-w-xs w-full object-contain drop-shadow-2xl"
            />
            <img
              src="https://thumbs.dreamstime.com/b/golden-bitcoin-coin-floating-front-open-vault-door-digital-currency-concept-futuristic-financial-security-glowing-light-405178403.jpg"
              alt="Golden bitcoin in futuristic vault"
              className="max-w-xs w-full object-contain drop-shadow-2xl"
            />
            <img
              src="https://thumbs.dreamstime.com/b/floating-cryptocurrency-coins-futuristic-data-network-environment-dynamic-representation-golden-digital-glowing-350664024.jpg"
              alt="Floating crypto coins in network"
              className="max-w-xs w-full object-contain drop-shadow-2xl hidden md:block"
            />
            <img
              src="https://www.shutterstock.com/image-illustration/floating-golden-nft-coin-within-glowing-260nw-2691014287.jpg"
              alt="Glowing golden NFT token"
              className="max-w-xs w-full object-contain drop-shadow-2xl hidden lg:block"
            />
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Welcome back,
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-amber-300 mt-2">
              {user?.firstName || "Investor"}!
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10">
            Your Exclusive Ram Token Portfolio
          </p>

          <div className="inline-block relative">
            <img
              src="https://thumbs.dreamstime.com/b/sleek-black-credit-card-mockup-gold-accents-dark-geometric-surface-representing-luxury-finance-modern-payment-404278279.jpg"
              alt="Luxury black credit card background"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-70"
            />
            <img
              src="https://robbreport.com/wp-content/uploads/2021/06/compsecure.jpg"
              alt="Premium metal gold credit card"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-50"
            />

            <div className="relative px-16 py-12 rounded-2xl border border-yellow-500/50 shadow-2xl">
              <p className="text-lg md:text-xl text-gray-400 uppercase tracking-wider mb-3">
                Current Balance
              </p>
              <p className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-amber-400 to-orange-400 drop-shadow-2xl">
                {balance.toLocaleString()}
              </p>
              <p className="text-2xl md:text-3xl text-yellow-400 mt-4 font-bold">
                Tokens
              </p>

              {/* Warning Badge - appears only when balance > 1 */}
              {showWarning && (
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-yellow-900/60 border border-yellow-500/40 rounded-xl text-yellow-300 text-sm font-medium backdrop-blur-sm">
                  <AlertTriangle size={18} className="text-yellow-400" />
                  <span>
                    Please invest in one of the plans to start earning.
                  </span>
                </div>
              )}
            </div>

            <img
              src="https://thumbs.dreamstime.com/b/gold-glitter-particles-light-ray-bokeh-concept-exploding-dispersing-creating-sparkling-warm-dark-abstract-background-407163185.jpg"
              alt="Golden sparkle overlay"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-20 mix-blend-screen"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;