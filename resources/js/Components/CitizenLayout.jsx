import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { ShieldCheck, LayoutDashboard, RefreshCw, FileText, Settings, User, LogOut } from 'lucide-react';

const MENU = [
    { key: 'dashboard',        label: 'Dashboard',          Icon: LayoutDashboard, href: 'citizen.dashboard' },
    { key: 'pemutakhiran',     label: 'Pemutakhiran Data',  Icon: RefreshCw,       href: 'citizen.update' },
    { key: 'portal-pengaduan', label: 'Portal Pengaduan',   Icon: FileText,        href: 'citizen.complaint' },
    { key: 'pengaturan',       label: 'Pengaturan',         Icon: Settings,        href: 'citizen.settings' },
];

export default function CitizenLayout({ children, activeMenu }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    function handleLogout() {
        router.post(route('logout'));
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[rgba(245,247,250,0.3)]">
            <aside className="w-64 bg-white border-r border-black/10 shadow flex flex-col shrink-0">
                <div className="flex items-center gap-2 px-6 py-6">
                    <div className="bg-[#3f51b5] w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0">
                        <ShieldCheck size={24} color="white" />
                    </div>
                    <div>
                        <p className="text-[#3f51b5] font-bold text-[18px] leading-[22px]">Sistem Bansos</p>
                        <p className="text-[#717182] text-[10px] uppercase tracking-[0.5px]">Panel Warga</p>
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
                                    background: isActive ? 'rgba(63,81,181,0.1)' : 'transparent',
                                    color: isActive ? '#3f51b5' : '#717182',
                                }}
                            >
                                <item.Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="border-t border-black/10 px-4 py-4 flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-[#f5f7fa] border-2 border-white shadow flex items-center justify-center shrink-0">
                            <User size={20} color="#717182" />
                        </div>
                        <div>
                            <p className="text-[#2c2c2c] text-sm font-medium">{user?.name ?? 'Budi Santoso'}</p>
                            <p className="text-[#717182] text-xs">{user?.nik ?? '3171234567890123'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 h-9 w-full border border-black/10 bg-white rounded-lg px-3 hover:bg-red-50 transition"
                    >
                        <LogOut size={16} color="#e7000b" />
                        <span className="text-[#e7000b] text-sm font-medium">Keluar</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <div className="xl:hidden sticky top-0 z-20 h-16 bg-[#3f51b5] border-b border-black/10 flex items-center justify-between px-5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <User size={16} color="white" />
                        </div>
                        <p className="text-white text-2xl font-medium">Panel Warga</p>
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
