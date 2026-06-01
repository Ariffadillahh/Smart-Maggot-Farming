'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, ShieldAlert, Mail } from 'lucide-react';
import { useRoleGuard } from '@/hooks/useRoleGuard';

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isGuardLoading = useRoleGuard('admin');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setUsers(data);
        setLoading(false);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`Ubah hak akses pengguna ini menjadi ${newRole.toUpperCase()}?`)) return;

        const { error } = await supabase
            .from('users')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            alert('Gagal mengubah role: ' + error.message);
        } else {
            fetchUsers();
        }
    };

    if (isGuardLoading || loading) {
        return <div className="p-10 text-center font-medium text-gray-500">Memuat data pengguna...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[70vh]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Manajemen Pengguna</h3>
                        <p className="text-sm text-gray-500">Atur hak akses pengguna platform.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 p-3 rounded-xl text-xs font-medium border border-amber-200 max-w-xs">
                    <ShieldAlert size={20} className="shrink-0" />
                    <p>Pembuatan dan penghapusan akun dilakukan secara otomatis melalui fitur Registrasi aplikasi.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                            <th className="p-4 font-bold rounded-tl-xl">Nama Lengkap</th>
                            <th className="p-4 font-bold">Email</th>
                            <th className="p-4 font-bold">Tanggal Bergabung</th>
                            <th className="p-4 font-bold rounded-tr-xl">Hak Akses (Role)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 font-semibold text-gray-800">
                                    {user.full_name}
                                </td>
                                <td className="p-4 text-gray-600 flex items-center gap-2">
                                    <Mail size={14} className="text-gray-400" />
                                    {user.email}
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </td>
                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className={`text-sm font-bold p-2 rounded-lg outline-none cursor-pointer border ${user.role === 'admin'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : 'bg-gray-100 text-gray-700 border-gray-200'
                                            }`}
                                    >
                                        <option value="user">User Biasa</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}