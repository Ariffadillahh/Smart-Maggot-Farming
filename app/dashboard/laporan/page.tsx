"use client";

import { useState } from "react";
import { FileText, Download, Filter, AlertCircle, CheckCircle2 } from "lucide-react";

type ReportData = {
    id: string;
    date: string;
    temperature: number;
    humidity: number;
    status: "Optimal" | "Perlu Perhatian";
};

const dummyReportData: ReportData[] = [
    { id: "LOG-001", date: "26 Mei 2026, 08:00", temperature: 28, humidity: 65, status: "Optimal" },
    { id: "LOG-002", date: "26 Mei 2026, 04:00", temperature: 26, humidity: 70, status: "Optimal" },
    { id: "LOG-003", date: "26 Mei 2026, 00:00", temperature: 24, humidity: 75, status: "Perlu Perhatian" },
    { id: "LOG-004", date: "25 Mei 2026, 20:00", temperature: 29, humidity: 60, status: "Optimal" },
    { id: "LOG-005", date: "25 Mei 2026, 16:00", temperature: 31, humidity: 55, status: "Perlu Perhatian" },
];

export default function LaporanDashboard() {
    const [data] = useState<ReportData[]>(dummyReportData);

    return (
        <div className="p-6 bg-white min-h-screen rounded-xl border border-gray-100 shadow-lg">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                            <FileText className="text-emerald-600" /> Laporan Monitoring
                        </h1>
                        <p className="text-gray-500 mt-1">Rekapitulasi data sensor harian budidaya maggot</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                        <Download size={18} /> Export PDF
                    </button>
                </div>

                {/* Container Tabel dengan Scroll X */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg text-gray-700">Riwayat Sensor</h2>
                        <button className="text-gray-400 hover:text-emerald-600 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>

                    {/* Wrapper untuk scroll horizontal */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm">
                                    <th className="px-6 py-4">ID Log</th>
                                    <th className="px-6 py-4">Waktu</th>
                                    <th className="px-6 py-4">Suhu</th>
                                    <th className="px-6 py-4">Kelembapan</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((item) => (
                                    <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{item.id}</td>
                                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{item.date}</td>
                                        <td className="px-6 py-4 font-semibold text-emerald-700 whitespace-nowrap">{item.temperature}°C</td>
                                        <td className="px-6 py-4 font-semibold text-cyan-700 whitespace-nowrap">{item.humidity}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${item.status === "Optimal"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                                }`}>
                                                {item.status === "Optimal" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}