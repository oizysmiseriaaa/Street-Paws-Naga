import Link from "next/link";
import Logo from "../../../components/Logo";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden relative">
      
      {/* ✨ Background & Navbar (same as homepage) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(16,185,129,0.15),transparent_60%)] animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.12),transparent_60%)] animate-[pulse_12s_ease-in-out_infinite_1.5s]"></div>
      </div>

      {/* 🔝 Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-8 py-6 bg-white/95 backdrop-blur-3xl shadow-2xl border-b border-white/70 sticky top-0">
        <Link href="/" className="hover:scale-105 transition-all">
          <Logo showText={true} size="md" />
        </Link>

{/* 📱 Mobile Menu Button + Desktop Nav */}
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
                 Get Started
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 -skew-x-12"></div>
            </button>
          </Link>
        </div>

        {/* 📱 Mobile Hamburger (Hidden on Desktop) */}
        <div className="md:hidden flex items-center space-x-4">
          <Link href="/register" className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-3xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            Get Started
          </Link>
        </div>
      </nav>

      <div className="relative z-40 pt-24 pb-24 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-24">
          
          {/* 🏅 Badge */}
          <div className="inline-flex items-center px-8 py-4 mb-12 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold text-xl rounded-3xl shadow-2xl backdrop-blur-xl border-4 border-white/30 hover:scale-110 transition-all duration-500 animate-[float_8s_ease-in-out_infinite]">
            <span className="w-4 h-4 bg-white rounded-full mr-4 animate-ping"></span>
            Our Story
          </div>

          {/* 🔥 COMPACT SINGLE LINE HERO TEXT */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight bg-gradient-to-r from-slate-900 via-emerald-600 to-teal-500 bg-clip-text text-transparent drop-shadow-3xl mb-12 tracking-tight px-4">
            About Street Paws Naga
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8">
            <div className="p-10 bg-white/90 backdrop-blur-xl rounded-4xl shadow-3xl border border-white/60 hover:shadow-4xl hover:-translate-y-4 transition-all duration-700">
              <h3 className="text-3xl lg:text-4xl font-black text-emerald-700 mb-6 flex items-center gap-4">
                🐾 <span>Our Mission</span>
              </h3>
              <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">To create a compassionate Naga community where every stray animal finds love, care, and a forever home. No paw left behind.</p>
            </div>
            <div className="p-10 bg-white/90 backdrop-blur-xl rounded-4xl shadow-3xl border border-white/60 hover:shadow-4xl hover:-translate-y-4 transition-all duration-700">
              <h3 className="text-3xl lg:text-4xl font-black text-pink-500 mb-6 flex items-center gap-4">
                ❤️ <span>Our Vision</span>
              </h3>
              <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">Streets safe for both humans and animals. Every rescue is a step toward a kinder Naga.</p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-4xl shadow-4xl animate-[pulse_4s_ease-in-out_infinite] group-hover:scale-105 transition-all duration-500"></div>
            <div className="absolute inset-8 lg:inset-12 bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl p-8 lg:p-12 flex items-center justify-center border border-emerald-200/50">
              <div className="text-center">
                <div className="text-5xl lg:text-6xl mb-6 animate-bounce">🐕‍🦺🐱</div>
                <p className="text-2xl lg:text-3xl font-black text-emerald-600 drop-shadow-xl">1,247+ Animals Saved</p>
                <p className="text-lg text-gray-600 mt-2">Since 2023</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/register" className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-16 py-8 rounded-4xl text-2xl font-black shadow-3xl hover:shadow-4xl hover:scale-110 transition-all duration-500">
            Join Our Mission 🚀
          </Link>
        </div>
      </div>

      {/* 📜 Footer */}
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
