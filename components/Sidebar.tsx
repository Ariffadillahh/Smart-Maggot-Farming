'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Activity,
    BookOpen,
    FileText,
    Menu,
    X,
    LogOut,
    Users,
    ListChecks,
    Scale
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const { data: userData, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (userData && !error) {
                    setRole(userData.role);
                }
            }
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await supabase.auth.signOut();
        router.refresh();
        router.replace('/login');
    };

    const baseMenuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Monitoring', icon: Activity, path: '/dashboard/monitoring' },
        { name: 'Pertumbuhan', icon: Scale, path: '/dashboard/pertumbuhan' },
        { name: 'Edukasi', icon: BookOpen, path: '/dashboard/edukasi' },
        { name: 'Laporan', icon: FileText, path: '/dashboard/laporan' },
    ];

    const adminMenuItems = [
        { name: 'Manajemen User', icon: Users, path: '/dashboard/users' },
        { name: 'Manajemen Quiz', icon: ListChecks, path: '/dashboard/quiz' },
    ];

    const menuItems = role === 'admin'
        ? adminMenuItems
        : baseMenuItems;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 p-2 bg-emerald-800 text-white rounded-lg shadow-md hover:bg-emerald-700 transition-colors"
                aria-label="Buka Menu"
            >
                <Menu size={24} />
            </button>

            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-emerald-800 text-white rounded-r-3xl flex flex-col shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="p-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-800 font-bold">
                            M
                        </div>
                        <div className="font-bold text-sm leading-tight">
                            SMART MAGGOT<br />FARMING
                        </div>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-1 text-emerald-200 hover:text-white rounded-md hover:bg-emerald-700/50 transition-colors"
                        aria-label="Tutup Menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-emerald-600/50 text-white font-medium backdrop-blur-sm'
                                    : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'text-emerald-200'} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center justify-center gap-3 px-4 py-3 rounded-xl text-white bg-red-600/90 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">
                            {isLoggingOut ? 'Keluar...' : 'Logout'}
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}