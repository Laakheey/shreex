import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#020617] text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Grow Your Finances with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                High-Yield Tokens
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
              Register today, buy tokens, and choose flexible plans: earn{" "}
              <span className="text-white font-semibold underline decoration-yellow-500/50">
                10% monthly
              </span>{" "}
              returns, get{" "}
              <span className="text-white font-semibold underline decoration-yellow-500/50">
                1.75x your investment
              </span>{" "}
              in 6 months or get{" "}
              <span className="text-white font-semibold underline decoration-yellow-500/50">
                3x your investment
              </span>{" "}
              in 12 months.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-white text-indigo-950 font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-yellow-300 transition-all transform hover:-translate-y-1"
              >
                Get Started Now
              </Link>
              <Link
                href="/sign-in"
                className="px-8 py-4 bg-transparent border border-slate-500 font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>

            <div className="flex gap-10 pt-4 border-t border-slate-800">
              {[
                { value: "10%", label: "Monthly ROI" },
                { value: "1.75x", label: "6 Months ROI" },
                { value: "3X", label: "1 Year Plan" },
                { value: "100%", label: "Secure" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-tighter">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <video
                src="/assets/videos/homepage.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
