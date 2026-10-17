import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function OperatorLogin({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login Petugas - Sistem Bansos" />

            <div className="min-h-screen w-full flex bg-[#F5F7FA]">
                {/* Left Side: Illustration or Brand (Hidden on Mobile) */}
                <div 
                    className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white"
                    style={{
                        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Sistem Bansos</span>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold leading-tight mb-4">
                            Portal Internal Petugas & Auditor
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Selamat datang kembali. Silakan masuk untuk mengelola data bantuan sosial dan melakukan audit sistem.
                        </p>
                    </div>

                    <div className="text-sm text-slate-500">
                        &copy; 2026 Kementerian Sosial Republik Indonesia
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-[400px]">
                        <div className="mb-10 lg:hidden text-center">
                             <div className="inline-flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-slate-900">Sistem Bansos</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Login Petugas</h1>
                            <p className="text-slate-500">Gunakan email instansi Anda untuk masuk</p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Instansi</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        value={data.login}
                                        onChange={e => setData('login', e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="nama@instansi.go.id"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.login && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.login}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-slate-700">Password</label>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">
                                    Ingat sesi saya
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                            >
                                {processing ? 'Menyambungkan...' : 'Masuk ke Panel Kontrol'}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <Link href={route('login')} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                                Bukan petugas? Masuk sebagai Warga
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
