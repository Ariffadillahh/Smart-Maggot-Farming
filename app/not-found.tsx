"use client";

import { Leaf, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-teal-400/10 blur-[80px] pointer-events-none" />
            <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-12 text-center relative z-10">

                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                    <Leaf className="text-emerald-600" size={40} />
                </div>

                <h1 className="text-8xl font-black mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-400 drop-shadow-sm">
                    404
                </h1>

                <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-3">
                    Halaman Tidak Ditemukan
                </h2>

                <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                    Maaf, halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau alamat URL yang Anda masukkan salah.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-gray-600 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Kembali
                    </button>

                    <Link
                        href="/dashboard"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-200"
                    >
                        <Home size={18} />
                        Ke Dashboard
                    </Link>
                </div>

            </div>
        </div>
    );
}