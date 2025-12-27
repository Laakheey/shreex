import React from "react";
import { Shield, Users, TrendingUp, Zap, Globe, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import image from '/assets/financial growth.jpg'

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-linear-to-br from-indigo-700 via-purple-700 to-pink-700 text-white py-24 md:py-40 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              Empowering Everyday Investors
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
              We're a forward-thinking startup revolutionizing access to
              high-yield opportunities through secure token-based investments.
            </p>
          </div>
        </div>

        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="flex justify-center items-center h-full gap-8 flex-wrap">
            <img
              src="https://thumbs.dreamstime.com/b/floating-cryptocurrency-coins-futuristic-data-network-environment-dynamic-representation-golden-digital-glowing-350664024.jpg"
              alt="Floating cryptocurrency coins in futuristic network"
              className="max-w-md w-full object-contain"
            />
            <img
              src="https://thumbs.dreamstime.com/b/golden-bitcoin-coins-falling-floating-dark-digital-cyberspace-futuristic-abstract-background-glowing-blue-circuit-lines-391949953.jpg"
              alt="Golden bitcoin coins floating in digital cyberspace"
              className="max-w-md w-full object-contain"
            />
            <img
              src="https://thumbs.dreamstime.com/b/featuring-floating-bitcoin-coins-amidst-vivid-background-dynamic-colorful-representation-digital-cryptocurrency-network-331328373.jpg"
              alt="Vivid floating cryptocurrency coins network background"
              className="max-w-md w-full object-contain hidden md:block"
            />
            <img
              src="https://thumbs.dreamstime.com/b/nft-crypto-blockchain-digital-token-hexagon-neon-blue-glow-technology-virtual-asset-concept-futuristic-glowing-abstract-380540832.jpg"
              alt="Neon glowing digital token hexagon blockchain abstract"
              className="max-w-md w-full object-contain hidden lg:block"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 100C120 80 240 40 360 30C480 20 600 20 720 30C840 40 960 60 1080 70C1200 80 1320 80 1380 80L1440 80V120H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900">
                Our Story
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Founded in 2024 by a team of fintech innovators frustrated with
                traditional low-yield savings, we set out to democratize
                powerful investment tools once reserved for institutions.
              </p>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Today, our platform lets anyone buy tokens and choose their
                growth path: steady compounding with 10% monthly returns or
                ambitious multiplication through our 12-month fixed plan
                delivering 3x.
              </p>
              <div className="flex items-center space-x-8 text-indigo-600">
                <div className="text-center">
                  <Zap className="h-10 w-10 mx-auto mb-2" />
                  <p className="font-semibold">Instant Access</p>
                </div>
                <div className="text-center">
                  <Globe className="h-10 w-10 mx-auto mb-2" />
                  <p className="font-semibold">Global Reach</p>
                </div>
                <div className="text-center">
                  <Lock className="h-10 w-10 mx-auto mb-2" />
                  <p className="font-semibold">Bank-Grade Security</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <img
                src="https://www.investopedia.com/thmb/khf1BMNgxlEAruTZhGEkEglIlX4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1728140476-da351a6fdb1843cd91ed7c169458b24f.jpg"
                alt="Diverse fintech team collaborating in modern office"
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
              <img
                src="https://static.wixstatic.com/media/11062b_21c5e5be7cb44166924a3bd7e5867f6f~mv2.jpg/v1/fill/w_980,h_654,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_21c5e5be7cb44166924a3bd7e5867f6f~mv2.jpg"
                alt="Cross-functional startup team working together"
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-center text-gray-900 mb-16">
            What Drives Us
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-shadow">
              <Shield className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">
                Uncompromising Security
              </h3>
              <p className="text-gray-600 mb-8">
                Built on audited blockchain infrastructure with multi-layer
                encryption and real-time monitoring.
              </p>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://plus.unsplash.com/premium_photo-1733317239304-a6bf462a2596?fm=jpg&q=80&w=1200"
                  alt="Futuristic blockchain security shield"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-shadow">
              <Users className="h-16 w-16 text-purple-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Community First</h3>
              <p className="text-gray-600 mb-8">
                We're rapidly growing with a passionate, diverse group of
                investors who share knowledge and succeed together.
              </p>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://www.addainfusion.com/wp-content/uploads/2025/01/multiracial-group-of-happy-business-seminar-attend-2024-12-13-18-19-33-utc-1024x683.jpg"
                  alt="Multiracial investor group smiling"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-shadow">
              <TrendingUp className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Sustainable Growth</h3>
              <p className="text-gray-600 mb-8">
                Transparent, high-return plans designed for long-term wealth
                building without unnecessary risk.
              </p>
              <div className="rounded-xl overflow-hidden">
                <img
                  src={image}
                  alt="Financial growth chart with upward arrow"
                  className="w-full h-64 object-fit rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-linear-to-r from-indigo-700 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Grow Your Wealth?
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
            Join thousands of smart investors already earning with us.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/sign-up"
              className="px-10 py-5 bg-white text-indigo-700 font-bold text-xl rounded-xl shadow-xl hover:bg-gray-100 transition transform hover:scale-105"
            >
              Start Investing Today
            </Link>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-10 py-5 bg-transparent border-4 border-white font-bold text-xl rounded-xl hover:bg-white hover:text-indigo-700 transition transform hover:scale-105 w-full sm:w-auto"
            >
              Back to Top
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
