"use client";

import { Activity, Leaf, Droplets, Thermometer, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis, CartesianGrid } from "recharts";

// --- TIPE DATA (INTERFACES) ---
interface LogData {
  temperature: number;
  humidity: number;
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
      <div className="bg-white/95 backdrop-blur-md p-4 border border-gray-100 rounded-2xl shadow-xl min-w-[150px]">
        <p className="text-sm font-bold text-gray-500 mb-3 border-b pb-2">{label}</p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-orange-600">
            <Thermometer size={16} />
            <span className="text-sm font-semibold">Suhu</span>
          </div>
          <span className="text-sm font-black text-orange-600">{payload[0]?.value}°C</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-600">
            <Droplets size={16} />
            <span className="text-sm font-semibold">Kelembapan</span>
          </div>
          <span className="text-sm font-black text-teal-600">{payload[1]?.value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [logs, setLogs] = useState<LogData[]>(Array.from({ length: 10 }).map(() => ({ temperature: 0, humidity: 0, time: "" })));
  const [connectionStatus, setConnectionStatus] = useState<string>("Menghubungkan...");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000/ws/sensor");

    ws.onopen = () => {
      setConnectionStatus("Aktif");
      setIsConnected(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const incomingData = JSON.parse(event.data);
        const newTemp = parseFloat(incomingData.temp);
        const newHum = parseFloat(incomingData.hum);
        const newTime = incomingData.time || "";

        if (!isNaN(newTemp) && !isNaN(newHum)) {
          setLogs((prevLogs) => {
            const newLogs = [...prevLogs];
            newLogs.shift();
            newLogs.push({ temperature: newTemp, humidity: newHum, time: newTime });
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

  // LOGIKA BARU: Perhitungan rata-rata kelembapan
  const averageHum = validLogs.length > 0 ? (validLogs.reduce((acc, curr) => acc + curr.humidity, 0) / validLogs.length).toFixed(2) : "0.00";

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
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EA580C]"></div>
                <span className="text-xs font-semibold text-gray-500">Suhu Udara (°C)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0D9488]"></div>
                <span className="text-xs font-semibold text-gray-500">Kelembapan (%)</span>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-center mt-3 md:mt-0 transition-colors ${isConnected ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
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
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* --- STATISTIK BAWAH (Sekarang 4 Kolom) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 text-orange-600">
              <Thermometer size={20} />
              <p className="text-sm font-semibold text-orange-800">Rata-rata Suhu</p>
            </div>
            <h3 className="text-3xl font-black text-orange-600">{averageTemp}°C</h3>
          </div>

          {/* KARTU BARU: RATA-RATA KELEMBAPAN */}
          <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 text-teal-600">
              <Droplets size={20} />
              <p className="text-sm font-semibold text-teal-800">Rata-rata Kelembapan</p>
            </div>
            <h3 className="text-3xl font-black text-teal-700">{averageHum}%</h3>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <Database size={20} />
              <p className="text-sm font-semibold text-blue-800">Interval Update</p>
            </div>
            <h3 className="text-3xl font-black text-blue-700">5 Detik</h3>
          </div>

          <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-colors ${isConnected ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
            <div className={`flex items-center gap-2 mb-2 ${isConnected ? "text-emerald-600" : "text-red-600"}`}>
              <Activity size={20} />
              <p className={`text-sm font-semibold ${isConnected ? "text-emerald-800" : "text-red-800"}`}>Status Koneksi</p>
            </div>
            <h3 className={`text-3xl font-black ${isConnected ? "text-emerald-700" : "text-red-700"}`}>{connectionStatus}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
