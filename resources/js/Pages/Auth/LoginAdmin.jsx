import { useState } from 'react';
import { useForm } from '@inertiajs/react';

const imgLogo = "https://www.figma.com/api/mcp/asset/099da505-4059-4bb3-8e1b-ed11bfa2e308";

export default function LoginAdmin({ status }) {
    const [showPass, setShowPass] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        nik: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.login'));
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'linear-gradient(141deg, #00796b 0%, #004d40 100%)' }}
        >
            <div className="w-full max-w-[448px] flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="bg-white rounded-[10px] p-2.5 w-12 h-12 flex items-center justify-center">
                        <img src={imgLogo} alt="logo" className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-xl leading-tight">Portal Admin Desa</p>
                        <p className="text-white/80 text-base leading-tight">Sistem Bansos Terpadu</p>
                    </div>
                </div>

                <div className="bg-white w-full rounded-[14px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] border border-black/10 overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-black/10">
                        <h1 className="text-[#2c2c2c] font-semibold text-2xl">Login Operator</h1>
                        <p className="text-[#717182] text-base mt-1">
                            Masukkan email dan password resmi desa untuk mengakses panel admin
                        </p>
                    </div>

                    {status && (
                        <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[#2c2c2c] text-sm font-medium">
                                Email Admin
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    value={data.nik}
                                    onChange={e => setData('nik', e.target.value)}
                                    placeholder="admin@desa.go.id"
                                    autoFocus
                                    className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-2 text-sm text-[#2c2c2c] placeholder-[#717182] border border-transparent focus:outline-none focus:border-[#00796b] focus:bg-white transition"
                                />
                            </div>
                            {errors.nik && <p className="text-red-500 text-xs">{errors.nik}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[#2c2c2c] text-sm font-medium">Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </span>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Masukkan password admin"
                                    className="w-full bg-[#f3f3f5] rounded-lg pl-10 pr-10 py-2 text-sm text-[#2c2c2c] placeholder-[#717182] border border-transparent focus:outline-none focus:border-[#00796b] focus:bg-white transition"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717182]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        {showPass
                                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                                        }
                                    </svg>
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="w-4 h-4 accent-[#00796b]" />
                                <span className="text-[#717182] text-sm font-medium">Ingat saya</span>
                            </label>
                            <a href="#" className="text-[#00796b] text-sm hover:underline">Lupa password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#00796b] hover:bg-[#00695c] text-white font-medium text-sm py-2.5 rounded-lg transition disabled:opacity-60"
                        >
                            {processing ? 'Memproses...' : 'Login sebagai Admin'}
                        </button>
                    </form>

                    <div className="px-6 py-6 text-center border-t border-black/10">
                        <p className="text-[#717182] text-xs">
                            Akses ke portal ini dibatasi hanya untuk aparatur desa yang berwenang. Segala aktivitas akan dicatat.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
