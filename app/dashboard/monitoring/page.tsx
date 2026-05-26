import { Activity, Leaf } from "lucide-react";

// Data dummy sebagai pengganti database
const dummyLogs = [
    { temperature: 28 },
    { temperature: 30 },
    { temperature: 29 },
    { temperature: 32 },
    { temperature: 31 },
    { temperature: 33 },
    { temperature: 35 },
    { temperature: 34 },
    { temperature: 32 },
    { temperature: 30 },
];

export default function Dashboard() {
    const logs = dummyLogs;

    // Konfigurasi Chart
    const CHART_WIDTH = 1000;
    const CHART_HEIGHT = 300;
    const MAX_TEMP = 50;

    // Fungsi helper untuk memetakan data ke koordinat
    const getCoordinates = (index: number, value: number) => {
        const x = (index / (Math.max(logs.length - 1, 1))) * CHART_WIDTH;
        // Membalik nilai Y agar 0 di bawah
        const y = CHART_HEIGHT - (value / MAX_TEMP) * CHART_HEIGHT;
        return { x, y };
    };

    const temperaturePoints = logs
        .map((item, index) => {
            const { x, y } = getCoordinates(index, item.temperature);
            return `${x},${y}`;
        })
        .join(" ");

    // Menghitung rata-rata untuk statistik
    const averageTemp = Math.round(
        logs.reduce((acc, curr) => acc + curr.temperature, 0) / logs.length
    );

    return (
        <div className="min-h-screen">
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
                        <h2 className="text-2xl font-black text-gray-800">Grafik Monitoring Suhu</h2>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm text-center mt-3 md:mt-0">
                        <Activity size={16} /> LIVE DATA
                    </div>
                </div>

                <div className="w-full">
                    <svg
                        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                        className="w-full h-auto"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <polygon
                            fill="url(#tempGradient)"
                            points={`0,${CHART_HEIGHT} ${temperaturePoints} ${CHART_WIDTH},${CHART_HEIGHT}`}
                        />

                        <polyline
                            fill="none"
                            stroke="#059669"
                            strokeWidth="8"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            points={temperaturePoints}
                        />

                        {logs.map((item, index) => {
                            const { x, y } = getCoordinates(index, item.temperature);
                            return (
                                <g key={index}>
                                    <circle cx={x} cy={y} r="12" fill="#059669" />
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                        <p className="text-sm text-gray-500">Rata-rata Suhu</p>
                        <h3 className="text-3xl font-black text-emerald-700">{averageTemp}°C</h3>
                    </div>
                    <div className="bg-cyan-50 rounded-2xl p-5 border border-cyan-100">
                        <p className="text-sm text-gray-500">Data Terkumpul</p>
                        <h3 className="text-3xl font-black text-cyan-700">{logs.length}</h3>
                    </div>
                    <div className="bg-lime-50 rounded-2xl p-5 border border-lime-100">
                        <p className="text-sm text-gray-500">Status Sensor</p>
                        <h3 className="text-3xl font-black text-lime-700">Aktif</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}