import { router } from '@inertiajs/react';

const imgShield  = "https://www.figma.com/api/mcp/asset/32e85c78-0548-4b34-8994-01d8e11af1d8";
const imgMsg     = "https://www.figma.com/api/mcp/asset/24914e47-6cb3-4bae-9349-8dcb77418275";
const imgClock   = "https://www.figma.com/api/mcp/asset/f47c176c-b87a-4462-82e8-db51d694c920";
const imgFile    = "https://www.figma.com/api/mcp/asset/bfc1c9d1-80a4-4ccf-8765-9927ef966e12";
const imgUser    = "https://www.figma.com/api/mcp/asset/555f5804-3c9c-4d75-9905-e1759cd98e7b";
const imgLogout  = "https://www.figma.com/api/mcp/asset/ca8274c5-6bf0-40e8-86b3-44e03b9e9236";

const MENU = [
    { key: 'whistleblowing', label: 'Whistleblowing Desk', icon: imgMsg,   href: 'auditor.dashboard' },
    { key: 'audit',          label: 'Audit Trail Logs',    icon: imgClock, href: 'auditor.audit' },
    { key: 'laporan',        label: 'Laporan Eksekutif',   icon: imgFile,  href: 'auditor.report' },
];

export default function AuditorLayout({ children, activeMenu, user }) {
    function handleLogout() {
        router.post(route('auditor.logout'));
    }

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: '#171717' }}>
            <aside
                className="w-64 flex flex-col shrink-0"
                style={{ background: '#000', borderRight: '0.8px solid #262626' }}
            >
                <div className="flex items-center gap-2 px-6 py-6">
                    <div
                        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(231,0,11,0.2)', border: '0.8px solid rgba(251,44,54,0.3)' }}
                    >
                        <img src={imgShield} alt="logo" className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-[18px] leading-[22px]">Auditor Pusat</p>
                        <p className="text-[#ff6467] text-[10px] font-semibold uppercase tracking-[0.5px]">Satgas Independen</p>
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
                                    background: isActive ? 'rgba(231,0,11,0.2)' : 'transparent',
                                    border: isActive ? '0.8px solid rgba(251,44,54,0.3)' : '0.8px solid transparent',
                                    color: isActive ? '#ff6467' : '#a1a1a1',
                                }}
                            >
                                <img src={item.icon} alt="" className="w-5 h-5 shrink-0" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="px-4 py-4 flex flex-col gap-4" style={{ borderTop: '0.8px solid #262626' }}>
                    <div className="flex items-center gap-3 px-2">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: '#262626', border: '1.6px solid #404040' }}
                        >
                            <img src={imgUser} alt="" className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">{user?.name ?? 'Inspektorat'}</p>
                            <p className="text-[#737373] text-xs">Akses Terenkripsi</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 h-9 w-full rounded-lg px-3 transition hover:opacity-80"
                        style={{ border: '0.8px solid rgba(130,24,26,0.5)' }}
                    >
                        <img src={imgLogout} alt="" className="w-4 h-4" />
                        <span className="text-[#ff6467] text-sm font-medium">Keluar Ruang Audit</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto" style={{ background: '#171717' }}>
                <div className="xl:hidden sticky top-0 z-20 h-16 bg-black border-b border-[#262626] flex items-center justify-between px-5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(231,0,11,0.2)] border border-[rgba(251,44,54,0.3)] flex items-center justify-center">
                            <img src={imgShield} alt="" className="w-4 h-4" />
                        </div>
                        <p className="text-white text-2xl font-medium">Panel Auditor Pusat</p>
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
