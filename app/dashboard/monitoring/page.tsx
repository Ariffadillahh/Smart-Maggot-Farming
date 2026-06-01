"use client";

import { Activity, Leaf, Droplets, Thermometer, Database, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis, CartesianGrid } from "recharts";

// --- TIPE DATA (INTERFACES) ---
interface LogData {
  temperature: number;
  humidity: number;
  media_moisture: number; // Tambahan metrik baru
  time: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

// --- CUSTOM TOOLTIP UNTUK RECHARTS ---
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-gray-100 rounded-2xl shadow-xl min-w-[170px]">
        <p className="text-sm font-bold text-gray-500 mb-3 border-b pb-2">{label}</p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-orange-600">
            <Thermometer size={16} />
            <span className="text-sm font-semibold">Suhu Udara</span>
          </div>
          <span className="text-sm font-black text-orange-600">{payload[0]?.value}°C</span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-teal-600">
            <Droplets size={16} />
            <span className="text-sm font-semibold">K. Udara</span>
          </div>
          <span className="text-sm font-black text-teal-600">{payload[1]?.value}%</span>
        </div>

        {/* Baris baru untuk Kelembapan Media */}
        {payload[2] && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600">
              <Layers size={16} />
              <span className="text-sm font-semibold">K. Media</span>
            </div>
            <span className="text-sm font-black text-amber-600">{payload[2]?.value}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  // Menggunakan array kosong agar grafik merender dengan mulus dari awal
  const [logs, setLogs] = useState<LogData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>("Menghubungkan...");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Gunakan wss:// dan domain saat diproduksi nanti
    const ws = new WebSocket(process.env.NEXT_PUBLIC_MAGGOT_WEBSOCKET_URL as string);

    ws.onopen = () => {
      setConnectionStatus("Aktif");
      setIsConnected(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const incomingData = JSON.parse(event.data);
        const newTemp = parseFloat(incomingData.temp);
        const newHum = parseFloat(incomingData.hum);
        const newMedia = parseFloat(incomingData.media_moisture); // Menangkap data media
        const newTime = incomingData.time || "";

        if (!isNaN(newTemp) && !isNaN(newHum) && !isNaN(newMedia)) {
          setLogs((prevLogs) => {
            const newLogs = [...prevLogs, { temperature: newTemp, humidity: newHum, media_moisture: newMedia, time: newTime }];
            // Batasi jumlah titik grafik agar tidak terlalu padat (misal 15 titik terakhir)
            if (newLogs.length > 15) {
              newLogs.shift();
            }
            return newLogs;
          });
        }
      } catch (error) {
        console.error("Gagal memproses data dari WebSocket", error);
      }
    };

    ws.onclose = () => {
      setConnectionStatus("Terputus");
      setIsConnected(false);
    };

    ws.onerror = (error: Event) => {
      console.error("WebSocket Error: ", error);
      setConnectionStatus("Error Koneksi");
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // --- STATISTIK ---
  const validLogs = logs.filter((item) => item.temperature > 0 || item.humidity > 0);

  const averageTemp = validLogs.length > 0 ? (validLogs.reduce((acc, curr) => acc + curr.temperature, 0) / validLogs.length).toFixed(2) : "0.00";
  const averageHum = validLogs.length > 0 ? (validLogs.reduce((acc, curr) => acc + curr.humidity, 0) / validLogs.length).toFixed(2) : "0.00";
  const averageMedia = validLogs.length > 0 ? (validLogs.reduce((acc, curr) => acc + curr.media_moisture, 0) / validLogs.length).toFixed(0) : "0";

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
            <Leaf className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black text-emerald-900">Smart Maggot Farming</h1>
            <p className="text-gray-500 text-sm">Monitoring Sensor Realtime</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-5">
        <div className="md:flex md:items-center md:justify-between mb-10">
          <div>
            <h2 className="text-2xl font-black text-gray-800">Grafik Parameter Kandang</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EA580C]"></div>
                <span className="text-xs font-semibold text-gray-500">Suhu Udara (°C)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0D9488]"></div>
                <span className="text-xs font-semibold text-gray-500">K. Udara (%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D97706]"></div>
                <span className="text-xs font-semibold text-gray-500">K. Media (%)</span>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-center mt-4 md:mt-0 transition-colors ${isConnected ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            <Activity size={16} className={isConnected ? "animate-pulse" : ""} />
            {isConnected ? "LIVE DATA" : "OFFLINE"}
          </div>
        </div>

        {/* --- AREA RECHARTS --- */}
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isConnected ? "#EA580C" : "#9CA3AF"} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={isConnected ? "#EA580C" : "#9CA3AF"} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isConnected ? "#0D9488" : "#9CA3AF"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isConnected ? "#0D9488" : "#9CA3AF"} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMedia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isConnected ? "#D97706" : "#9CA3AF"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isConnected ? "#D97706" : "#9CA3AF"} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />

              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF", fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF", fontWeight: 600 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#9CA3AF", strokeWidth: 1, strokeDasharray: "5 5" }} />

              <Area
                type="monotone"
                dataKey="temperature"
                stroke={isConnected ? "#EA580C" : "#9CA3AF"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
                isAnimationActive={false}
                dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF", stroke: isConnected ? "#EA580C" : "#9CA3AF" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#EA580C" }}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke={isConnected ? "#0D9488" : "#9CA3AF"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorHum)"
                isAnimationActive={false}
                dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF", stroke: isConnected ? "#0D9488" : "#9CA3AF" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#0D9488" }}
              />
              <Area
                type="monotone"
                dataKey="media_moisture"
                stroke={isConnected ? "#D97706" : "#9CA3AF"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorMedia)"
                isAnimationActive={false}
                dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF", stroke: isConnected ? "#D97706" : "#9CA3AF" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#D97706" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* --- STATISTIK BAWAH (Sekarang 5 Kolom) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-orange-600">
              <Thermometer size={18} />
              <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">Rata Suhu</p>
            </div>
            <h3 className="text-2xl font-black text-orange-600">{averageTemp}°C</h3>
          </div>

          <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-teal-600">
              <Droplets size={18} />
              <p className="text-xs font-bold text-teal-800 uppercase tracking-wide">Rata Kelembapan Udara</p>
            </div>
            <h3 className="text-2xl font-black text-teal-700">{averageHum}%</h3>
          </div>

          {/* KARTU BARU: RATA-RATA KELEMBAPAN MEDIA */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-amber-600">
              <Layers size={18} />
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Rata Kelembapan Media</p>
            </div>
            <h3 className="text-2xl font-black text-amber-700">{averageMedia}%</h3>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <Database size={18} />
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Update</p>
            </div>
            <h3 className="text-2xl font-black text-blue-700">5 Detik</h3>
          </div>

          <div className={`rounded-2xl p-4 border flex flex-col justify-between shadow-sm transition-colors ${isConnected ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
            <div className={`flex items-center gap-2 mb-2 ${isConnected ? "text-emerald-600" : "text-red-600"}`}>
              <Activity size={18} />
              <p className={`text-xs font-bold uppercase tracking-wide ${isConnected ? "text-emerald-800" : "text-red-800"}`}>Koneksi</p>
            </div>
            <h3 className={`text-2xl font-black ${isConnected ? "text-emerald-700" : "text-red-700"}`}>{connectionStatus}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
