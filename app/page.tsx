"use client";

import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Zap, Plus } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans relative overflow-hidden flex flex-col">

      <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-200/40 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-teal-100/40 blur-[100px] -z-10 pointer-events-none" />

      <nav className="fixed top-0 w-full z-50 bg-[#FAFAFA]/70 backdrop-blur-lg border-b border-gray-200/50">
        <div className="flex justify-between items-center px-8 py-5 max-w-6xl mx-auto">
          <div className="text-xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white rotate-3">
              <Leaf size={16} />
            </div>
            SMARTMAGGOT.
          </div>
          <div>

            <div>
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-800 hover:border-emerald-500 hover:text-emerald-700 font-semibold shadow-sm transition-all"
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="px-8 pt-40 pb-32 max-w-5xl mx-auto text-center relative w-full">

        <div className="absolute top-32 left-0 text-emerald-200 hidden md:block">
          <Plus size={70} />
        </div>
        <div className="absolute bottom-20 right-10 text-teal-200 hidden md:block">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.15] text-gray-900 relative">
          Ubah sampah organik <br className="hidden md:block" />
          menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 italic relative">
            emas masa depan.
            <svg className="absolute w-full h-10 -bottom-2 left-0 text-teal-200/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 0" stroke="currentColor" strokeWidth="4" fill="transparent" />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Platform monitoring budidaya maggot berbasis IoT.
          Pantau suhu, kelembapan, dan maksimalkan panen Anda dengan data yang presisi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-xl shadow-gray-200"
          >
            Mulai Monitoring
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="px-8 py-24 max-w-6xl mx-auto relative z-10 w-full">
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Dirancang untuk Efisiensi</h2>
          <p className="text-gray-500 max-w-md mx-auto">Peralatan cerdas untuk mengelola budidaya maggot Anda secara modern.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">

          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-700 transition-colors">Real-time Data</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              Pantau metrik penting seperti suhu dan kelembapan kandang langsung dari genggaman tanganmu, 24/7 tanpa henti.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <Leaf size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-teal-700 transition-colors">Siklus Optimal</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              Dapatkan estimasi waktu panen yang lebih presisi dengan perhitungan prediktif berdasarkan data saintifik historis.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-cyan-700 transition-colors">Keamanan Terjamin</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              Sistem akan mengirimkan notifikasi otomatis jika kondisi lingkungan kandang melewati batas aman yang ditentukan.
            </p>
          </div>
        </div>
      </section>

      {/* Footer minimalis */}
      <footer className="border-t border-gray-200/60 mt-auto bg-white/50 backdrop-blur-md relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center rotate-3">
              <Leaf size={12} className="text-emerald-600" />
            </div>
            <span className="font-bold text-gray-700 tracking-tight">SMARTMAGGOT.</span>
          </div>
          <p>© 2026 Dibangun dengan niat baik untuk bumi yang lebih hijau.</p>
        </div>
      </footer>
    </main>
  );
}