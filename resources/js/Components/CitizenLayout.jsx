import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

const imgLogo    = "https://www.figma.com/api/mcp/asset/faf6da72-bd1f-4831-be38-ba3e4e1bf3db";
const imgDash    = "https://www.figma.com/api/mcp/asset/a809efa5-b7a1-4cc6-ac0e-a3ce7539fcaa";
const imgUpdate  = "https://www.figma.com/api/mcp/asset/19739e8f-a96d-4b7d-b530-8a854a58c675";
const imgReport  = "https://www.figma.com/api/mcp/asset/47421502-9989-4e36-ba35-d83177e22609";
const imgSettings= "https://www.figma.com/api/mcp/asset/ec8318b7-894a-4d3f-8a0c-70a7c5aec356";
const imgUser    = "https://www.figma.com/api/mcp/asset/4dbd06a9-9406-412a-a73b-0745633eab61";
const imgLogout  = "https://www.figma.com/api/mcp/asset/44161d3f-8f88-41c8-9d72-6ded15d3a2e5";

const MENU = [
    { key: 'dashboard',        label: 'Dashboard',          icon: imgDash,     href: 'citizen.dashboard' },
    { key: 'pemutakhiran',     label: 'Pemutakhiran Data',  icon: imgUpdate,   href: 'citizen.update' },
    { key: 'portal-pengaduan', label: 'Portal Pengaduan',   icon: imgReport,   href: 'citizen.complaint' },
    { key: 'pengaturan',       label: 'Pengaturan',         icon: imgSettings, href: 'citizen.settings' },
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
                        <img src={imgLogo} alt="logo" className="w-6 h-6" />
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
                            <p className="text-[#2c2c2c] text-sm font-medium">{user?.name ?? 'Budi Santoso'}</p>
                            <p className="text-[#717182] text-xs">{user?.nik ?? '3171234567890123'}</p>
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
                <div className="xl:hidden sticky top-0 z-20 h-16 bg-[#3f51b5] border-b border-black/10 flex items-center justify-between px-5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <img src={imgUser} alt="" className="w-4 h-4" />
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
