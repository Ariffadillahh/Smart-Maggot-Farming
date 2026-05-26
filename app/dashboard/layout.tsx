import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-8 mt-10 md:mt-0">
                <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-6">
                    <h2 className="md:text-xl text-base font-bold text-emerald-800">Smart Maggot Farming Dashboard</h2>
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                        AF
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}