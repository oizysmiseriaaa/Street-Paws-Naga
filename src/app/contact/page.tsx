import Link from "next/link";
import Logo from "../../../components/Logo";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden relative">
      
      {/* ✨ Background & Navbar */}
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

      <div className="relative z-40 pt-24 pb-24 px-8 max-w-5xl mx-auto">
        <div className="text-center mb-24">
          
          {/* 🏅 Badge */}
          <div className="inline-flex items-center px-8 py-4 mb-12 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold text-xl rounded-3xl shadow-2xl backdrop-blur-xl border-4 border-white/30 hover:scale-110 transition-all duration-500 animate-[float_8s_ease-in-out_infinite]">
            <span className="w-4 h-4 bg-white rounded-full mr-4 animate-ping"></span>
            We're Here to Help
          </div>

          {/* 🔥 COMPACT SINGLE LINE HERO TEXT */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-3xl mb-12 tracking-tight px-4">
            Get In Touch
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <div className="space-y-8">
            <div className="p-10 bg-white/90 backdrop-blur-xl rounded-4xl shadow-3xl border border-white/60 hover:shadow-4xl hover:-translate-y-4 transition-all duration-700">
              <div className="text-5xl mb-6 animate-bounce">📍</div>
              <h3 className="text-3xl lg:text-4xl font-black text-emerald-700 mb-6">Come Visit Us</h3>
              <div className="space-y-2">
                <p className="text-xl lg:text-2xl text-gray-700 font-semibold">Street Paws Naga</p>
                <p className="text-xl lg:text-2xl text-gray-700">Naga City 4400</p>
              </div>
            </div>
            <div className="p-10 bg-white/90 backdrop-blur-xl rounded-4xl shadow-3xl border border-white/60 hover:shadow-4xl hover:-translate-y-4 transition-all duration-700">
              <div className="text-5xl mb-6 animate-pulse">📞</div>
              <h3 className="text-3xl lg:text-4xl font-black text-pink-500 mb-6">Call Us</h3>
              <div className="space-y-2">
                <p className="text-xl lg:text-2xl text-gray-700 font-semibold">09944159476</p>
                <p className="text-lg lg:text-xl text-emerald-600 font-bold">Mon-Sat: 2AM -4AM</p>
              </div>
            </div>
          </div>
          
          <div className="p-10 bg-white/90 backdrop-blur-xl rounded-4xl shadow-3xl border border-white/60">
            <h3 className="text-3xl lg:text-4xl font-black text-gray-800 mb-10 text-center">📧 Send Message</h3>
            <form className="space-y-6">
              <input type="text" placeholder="Your Name *" className="w-full p-6 text-xl border-2 border-gray-200 rounded-3xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all shadow-xl placeholder-gray-400" required />
              <input type="email" placeholder="your@email.com *" className="w-full p-6 text-xl border-2 border-gray-200 rounded-3xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all shadow-xl placeholder-gray-400" required />
              <textarea rows={5} placeholder="Tell us how we can help..." className="w-full p-6 text-xl border-2 border-gray-200 rounded-3xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 transition-all shadow-xl resize-vertical placeholder-gray-400"></textarea>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-6 px-12 rounded-3xl text-2xl font-black shadow-3xl hover:shadow-4xl hover:scale-105 transition-all duration-500">
                Send Message 🚀
              </button>
            </form>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Response within 24 hours • Weekdays 9AM-5PM
          </p>
        </div>
      </div>

      {/* 📜 Footer */}
    <footer className="relative z-50 bg-white/95 backdrop-blur-3xl border-t-4 border-emerald-100/50 shadow-2xl py-14 px-6 lg:px-12">

  <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">

    {/* Logo */}
    <div className="flex justify-center">
      <Logo showText={true} size="lg" />
    </div>

    {/* Facebook button */}
    <a
      href="https://www.facebook.com/profile.php?id=61556021032482"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      Follow us on Facebook
    </a>

    {/* Bottom text */}
    <p className="text-center text-sm sm:text-base text-gray-600 font-semibold px-2">
      © 2026 Street Paws Naga. Every paw deserves a home.{" "}
      <span className="text-rose-500 text-xl">❤️</span>
    </p>

        </div>
      </footer>
      </div>
  );
}
