"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Filter, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ReportData = {
  id: string;
  date: string;
  temperature: number;
  humidity: number;
  media_moisture: number; // Tambahan tipe data baru
  status: "Optimal" | "Perlu Perhatian";
};

export default function LaporanDashboard() {
  const [data, setData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- MENGAMBIL DATA DARI SUPABASE ---
  useEffect(() => {
    const fetchLaporan = async () => {
      setIsLoading(true);

      const { data: rawData, error } = await supabase.from("sensor_logs").select("*").order("created_at", { ascending: false }).limit(50);

      if (error) {
        console.error("Gagal mengambil data dari Supabase:", error.message);
      } else if (rawData) {
        const formattedData: ReportData[] = rawData.map((log: any) => {
          const dateObj = new Date(log.created_at);
          const formattedDate =
            dateObj.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }) +
            ", " +
            dateObj.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

          return {
            id: `LOG-${log.id.toString().padStart(3, "0")}`,
            date: formattedDate,
            temperature: log.temperature,
            humidity: log.humidity,
            media_moisture: log.media_moisture, // Memasukkan data kelembapan media
            status: log.temperature > 33 ? "Perlu Perhatian" : "Optimal",
          };
        });

        setData(formattedData);
      }

      setIsLoading(false);
    };

    fetchLaporan();
  }, []);

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

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-700">Riwayat Sensor</h2>
            <button className="text-gray-400 hover:text-emerald-600 transition-colors">
              <Filter size={20} />
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="px-6 py-4">ID Log</th>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Suhu</th>
                  <th className="px-6 py-4">K. Udara</th> {/* Disingkat agar tabel tidak terlalu lebar */}
                  <th className="px-6 py-4">K. Media</th> {/* Kolom baru */}
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-emerald-500" size={32} />
                        <p>Mengambil data dari cloud...</p>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Belum ada data sensor yang tersimpan.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{item.id}</td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{item.date}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-700 whitespace-nowrap">{item.temperature}°C</td>
                      <td className="px-6 py-4 font-semibold text-cyan-700 whitespace-nowrap">{item.humidity}%</td>
                      {/* Sel tabel untuk kelembapan media dengan warna berbeda agar mudah dibedakan */}
                      <td className="px-6 py-4 font-semibold text-amber-700 whitespace-nowrap">{item.media_moisture}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${item.status === "Optimal" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {item.status === "Optimal" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
