'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                // Redirect sesuai role
                if (userData?.role === 'admin') {
                    router.replace('/dashboard/users');
                } else {
                    router.replace('/dashboard');
                }
            } else {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setErrorMsg(authError.message);
            setLoading(false);
        } else if (authData.user) {
            const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', authData.user.id)
                .single();

            if (userData?.role === 'admin') {
                router.push('/dashboard/users');
            } else {
                router.push('/dashboard');
            }
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex w-full bg-white font-sans">
            <div className="hidden lg:flex w-1/2 bg-emerald-900 relative overflow-hidden flex-col justify-between p-12 lg:p-16 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/40 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-teal-400/30 blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                        <Leaf className="text-emerald-300" size={20} />
                    </div>
                    <span className="font-bold tracking-widest text-sm text-emerald-50">SMARTMAGGOT.</span>
                </div>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl lg:text-5xl font-black leading-[1.2] mb-6">
                        Ubah limbah menjadi <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-300">emas masa depan.</span>
                    </h1>
                    <p className="text-emerald-100/80 text-lg leading-relaxed">
                        Pantau suhu, kelembapan, dan optimalkan siklus budidaya maggot Anda dengan presisi tinggi melalui platform IoT kami.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-gray-50/50">
                <div className="absolute top-8 left-8 flex lg:hidden items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                        <Leaf size={16} />
                    </div>
                    <span className="font-bold tracking-tight text-gray-900">SMARTMAGGOT.</span>
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-gray-900 mb-3">Selamat Datang</h2>
                        <p className="text-gray-500 font-medium">Masuk ke akun Anda untuk mulai memantau kandang maggot.</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-xl text-sm font-semibold border bg-red-50 text-red-600 border-red-100">
                            {errorMsg === 'Invalid login credentials'
                                ? 'Email atau password salah.'
                                : errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block">Email</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Masukkan email Anda"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-gray-700 block">Password</label>
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-gray-800 tracking-wider placeholder:tracking-normal placeholder:text-gray-400 placeholder:font-normal"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-gray-200 disabled:opacity-70 disabled:hover:bg-gray-900 mt-2"
                        >
                            {loading ? 'Memeriksa Kredensial...' : (
                                <>
                                    Masuk ke Dashboard
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center lg:text-left">
                        <p className="text-sm text-gray-500 font-medium">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-emerald-600 font-bold hover:underline">Daftar di sini</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}