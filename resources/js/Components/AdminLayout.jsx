import { router } from '@inertiajs/react';

const imgLogo    = "https://www.figma.com/api/mcp/asset/099da505-4059-4bb3-8e1b-ed11bfa2e308";
const imgTable   = "https://www.figma.com/api/mcp/asset/fa404191-3530-4219-b9ad-c5d42ab4ed4e";
const imgCal     = "https://www.figma.com/api/mcp/asset/c5cbf763-af85-4357-9884-31d26ed0e635";
const imgUser    = "https://www.figma.com/api/mcp/asset/c292449c-b37d-4285-aef3-9ecfa1f0b514";
const imgLogout  = "https://www.figma.com/api/mcp/asset/44776bf3-46da-4d47-bd98-a62300069518";

const MENU = [
    { key: 'prioritas', label: 'Tabel Prioritas Pemohon', icon: imgTable,  href: 'admin.dashboard' },
    { key: 'jadwal',    label: 'Jadwal & Penyaluran',     icon: imgCal,    href: 'admin.schedule' },
];

export default function AdminLayout({ children, activeMenu, user }) {
    function handleLogout() {
        router.post(route('admin.logout'));
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[rgba(245,247,250,0.3)]">
            <aside className="w-64 bg-white border-r border-black/10 shadow flex flex-col shrink-0">
                <div className="flex items-center gap-2 px-6 py-6">
                    <div className="bg-[#00796b] w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0">
                        <img src={imgLogo} alt="logo" className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[#00796b] font-bold text-[18px] leading-[22px]">Admin Desa</p>
                        <p className="text-[#717182] text-[10px] uppercase tracking-[0.5px]">Operator Kelurahan</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 flex flex-col gap-2">
                    {MENU.map(item => {
                        const isActive = activeMenu === item.key;
                        return (
                            <button
                                key={item.key}
                                onClick={() => router.get(route(item.href))}
                                className="flex items-center gap-3 h-11 w-full px-4 rounded-[10px] text-sm font-medium transition"
                                style={{
                                    background: isActive ? 'rgba(0,121,107,0.1)' : 'transparent',
                                    color: isActive ? '#00796b' : '#717182',
                                }}
                            >
                                <img src={item.icon} alt="" className="w-5 h-5 shrink-0" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="border-t border-black/10 px-4 py-4 flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-[#f5f7fa] border-2 border-white shadow flex items-center justify-center shrink-0">
                            <img src={imgUser} alt="" className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[#2c2c2c] text-sm font-medium">{user?.name ?? 'Bapak RT / Admin'}</p>
                            <p className="text-[#717182] text-xs">{user?.village ?? 'Desa Suka Maju'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 h-9 w-full border border-black/10 bg-white rounded-lg px-3 hover:bg-red-50 transition"
                    >
                        <img src={imgLogout} alt="" className="w-4 h-4" />
                        <span className="text-[#e7000b] text-sm font-medium">Keluar</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <div className="xl:hidden sticky top-0 z-20 h-16 bg-[#00796b] border-b border-black/10 flex items-center justify-between px-5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <img src={imgLogo} alt="" className="w-4 h-4" />
                        </div>
                        <p className="text-white text-2xl font-medium">Panel Admin Desa</p>
                    </div>
                    <button
                        type="button"
                        className="text-white text-2xl leading-none opacity-90 hover:opacity-100 transition"
                        aria-label="Menu"
                    >
                        ≡
                    </button>
                </div>
                {children}
            </main>
        </div>
    );
}
