import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function LoginAuditor({ status }) {
    const [showPass, setShowPass] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('auditor.login'));
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'linear-gradient(141deg, #0a0a0a 0%, #171717 60%, #1a0505 100%)' }}
        >
            <div className="w-full max-w-[448px] flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-[10px] flex items-center justify-center"
                        style={{ background: 'rgba(231,0,11,0.2)', border: '1px solid rgba(251,44,54,0.3)' }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6467" strokeWidth="1.5">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <polyline points="9 12 11 14 15 10"/>
                        </svg>
                    </div>
                    <div>
                        <p className="text-white font-bold text-xl leading-tight">Portal Auditor</p>
                        <p className="text-white/80 text-base leading-tight">Satgas Independen Pusat</p>
                    </div>
                </div>

                <div
                    className="w-full rounded-[14px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.6)] overflow-hidden"
                    style={{ background: '#171717', border: '1px solid #262626' }}
                >
                    <div className="px-6 pt-6 pb-4">
                        <h1 className="text-white font-semibold text-2xl">Login Investigasi</h1>
                        <p className="text-[#a1a1a1] text-base mt-1">
                            Akses terbatas tingkat pusat untuk audit data bansos
                        </p>
                    </div>

                    {status && (
                        <div className="mx-6 mt-3 bg-green-900/30 border border-green-700/30 text-green-400 text-sm px-4 py-2 rounded-lg">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[#d4d4d4] text-sm font-medium">Email Kedinasan</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="auditor@satgas.go.id"
                                    autoFocus
                                    className="w-full rounded-lg pl-10 pr-3 py-2 text-sm text-[#d4d4d4] placeholder-[#737373] border focus:outline-none transition"
                                    style={{ background: '#262626', borderColor: errors.email ? '#ff6467' : '#404040' }}
                                />
                            </div>
                            {errors.email && <p className="text-[#ff6467] text-xs">{errors.email}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[#d4d4d4] text-sm font-medium">Password Enkripsi</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </span>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Masukkan sandi enkripsi"
                                    className="w-full rounded-lg pl-10 pr-10 py-2 text-sm text-[#d4d4d4] placeholder-[#737373] border focus:outline-none transition"
                                    style={{ background: '#262626', borderColor: errors.password ? '#ff6467' : '#404040' }}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#d4d4d4]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        {showPass
                                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                                        }
                                    </svg>
                                </button>
                            </div>
                            {errors.password && <p className="text-[#ff6467] text-xs">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="w-4 h-4" style={{ accentColor: '#ff6467' }} />
                                <span className="text-[#a1a1a1] text-sm">Simpan sesi aktif</span>
                            </label>
                            <a href="#" className="text-[#ff6467] text-sm hover:underline">Butuh bantuan?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full text-white font-medium text-sm py-2.5 rounded-lg transition disabled:opacity-60"
                            style={{ background: 'rgba(231,0,11,0.7)', border: '1px solid rgba(251,44,54,0.3)' }}
                        >
                            {processing ? 'Memproses...' : 'Akses Panel Satgas'}
                        </button>
                    </form>

                    <div className="border-t border-[#262626] py-5">
                        <p className="text-center text-[#737373] text-xs uppercase tracking-[0.7px]">
                            Authorized Personnel Only • Secure Connection
                        </p>
                    </div>
                </div>

                <a href={route('home')} className="text-[#a1a1a1] text-sm hover:text-white transition">
                    ← Kembali ke Portal Publik
                </a>
            </div>
        </div>
    );
}
