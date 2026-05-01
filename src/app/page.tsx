import Link from "next/link";
import Logo from "../../components/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(16,185,129,0.15),transparent_60%)] animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.12),transparent_60%)] animate-[pulse_12s_ease-in-out_infinite_1.5s]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(59,130,246,0.08),transparent_60%)] animate-[pulse_14s_ease-in-out_infinite_3s]"></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-32 left-16 w-14 h-14 bg-gradient-to-r from-emerald-400/50 to-teal-400/50 backdrop-blur-xl rounded-2xl shadow-2xl animate-[bounce_6s_ease-in-out_infinite_0.1s]"></div>
        <div className="absolute top-2/3 right-24 w-16 h-16 bg-gradient-to-r from-rose-400/40 to-pink-400/40 backdrop-blur-xl rounded-2xl shadow-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-28 left-1/3 w-12 h-12 bg-gradient-to-r from-amber-400/50 to-orange-400/50 backdrop-blur-xl rounded-2xl shadow-2xl animate-[float_8s_ease-in-out_infinite_1.4s]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-8 py-6 bg-white/95 backdrop-blur-3xl shadow-2xl border-b border-white/70 sticky top-0">
        <Link href="/" className="hover:scale-105 transition-all">
          <Logo showText={true} size="md" />
        </Link>

<div className="hidden md:flex items-center space-x-3">
          <Link href="/" className="px-5 py-3 text-lg font-bold text-gray-700 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-xl transition-all duration-300 shadow-lg">
            Home
          </Link>
          <Link href="/about" className="px-5 py-3 text-lg font-bold text-gray-700 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-xl transition-all duration-300 shadow-lg">
            About
          </Link>
          <Link href="/volunteer" className="px-5 py-3 text-lg font-bold text-gray-700 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-xl transition-all duration-300 shadow-lg">
            Volunteer
          </Link>
          <Link href="/contact" className="px-5 py-3 text-lg font-bold text-gray-700 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-xl transition-all duration-300 shadow-lg">
            Contact
          </Link>
          <Link href="/register">
            <button className="group relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-400 overflow-hidden border border-white/30 backdrop-blur-xl">
              <span className="relative z-10 flex items-center space-x-2">
                🚀 Get Started
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </Link>
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <Link href="/register" className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-3xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-40 flex flex-1 items-center justify-center px-8 py-20">
        <div className="text-center max-w-5xl mx-auto">
          
          <div className="inline-flex items-center px-8 py-4 mb-12 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white font-bold text-xl rounded-3xl shadow-2xl backdrop-blur-xl border-4 border-white/30 hover:scale-110 transition-all duration-500 animate-[float_8s_ease-in-out_infinite]">
            <div className="w-4 h-4 bg-white rounded-full mr-4 animate-ping"></div>
            <span>Making Streets Safer for Every Paw</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight bg-gradient-to-r from-slate-900 via-emerald-600 to-teal-500 bg-clip-text text-transparent drop-shadow-3xl mb-12 tracking-tight px-4">
            Rescue • Love • Home
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-16 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-lg px-4">
            Street Paws Naga - Your community-powered platform to track, rescue, and rehome stray animals in Naga.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 px-4">
            <Link href="/register">
              <button className="group relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-14 py-7 rounded-4xl text-xl font-black shadow-3xl hover:shadow-4xl hover:scale-110 active:scale-105 transition-all duration-500 max-w-max mx-auto sm:mx-0 overflow-hidden border-4 border-white/30 backdrop-blur-xl">
                <span className="relative z-10 flex items-center space-x-3">
                  Start Rescuing
                  <svg className="w-7 h-7 group-hover:translate-x-3 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
            
            <Link href="/about">
              <button className="px-14 py-7 text-xl font-black text-gray-800 bg-white/90 backdrop-blur-3xl rounded-4xl border-4 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/90 hover:shadow-3xl hover:scale-110 transition-all duration-400 shadow-2xl">
                Learn More
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StatCard number="1,247+" label="Animals Rescued" icon="🐾" />
            <StatCard number="847+" label="Forever Homes" icon="🏠" />
            <StatCard number="324+" label="Volunteers" icon="❤️" />
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-emerald-100 via-teal-50 to-transparent z-20"></div>
      
      {/* Footer */}
      <footer className="relative z-50 bg-white/95 backdrop-blur-3xl border-t-4 border-emerald-100/50 shadow-2xl py-16 px-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col items-center gap-12 mb-12">
            <Logo showText={true} size="lg" />
            
            <div className="flex justify-center">
              <a
                href="https://www.facebook.com/profile.php?id=61556021032482"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Follow us on Facebook
              </a>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 font-semibold">
            © 2026 Street Paws Naga. Every paw deserves a home. ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}

// StatCard Component
function StatCard({ number, label, icon }: {
  number: string;
  label: string;
  icon: string;
}) {
  return (
    <div className="group relative p-8 rounded-3xl shadow-2xl border-4 border-white/60 bg-white/90 backdrop-blur-3xl hover:shadow-3xl hover:-translate-y-4 hover:scale-105 transition-all duration-500 overflow-hidden cursor-default hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50">
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500 opacity-95">{icon}</div>
      <p className="text-lg font-bold text-gray-600 uppercase tracking-wider mb-3 group-hover:text-emerald-600 transition-colors">{label}</p>
      <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-xl group-hover:scale-110 transition-all duration-500">
        {number}
      </div>
    </div>
  );
}

