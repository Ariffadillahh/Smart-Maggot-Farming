"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Scale, Save, History, CalendarDays, Loader2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

interface GrowthLog {
    id: string;
    log_date: string;
    feed_weight: number;
    maggot_weight: number;
}

export default function GrowthLogsPage() {
    const [logs, setLogs] = useState<GrowthLog[]>([]);
    const [feedWeight, setFeedWeight] = useState("");
    const [maggotWeight, setMaggotWeight] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [hasTodayLog, setHasTodayLog] = useState(false);

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from("growth_logs")
                .select("*")
                .order("log_date", { ascending: false });

            if (error) throw error;
            setLogs(data || []);

            const today = new Date().toISOString().split('T')[0];
            const todayLog = data?.find(log => log.log_date === today);

            if (todayLog) {
                setFeedWeight(todayLog.feed_weight.toString());
                setMaggotWeight(todayLog.maggot_weight.toString());
                setHasTodayLog(true);
            } else {
                setHasTodayLog(false);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const toastId = toast.loading("Memproses data...");
        setIsSaving(true);

        const today = new Date().toISOString().split('T')[0];

        try {
            const { error } = await supabase
                .from("growth_logs")
                .upsert(
                    {
                        log_date: today,
                        feed_weight: parseFloat(feedWeight) || 0,
                        maggot_weight: parseFloat(maggotWeight) || 0,
                    },
                    { onConflict: 'log_date' }
                );

            if (error) throw error;

            await fetchLogs();

            toast.success(
                hasTodayLog ? "Data hari ini berhasil diupdate!" : "Data hari ini berhasil disimpan!",
                { id: toastId } 
            );

        } catch (error) {
            console.error("Error saving log:", error);
            toast.error("Gagal menyimpan data.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 ">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-emerald-900 flex items-center gap-3">
                    <Scale className="text-emerald-600" />
                    Log Pertumbuhan Harian
                </h1>
                <p className="text-gray-500 text-sm mt-1">Catat berat pakan dan berat maggot setiap harinya.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sticky top-8">
                        <div className="flex items-center gap-2 mb-6">
                            <CalendarDays className="text-emerald-600" size={20} />
                            <h2 className="text-lg font-bold text-gray-800">
                                Input Data Hari Ini
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Berat Pakan (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={feedWeight}
                                    onChange={(e) => setFeedWeight(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-black"
                                    placeholder="Contoh: 5.5"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Berat Maggot (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={maggotWeight}
                                    onChange={(e) => setMaggotWeight(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-black"
                                    placeholder="Contoh: 2.1"
                                    required
                                />
                            </div>

                            {/* TOMBOL BERUBAH DINAMIS */}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`w-full py-3 flex items-center justify-center gap-2 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-70 mt-4 shadow-md ${hasTodayLog
                                    ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                                    }`}
                            >
                                {isSaving ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : hasTodayLog ? (
                                    <Pencil size={20} />
                                ) : (
                                    <Save size={20} />
                                )}

                                {isSaving
                                    ? "Memproses..."
                                    : hasTodayLog
                                        ? "Update Data Hari Ini"
                                        : "Simpan Data Hari Ini"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <History className="text-gray-500" size={20} />
                            <h2 className="text-lg font-bold text-gray-800">Histori Catatan</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        <th className="py-4 px-4 text-sm font-bold text-gray-500">Tanggal</th>
                                        <th className="py-4 px-4 text-sm font-bold text-gray-500">Pakan (kg)</th>
                                        <th className="py-4 px-4 text-sm font-bold text-gray-500">Maggot (kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-gray-400">
                                                Belum ada data log pertumbuhan.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4 font-medium text-gray-700">
                                                    {new Date(log.log_date).toLocaleDateString("id-ID", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </td>
                                                <td className="py-4 px-4 text-amber-600 font-semibold">{log.feed_weight} kg</td>
                                                <td className="py-4 px-4 text-orange-600 font-semibold">{log.maggot_weight} kg</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}