"use client";

import { useState, useEffect } from "react";
import { FileText, Download, AlertCircle, CheckCircle2, Loader2, ArrowUpDown, CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ReportData = {
  id: string;
  rawDate: string;
  date: string;
  temperature: number;
  humidity: number;
  media_moisture: number;
  status: "Optimal" | "Perlu Perhatian";
};

export default function LaporanDashboard() {
  const [allData, setAllData] = useState<ReportData[]>([]);
  const [displayedData, setDisplayedData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMode, setExportMode] = useState<"filtered" | "all">("filtered");

  useEffect(() => {
    const fetchLaporan = async () => {
      setIsLoading(true);

      const { data: rawData, error } = await supabase
        .from("sensor_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

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
            rawDate: log.created_at,
            date: formattedDate,
            temperature: log.temperature,
            humidity: log.humidity,
            media_moisture: log.media_moisture,
            status: log.temperature > 33 ? "Perlu Perhatian" : "Optimal",
          };
        });

        setAllData(formattedData);
        setDisplayedData(formattedData);
      }

      setIsLoading(false);
    };

    fetchLaporan();
  }, []);

  useEffect(() => {
    let filtered = [...allData];

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((item) => new Date(item.rawDate) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((item) => new Date(item.rawDate) <= end);
    }

    setDisplayedData(filtered);
    setCurrentPage(1);

    if (!startDate && !endDate) {
      setExportMode("all");
    } else {
      setExportMode("filtered");
    }
  }, [startDate, endDate, allData]);

  const handleSortDate = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);

    const sortedData = [...displayedData].sort((a, b) => {
      const dateA = new Date(a.rawDate).getTime();
      const dateB = new Date(b.rawDate).getTime();
      return newOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setDisplayedData(sortedData);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(displayedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = displayedData.slice(startIndex, endIndex);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const dataToExport = exportMode === "all" ? allData : displayedData;

    doc.setFontSize(16);
    doc.text("Laporan Monitoring Smart Maggot Farming", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Dicetak pada: ${new Date().toLocaleString("id-ID")}`, 14, 28);

    if (exportMode === "filtered" && (startDate || endDate)) {
      const startText = startDate ? new Date(startDate).toLocaleDateString('id-ID') : "Awal";
      const endText = endDate ? new Date(endDate).toLocaleDateString('id-ID') : "Akhir";
      doc.text(`Periode: ${startText} - ${endText}`, 14, 34);
    } else {
      doc.text(`Periode: Semua Waktu (All Time)`, 14, 34);
    }

    const tableColumn = ["ID Log", "Waktu", "Suhu (°C)", "K. Udara (%)", "K. Media (%)", "Status"];

    const tableRows = dataToExport.map((item) => [
      item.id,
      item.date,
      item.temperature.toString(),
      item.humidity.toString(),
      item.media_moisture.toString(),
      item.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [5, 150, 105] },
    });

    doc.save("Laporan_Sensor_Maggot.pdf");
    setIsExportModalOpen(false); 
  };

  return (
    <div className="p-6 bg-white min-h-screen rounded-xl border border-gray-100 shadow-lg relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <FileText className="text-emerald-600" /> Laporan Monitoring
            </h1>
            <p className="text-gray-500 mt-1">Rekapitulasi data sensor harian budidaya maggot</p>
          </div>
          <button
            onClick={() => setIsExportModalOpen(true)}
            disabled={allData.length === 0}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <Download size={18} /> Export PDF
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-gray-700">
              <CalendarDays size={20} className="text-emerald-600" />
              Filter Tanggal:
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Dari</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Sampai</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700"
                />
              </div>

              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(""); setEndDate(""); }}
                  className="text-sm text-red-500 hover:text-red-700 font-medium px-2 underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto w-full min-h-[400px]">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-gray-500 text-sm">
                  <th className="px-6 py-4">ID Log</th>
                  <th className="px-6 py-4">
                    <button
                      onClick={handleSortDate}
                      className="flex items-center gap-2 hover:text-emerald-600 font-bold transition-colors"
                    >
                      Waktu <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="px-6 py-4">Suhu</th>
                  <th className="px-6 py-4">K. Udara</th>
                  <th className="px-6 py-4">K. Media</th>
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
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                      Tidak ada data yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{item.id}</td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{item.date}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-700 whitespace-nowrap">{item.temperature}°C</td>
                      <td className="px-6 py-4 font-semibold text-cyan-700 whitespace-nowrap">{item.humidity}%</td>
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

          {/* --- FOOTER PAGINATION --- */}
          {!isLoading && displayedData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Tampilkan</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 px-2 py-1 outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-500">data</span>
              </div>

              <div className="text-sm text-gray-500">
                Menampilkan <span className="font-bold text-gray-800">{startIndex + 1}</span> - <span className="font-bold text-gray-800">{Math.min(endIndex, displayedData.length)}</span> dari <span className="font-bold text-gray-800">{displayedData.length}</span> data
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-semibold text-gray-700 px-2">
                  Hal {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-emerald-600" size={20} />
                Pengaturan Export PDF
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-2">Silakan pilih cakupan data yang ingin Anda download:</p>

              <label
                className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${exportMode === "filtered" ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-gray-200 hover:border-emerald-200"
                  } ${(!startDate && !endDate) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="exportOption"
                  value="filtered"
                  checked={exportMode === "filtered"}
                  onChange={() => setExportMode("filtered")}
                  disabled={!startDate && !endDate}
                  className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <div>
                  <p className="font-bold text-gray-800">Sesuai Filter Tanggal</p>
                  {(!startDate && !endDate) ? (
                    <p className="text-sm text-gray-500 mt-1">Anda tidak sedang memfilter tanggal aktif.</p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      Mendownload <span className="font-semibold text-emerald-700">{displayedData.length} data</span> dari: <br />
                      {startDate ? new Date(startDate).toLocaleDateString('id-ID') : 'Awal'}
                      <span className="font-semibold mx-1">s/d</span>
                      {endDate ? new Date(endDate).toLocaleDateString('id-ID') : 'Akhir'}
                    </p>
                  )}
                </div>
              </label>

              <label
                className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${exportMode === "all" ? "border-emerald-500 bg-emerald-50/50 shadow-sm" : "border-gray-200 hover:border-emerald-200"
                  }`}
              >
                <input
                  type="radio"
                  name="exportOption"
                  value="all"
                  checked={exportMode === "all"}
                  onChange={() => setExportMode("all")}
                  className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <div>
                  <p className="font-bold text-gray-800">Semua Waktu (All Time)</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Mendownload seluruh <span className="font-semibold text-emerald-700">{allData.length} data</span> sensor yang tersedia di database.
                  </p>
                </div>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                <Download size={16} /> Download Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}