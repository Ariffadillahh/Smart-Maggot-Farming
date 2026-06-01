"use client";

import { Thermometer, Droplets, Activity, Leaf, Clock3, Layers } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [latestData, setLatestData] = useState({
    temperature: 0,
    humidity: 0,
    media_moisture: 0,
    created_at: new Date().toISOString(),
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

        if (!isNaN(newTemp) && !isNaN(newHum) && !isNaN(newMedia)) {
          setLatestData({
            temperature: newTemp,
            humidity: newHum,
            media_moisture: newMedia,
            created_at: new Date().toISOString(),
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

  const hasData = latestData.temperature > 0 || latestData.humidity > 0;

  const isActuallyActive = isConnected && hasData;

  const cards = [
    {
      title: "Suhu Udara",
      value: hasData ? `${latestData.temperature.toFixed(2)}°C` : "-- °C",
      desc: !hasData ? "Menunggu Data Sensor" : (latestData.temperature > 33 ? "Suhu Terlalu Panas" : "Suhu Optimal"),
      icon: Thermometer,
      color: !hasData ? "from-gray-400 to-gray-500" : (latestData.temperature > 33 ? "from-red-500 to-red-700" : "from-emerald-500 to-emerald-700"),
    },
    {
      title: "Kelembapan Udara",
      value: hasData ? `${latestData.humidity.toFixed(2)}%` : "-- %",
      desc: !hasData ? "Menunggu Data Sensor" : "Kondisi Kelembapan",
      icon: Droplets,
      color: !hasData ? "from-gray-400 to-gray-500" : "from-cyan-500 to-cyan-700",
    },
    {
      title: "Kelembapan Media",
      value: hasData ? `${latestData.media_moisture}%` : "-- %",
      desc: !hasData ? "Menunggu Data Sensor" : "Kondisi Tanah Pakan",
      icon: Layers,
      color: !hasData ? "from-gray-400 to-gray-500" : "from-amber-500 to-amber-700",
    },
    {
      title: "Status Sistem",
      value: !isConnected ? "Terputus" : (!hasData ? "Standby" : "Aktif"),
      desc: !isConnected ? "Gagal Terhubung / Offline" : (!hasData ? "Menunggu alat mengirim data" : "Monitoring Online"),
      icon: Activity,
      color: !isConnected ? "from-red-500 to-red-700" : (!hasData ? "from-amber-500 to-amber-600" : "from-green-500 to-green-700"),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gray-200 animate-pulse shadow-lg" />
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
          <div className="mt-4 md:mt-0 bg-white shadow-md rounded-2xl px-5 py-3 border border-gray-100 h-14 w-48 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-3xl h-36 animate-pulse shadow-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-4 w-12 bg-gray-200 rounded-md animate-pulse" />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl animate-pulse">
                  <div>
                    <div className="h-4 w-28 bg-gray-200 rounded-md mb-2" />
                    <div className="h-3 w-36 bg-gray-200 rounded-md" />
                  </div>
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
              <Leaf className="text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-emerald-900">Smart Maggot Farming</h1>
              <p className="text-gray-500 text-sm">Monitoring sensor secara realtime</p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 bg-white shadow-md rounded-2xl px-5 py-3 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Clock3 size={16} />
            <span>Update terakhir:</span>
          </div>
          <p className="font-semibold text-gray-700 mt-1">
            {!hasData ? "Belum ada data masuk" : new Date(latestData.created_at).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${card.color} rounded-3xl p-6 text-white shadow-xl hover:scale-[1.02] transition-all duration-300`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm opacity-80 mb-2">{card.title}</p>
                  <h2 className="text-4xl font-black">{card.value}</h2>
                  <p className="text-sm font-medium opacity-90 mt-3">{card.desc}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <Icon size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Monitoring Sensor</h2>
              <p className="text-sm text-gray-500">Data realtime dari perangkat IoT</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${!isConnected ? "bg-red-100 text-red-700" : (!hasData ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}`}>
              {!isConnected ? "Offline" : (!hasData ? "Standby" : "Online")}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Suhu Udara</span>
                <span className={`font-semibold ${isActuallyActive ? "text-emerald-700" : "text-gray-400"}`}>
                  {isActuallyActive ? `${latestData.temperature.toFixed(2)}°C` : "-- °C"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`${isActuallyActive ? "bg-emerald-600" : "bg-gray-400"} h-3 rounded-full transition-all duration-500 ease-in-out`} style={{ width: `${Math.min((latestData.temperature / 50) * 100, 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Kelembapan Udara</span>
                <span className={`font-semibold ${isActuallyActive ? "text-cyan-700" : "text-gray-400"}`}>
                  {isActuallyActive ? `${latestData.humidity.toFixed(2)}%` : "-- %"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`${isActuallyActive ? "bg-cyan-600" : "bg-gray-400"} h-3 rounded-full transition-all duration-500 ease-in-out`} style={{ width: `${Math.min(latestData.humidity, 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Kelembapan Media</span>
                <span className={`font-semibold ${isActuallyActive ? "text-amber-700" : "text-gray-400"}`}>
                  {isActuallyActive ? `${latestData.media_moisture}%` : "-- %"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`${isActuallyActive ? "bg-amber-600" : "bg-gray-400"} h-3 rounded-full transition-all duration-500 ease-in-out`} style={{ width: `${Math.min(latestData.media_moisture, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Status Sistem</h2>
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${!isConnected ? "bg-red-50" : (!hasData ? "bg-amber-50" : "bg-emerald-50")}`}>
              <div>
                <p className="font-semibold text-gray-700">Sensor Perangkat</p>
                <p className="text-sm text-gray-500">
                  {!isConnected ? "Koneksi terputus" : (!hasData ? "Menunggu data dari alat" : "Semua sensor berjalan normal")}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${!isConnected ? "bg-red-500" : (!hasData ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-pulse")}`} />
            </div>
            <div className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${isConnected ? "bg-lime-50" : "bg-red-50"}`}>
              <div>
                <p className="font-semibold text-gray-700">Jalur WebSocket</p>
                <p className="text-sm text-gray-500">{isConnected ? "Server terhubung" : "Disconnected"}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-lime-500 animate-pulse" : "bg-red-500"}`} />
            </div>
            <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-700">Database API</p>
                <p className="text-sm text-gray-500">
                  {hasData ? "Sinkronisasi berjalan" : "Menunggu antrean data"}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${hasData ? "bg-cyan-500 animate-pulse" : "bg-gray-400"}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}