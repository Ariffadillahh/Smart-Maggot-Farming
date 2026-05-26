import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Leaf,
  Clock3,
} from "lucide-react";

export default function Dashboard() {
  const latestData = {
    temperature: 28,
    humidity: 65,
    air_quality: 42,
    created_at: new Date().toISOString(),
  };

  const cards = [
    {
      title: "Suhu",
      value: `${latestData.temperature}°C`,
      desc: "Suhu Optimal",
      icon: Thermometer,
      color: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Kelembapan",
      value: `${latestData.humidity}%`,
      desc: "Kondisi Lembap",
      icon: Droplets,
      color: "from-cyan-500 to-cyan-700",
    },
    {
      title: "Kualitas Udara",
      value: `${latestData.air_quality}`,
      desc: "Udara Stabil",
      icon: Wind,
      color: "from-lime-500 to-lime-700",
    },
    {
      title: "Status Sistem",
      value: "Aktif",
      desc: "Monitoring Online",
      icon: Activity,
      color: "from-green-500 to-green-700",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
              <Leaf className="text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-emerald-900">
                Smart Maggot Farming
              </h1>
              <p className="text-gray-500 text-sm">
                Monitoring sensor secara realtime
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 bg-white shadow-md rounded-2xl px-5 py-3 border border-emerald-100">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Clock3 size={16} />
            <span>Update terakhir:</span>
          </div>
          <p className="font-semibold text-emerald-700 mt-1">
            {new Date(latestData.created_at).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.color} rounded-3xl p-6 text-white shadow-xl hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm opacity-80 mb-2">{card.title}</p>
                  <h2 className="text-4xl font-black">{card.value}</h2>
                  <p className="text-sm opacity-80 mt-3">{card.desc}</p>
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
            <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              Online
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Suhu</span>
                <span className="font-semibold text-emerald-700">{latestData.temperature}°C</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${latestData.temperature}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Kelembapan</span>
                <span className="font-semibold text-cyan-700">{latestData.humidity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-cyan-600 h-3 rounded-full" style={{ width: `${latestData.humidity}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Status Sistem</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-700">Sensor Aktif</p>
                <p className="text-sm text-gray-500">Semua sensor berjalan normal</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center justify-between p-4 bg-lime-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-700">Sistem Monitoring</p>
                <p className="text-sm text-gray-500">Realtime connected</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-lime-500 animate-pulse" />
            </div>
            <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-700">Database</p>
                <p className="text-sm text-gray-500">Sinkronisasi aktif</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}