"use client";

import Link from "next/link";
import Logo from "../../../components/Logo";

interface VolunteerCardProps {
  icon: string;
  title: string;
  desc: string;
  time: string;
  color: string;
}

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden relative">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(59,130,246,0.08),transparent_60%)]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-8 py-6 bg-white/95 backdrop-blur-3xl shadow-2xl border-b border-white/70 sticky top-0">
        <Link href="/" className="hover:scale-105 transition-all">
          <Logo showText={true} size="md" />
        </Link>

<div className="hidden md:flex items-center space-x-3">
          <Link href="/" className="px-5 py-3 text-lg font-bold text-gray-700 bg-white/80 rounded-3xl border hover:border-emerald-300 hover:bg-emerald-50 transition-all">
            Home
          </Link>
          <Link href="/about" className="px-5 py-3 text-lg font-bold text-gray-700 bg-white/80 rounded-3xl border hover:border-emerald-300 hover:bg-emerald-50 transition-all">
            About
          </Link>
          <Link href="/volunteer" className="px-5 py-3 text-lg font-bold text-gray-700 bg-white/80 rounded-3xl border hover:border-emerald-300 hover:bg-emerald-50 transition-all">
            Volunteer
          </Link>
          <Link href="/contact" className="px-5 py-3 text-lg font-bold text-gray-700 bg-white/80 rounded-3xl border hover:border-emerald-300 hover:bg-emerald-50 transition-all">
            Contact
          </Link>

          <Link href="/register">
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-3xl font-bold text-lg shadow-xl hover:scale-105 transition-all">
              🚀 Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-40 pt-32 pb-24 px-8 max-w-6xl mx-auto text-center">

        <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-br from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-20">
          Join Our Volunteers
        </h1>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-10 mb-24">
          <VolunteerCard
            icon="🐕"
            title="Dog Walker"
            desc="Help dogs get exercise and attention."
            time="2-3 hrs/week"
            color="from-emerald-500 to-teal-500"
          />

          <VolunteerCard
            icon="🍽️"
            title="Animal Feeder"
            desc="Prepare and serve food for animals."
            time="3-4 hrs/week"
            color="from-orange-500 to-amber-500"
          />

          <VolunteerCard
            icon="📸"
            title="Social Media"
            desc="Help promote adoption online."
            time="5-7 hrs/week"
            color="from-pink-500 to-rose-500"
          />
        </div>

        {/* CTA */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-16 shadow-xl">
          <h2 className="text-4xl font-black mb-6">
            Ready to help animals?
          </h2>

          <p className="text-lg mb-10">
            No experience needed. Training provided.
          </p>

<a
            href="https://docs.google.com/forms/d/e/1FAIpQLScitRFSJXGrx0fNfmTiKF_AMp12AQ6k06wc62V_LndtTHSUNA/viewform?pli=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-14 py-6 rounded-3xl text-xl font-bold hover:scale-105 transition-all"
          >
            Sign Up Now
          </a>
        </div>
      </div>

      {/* Footer */}
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

/* Card Component */
function VolunteerCard({
  icon,
  title,
  desc,
  time,
}: VolunteerCardProps) {
  return (
    <div className="p-10 rounded-3xl bg-white/90 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">

      <div className="text-6xl mb-6">{icon}</div>

      <h3 className="text-2xl font-bold mb-4">{title}</h3>

      <p className="text-gray-600 mb-6">{desc}</p>

      <div className="flex justify-between items-center border-t pt-4">
        <span className="font-bold text-emerald-600">{time}</span>
        <span className="text-xl">⭐</span>
      </div>
    </div>
  );
}