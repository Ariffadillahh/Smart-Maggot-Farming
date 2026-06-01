'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [initials, setInitials] = useState('..');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.replace('/login');
            } else {
                const fullName = session.user.user_metadata?.full_name || 'User Admin';

                const nameInitials = fullName
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                setInitials(nameInitials);
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-3 md:p-8 mt-15 md:mt-0 overflow-x-hidden">
                <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-6">
                    <h2 className="md:text-xl text-base font-bold text-emerald-800">
                        Smart Maggot Farming Dashboard
                    </h2>

                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold shadow-sm">
                        {initials}
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}