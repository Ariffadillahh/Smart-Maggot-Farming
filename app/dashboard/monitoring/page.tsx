"use client";

import { Activity, Leaf, Droplets, Thermometer, Database, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis, CartesianGrid } from "recharts";

interface LogData {
  temperature: number;
  humidity: number;
  media_moisture: number;
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
  const [logs, setLogs] = useState<LogData[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    const ws = new WebSocket(process.env.NEXT_PUBLIC_MAGGOT_WEBSOCKET_URL as string);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const incomingData = JSON.parse(event.data);
        const newTemp = parseFloat(incomingData.temp);
        const newHum = parseFloat(incomingData.hum);
        const newMedia = parseFloat(incomingData.media_moisture);
        const newTime = incomingData.time || "";

        if (!isNaN(newTemp) && !isNaN(newHum) && !isNaN(newMedia)) {
          setLogs((prevLogs) => {
            const newLogs = [...prevLogs, { temperature: newTemp, humidity: newHum, media_moisture: newMedia, time: newTime }];
            if (newLogs.length > 15) {
              newLogs.shift();
            }
            return newLogs;
          });

          setIsLoading(false);
          clearTimeout(loadingTimeout);
        }
      } catch (error) {
        console.error("Gagal memproses data dari WebSocket", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsLoading(false);
    };

    ws.onerror = (error: Event) => {
      console.error("WebSocket Error: ", error);
      setIsConnected(false);
      setIsLoading(false);
    };

    return () => {
      clearTimeout(loadingTimeout);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 animate-pulse shadow-lg" />
            <div>
              <div className="h-8 w-56 bg-gray-200 rounded-md animate-pulse mb-2" />
              <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-5">
          <div className="md:flex md:items-center md:justify-between mb-10">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-3" />
              <div className="flex flex-wrap gap-4 mt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse mt-4 md:mt-0" />
          </div>

          <div className="w-full h-[300px] bg-gray-100 rounded-2xl animate-pulse" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-4 border border-gray-200 flex flex-col justify-between shadow-sm animate-pulse h-[104px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-gray-200" />
                  <div className="h-3 w-20 bg-gray-200 rounded-md" />
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const validLogs = logs.filter((item) => item.temperature > 0 || item.humidity > 0);
  const hasData = validLogs.length > 0;
  const isActuallyActive = isConnected && hasData;

  const averageTemp = hasData ? (validLogs.reduce((acc, curr) => acc + curr.temperature, 0) / validLogs.length).toFixed(2) : "--";
  const averageHum = hasData ? (validLogs.reduce((acc, curr) => acc + curr.humidity, 0) / validLogs.length).toFixed(2) : "--";
  const averageMedia = hasData ? (validLogs.reduce((acc, curr) => acc + curr.media_moisture, 0) / validLogs.length).toFixed(0) : "--";

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

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-center mt-4 md:mt-0 transition-colors ${!isConnected ? "bg-red-100 text-red-700" : (!hasData ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}`}>
            <Activity size={16} className={isActuallyActive ? "animate-pulse" : ""} />
            {!isConnected ? "OFFLINE" : (!hasData ? "STANDBY" : "LIVE DATA")}
          </div>
        </div>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isActuallyActive ? "#EA580C" : "#9CA3AF"} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={isActuallyActive ? "#EA580C" : "#9CA3AF"} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isActuallyActive ? "#0D9488" : "#9CA3AF"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isActuallyActive ? "#0D9488" : "#9CA3AF"} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMedia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isActuallyActive ? "#D97706" : "#9CA3AF"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isActuallyActive ? "#D97706" : "#9CA3AF"} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />

              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF", fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF", fontWeight: 600 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#9CA3AF", strokeWidth: 1, strokeDasharray: "5 5" }} />

              <Area
                type="monotone"
                dataKey="temperature"
                stroke={isActuallyActive ? "#EA580C" : "#9CA3AF"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
                isAnimationActive={false}
                dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF", stroke: isActuallyActive ? "#EA580C" : "#9CA3AF" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#EA580C" }}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke={isActuallyActive ? "#0D9488" : "#9CA3AF"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorHum)"
                isAnimationActive={false}
                dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF", stroke: isActuallyActive ? "#0D9488" : "#9CA3AF" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#0D9488" }}
              />
              <Area
                type="monotone"
                dataKey="media_moisture"
                stroke={isActuallyActive ? "#D97706" : "#9CA3AF"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorMedia)"
                isAnimationActive={false}
                dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF", stroke: isActuallyActive ? "#D97706" : "#9CA3AF" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#D97706" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-orange-600">
              <Thermometer size={18} />
              <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">Rata Suhu</p>
            </div>
            <h3 className="text-2xl font-black text-orange-600">{averageTemp !== "--" ? `${averageTemp}°C` : "--"}</h3>
          </div>

          <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-teal-600">
              <Droplets size={18} />
              <p className="text-xs font-bold text-teal-800 uppercase tracking-wide">Rata Kelembapan Udara</p>
            </div>
            <h3 className="text-2xl font-black text-teal-700">{averageHum !== "--" ? `${averageHum}%` : "--"}</h3>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-amber-600">
              <Layers size={18} />
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Rata Kelembapan Media</p>
            </div>
            <h3 className="text-2xl font-black text-amber-700">{averageMedia !== "--" ? `${averageMedia}%` : "--"}</h3>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex flex-col justify-between shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <Database size={18} />
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Update</p>
            </div>
            <h3 className="text-2xl font-black text-blue-700">5 Detik</h3>
          </div>

          <div className={`rounded-2xl p-4 border flex flex-col justify-between shadow-sm transition-colors ${!isConnected ? "bg-red-50 border-red-100" : (!hasData ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100")}`}>
            <div className={`flex items-center gap-2 mb-2 ${!isConnected ? "text-red-600" : (!hasData ? "text-amber-600" : "text-emerald-600")}`}>
              <Activity size={18} />
              <p className={`text-xs font-bold uppercase tracking-wide ${!isConnected ? "text-red-800" : (!hasData ? "text-amber-800" : "text-emerald-800")}`}>Status Koneksi</p>
            </div>
            <h3 className={`text-2xl font-black ${!isConnected ? "text-red-700" : (!hasData ? "text-amber-700" : "text-emerald-700")}`}>
              {!isConnected ? "Terputus" : (!hasData ? "Standby" : "Aktif")}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}