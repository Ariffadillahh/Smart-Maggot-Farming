'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Activity, BookOpen, FileText, Menu, X, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Monitoring', icon: Activity, path: '/dashboard/monitoring' },
        { name: 'Edukasi', icon: BookOpen, path: '/dashboard/edukasi' },
        { name: 'Laporan', icon: FileText, path: '/dashboard/laporan' },
    ];

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        console.log("Logout diklik");

        setTimeout(() => {
            router.push('/login');
        }, 1000);
    };

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
                        className="flex w-full items-center justify-center gap-3 px-4 py-3 rounded-xl text-white bg-red-600 cursor-pointer"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}