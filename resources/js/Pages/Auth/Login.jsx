import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
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
            <Head title="Masuk - Sistem Bansos" />

            {/* Page Background */}
            <div
                className="min-h-screen w-full flex flex-col"
                style={{
                    background:
                        'linear-gradient(135deg, #3F51B5 0%, #4255B6 9%, #4456B7 18%, #4758B8 27%, #495BB9 36%, #4C5DBA 45%, #4F5FBB 55%, #5162BC 64%, #5464BD 73%, #5766BE 82%, #5969BF 91%, #5C6BC0 100%)',
                }}
            >
                {/* Top Navbar */}
                <div className="flex items-center justify-center px-6 pt-12 pb-6">
                    <Link href={route('home')} className="flex items-center gap-3">
                        {/* Logo */}
                        <div
                            className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.2)' }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        {/* Brand Text */}
                        <div>
                            <p className="text-white font-medium text-[20px] leading-[1.4] font-inter">
                                Sistem Bansos
                            </p>
                            <p className="text-white/80 text-[14px] leading-[1.43] font-inter">
                                Transparansi &amp; Akuntabilitas
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-start justify-center px-4 pb-10">
                    <div className="w-full max-w-[448px]">
                        {/* Card */}
                        <div
                            className="bg-white rounded-[14px] overflow-hidden"
                            style={{ boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)' }}
                        >
                            {/* Card Header */}
                            <div className="px-6 pt-7 pb-4">
                                <h1 className="text-[24px] font-medium text-[#2C2C2C] font-inter leading-[1.33] mb-1">
                                    Masuk
                                </h1>
                                <p className="text-[16px] text-[#717182] font-inter leading-[1.5]">
                                    Masukkan NIK dan password Anda untuk mengakses sistem
                                </p>
                            </div>

                            {/* Status message */}
                            {status && (
                                <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-700 text-sm">{status}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="px-6 py-2 space-y-4">
                                {/* NIK Field */}
                                <div className="space-y-2">
                                    <label className="block text-[14px] font-medium text-[#2C2C2C] font-inter">
                                        NIK (Nomor Induk Kependudukan)
                                    </label>
                                    <div className="relative">
                                        {/* ID Card Icon */}
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <rect x="2" y="5" width="20" height="14" rx="2" stroke="#717182" strokeWidth="1.5"/>
                                                <path d="M16 10h2M16 14h2M6 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM6 16c0-1.1 1.34-2 3-2s3 .9 3 2" stroke="#717182" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                        </div>
                                        <input
                                            id="login"
                                            type="text"
                                            value={data.login}
                                            className="w-full h-[36px] pl-[40px] pr-[12px] bg-[#F3F3F5] border border-transparent rounded-[8px] text-[14px] text-[#2C2C2C] font-inter placeholder-[#717182] focus:outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                                            placeholder="Masukkan 16 digit NIK"
                                            maxLength={16}
                                            onChange={(e) => setData('login', e.target.value)}
                                            autoComplete="username"
                                        />
                                    </div>
                                    {errors.login && (
                                        <p className="text-xs text-red-500">{errors.login}</p>
                                    )}
                                    <p className="text-[12px] text-[#717182] font-inter">
                                        NIK harus terdiri dari 16 digit angka
                                    </p>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="block text-[14px] font-medium text-[#2C2C2C] font-inter">
                                        Password
                                    </label>
                                    <div className="relative">
                                        {/* Lock Icon */}
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#717182" strokeWidth="1.5"/>
                                                <path d="M8 11V7a4 4 0 018 0v4" stroke="#717182" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            className="w-full h-[36px] pl-[40px] pr-[40px] bg-[#F3F3F5] border border-transparent rounded-[8px] text-[14px] text-[#2C2C2C] font-inter placeholder-[#717182] focus:outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                                            placeholder="Masukkan password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            autoComplete="current-password"
                                        />
                                        {/* Toggle Button */}
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717182] hover:text-[#3F51B5] transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/>
                                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-xs text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#3F51B5] focus:ring-[#3F51B5]"
                                        />
                                        <span className="text-[14px] font-medium text-[#717182] font-inter">
                                            Ingat saya
                                        </span>
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-[14px] text-[#3F51B5] font-inter hover:underline"
                                        >
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-10 bg-[#3F51B5] text-white font-medium text-[16px] font-inter rounded-[8px] hover:bg-[#3949A3] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Memproses...' : 'Masuk'}
                                </button>
                            </form>

                            {/* Card Footer */}
                            <div className="px-6 pb-6 space-y-4">
                                {/* Divider with text */}
                                    <div className="relative flex items-center gap-3 mt-1">
                                    <div className="flex-1 border-t border-black/10"></div>
                                    <span className="text-[14px] text-[#717182] font-inter uppercase">Belum punya akun?</span>
                                    <div className="flex-1 border-t border-black/10"></div>
                                </div>

                                {/* Daftar Sekarang Button */}
                                <Link
                                    href={route('register')}
                                    className="block w-full h-10 border-2 border-[#3F51B5] text-[#3F51B5] font-medium text-[16px] font-inter rounded-[8px] hover:bg-[#3F51B5]/5 transition-colors flex items-center justify-center"
                                >
                                    Daftar Sekarang
                                </Link>
                            </div>
                        </div>

                        {/* Back to Home */}
                        <div className="mt-7 text-center">
                            <Link
                                href={route('home')}
                                className="text-[14px] text-white/90 font-inter hover:text-white transition-colors"
                            >
                                ← Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
