import { Shield, Users, TrendingUp, Zap, Globe, Lock } from "lucide-react";
import Link from "next/link";

export function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white py-24 md:py-40 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              Empowering Everyday Investors
            </h2>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
              We&apos;re a forward-thinking startup revolutionizing access to
              high-yield opportunities through secure token-based investments.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none">
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
                src="/assets/financial growth.jpg"
                alt="Financial growth"
                className="rounded-2xl shadow-lg col-span-2"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Secure",
                desc: "Industry-leading security protocols protect your investments 24/7.",
              },
              {
                icon: TrendingUp,
                title: "High Returns",
                desc: "Earn up to 3x returns with our optimized investment strategies.",
              },
              {
                icon: Users,
                title: "Community",
                desc: "Join thousands of investors growing their wealth together.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center"
              >
                <item.icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Growing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join today and start earning high-yield returns on your investments.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-10 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-lg hover:bg-yellow-300 hover:text-indigo-900 transition-all transform hover:-translate-y-1"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
