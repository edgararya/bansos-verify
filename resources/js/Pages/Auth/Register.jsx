import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        nik: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordChecks = {
        length: data.password.length >= 8,
        upper: /[A-Z]/.test(data.password),
        lower: /[a-z]/.test(data.password),
        number: /[0-9]/.test(data.password),
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const CheckItem = ({ passed, label }) => (
        <div className="flex items-center gap-2">
            <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    passed ? 'bg-green-500' : 'bg-gray-200'
                }`}
            >
                {passed && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )}
            </div>
            <span className={`text-[14px] font-inter ${passed ? 'text-green-700' : 'text-[#2C2C2C]'}`}>
                {label}
            </span>
        </div>
    );

    return (
        <>
            <Head title="Daftar - Sistem Bansos" />

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
                    <div className="w-full max-w-[672px]">
                        {/* Card */}
                        <div
                            className="bg-white rounded-[14px] overflow-hidden"
                            style={{ boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)' }}
                        >
                            {/* Card Header */}
                            <div className="px-6 pt-7 pb-4">
                                <h1 className="text-[24px] font-medium text-[#2C2C2C] font-inter leading-[1.33] mb-1">
                                    Daftar Akun Baru
                                </h1>
                                <p className="text-[14px] text-[#717182] font-inter leading-[1.43]">
                                    Lengkapi data berikut untuk membuat akun Sistem Bansos
                                </p>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={submit} className="px-6 py-5 space-y-4">
                                {/* Info Alert */}
                                <div
                                    className="flex items-start gap-3 p-3 rounded-[10px] border"
                                    style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                                        <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="1.5"/>
                                        <path d="M12 8v4M12 16h.01" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    <p className="text-[14px] text-[#717182] font-inter leading-[1.43]">
                                        Pastikan NIK yang Anda masukkan sesuai dengan KTP. Data akan diverifikasi oleh sistem.
                                    </p>
                                </div>

                                {/* Form Grid — 2 columns on md+ */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* NIK */}
                                    <div className="space-y-1">
                                        <label className="block text-[14px] font-medium text-[#2C2C2C] font-inter">
                                            NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#717182" strokeWidth="1.5"/>
                                                    <path d="M16 10h2M16 14h2M6 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM6 16c0-1.1 1.34-2 3-2s3 .9 3 2" stroke="#717182" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                            </div>
                                            <input
                                                id="nik"
                                                type="text"
                                                value={data.nik}
                                                onChange={(e) => setData('nik', e.target.value)}
                                                maxLength={16}
                                                placeholder="Masukkan 16 digit NIK"
                                                className="w-full h-[36px] pl-[40px] pr-[12px] bg-[#F3F3F5] border border-transparent rounded-[8px] text-[14px] text-[#2C2C2C] font-inter placeholder-[#717182] focus:outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                                            />
                                        </div>
                                        {errors.nik && <p className="text-xs text-red-500">{errors.nik}</p>}
                                    </div>

                                    {/* Nama Lengkap */}
                                    <div className="space-y-1">
                                        <label className="block text-[14px] font-medium text-[#2C2C2C] font-inter">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="8" r="4" stroke="#717182" strokeWidth="1.5"/>
                                                    <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#717182" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                            </div>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Sesuai KTP"
                                                className="w-full h-[36px] pl-[40px] pr-[12px] bg-[#F3F3F5] border border-transparent rounded-[8px] text-[14px] text-[#2C2C2C] font-inter placeholder-[#717182] focus:outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                                            />
                                        </div>
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label className="block text-[14px] font-medium text-[#2C2C2C] font-inter">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#717182" strokeWidth="1.5"/>
                                                    <path d="M2 8l10 6 10-6" stroke="#717182" strokeWidth="1.5"/>
                                                </svg>
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="nama@email.com"
                                                className="w-full h-[36px] pl-[40px] pr-[12px] bg-[#F3F3F5] border border-transparent rounded-[8px] text-[14px] text-[#2C2C2C] font-inter placeholder-[#717182] focus:outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                                            />
                                        </div>
                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                    </div>

                                    {/* Nomor Telepon */}
                                    <div className="space-y-1">
                                        <label className="block text-[14px] font-medium text-[#2C2C2C] font-inter">
                                            Nomor Telepon <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z" stroke="#717182" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="08xxxxxxxxxx"
                                                className="w-full h-[36px] pl-[40px] pr-[12px] bg-[#F3F3F5] border border-transparent rounded-[8px] text-[14px] text-[#2C2C2C] font-inter placeholder-[#717182] focus:outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1">
                                        <label className="block text-[14px] font-medium text-[#2C2C2C] font-inter">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
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
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Minimal 8 karakter"
                                                className="w-full h-[36px] pl-[40px] pr-[40px] bg-[#F3F3F5] border border-transparent rounded-[8px] text-[14px] text-[#2C2C2C] font-inter placeholder-[#717182] focus:outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717182] hover:text-[#3F51B5] transition-colors"
                                            >
                                                {showPassword ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/>
                                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                                    </div>

                                    {/* Konfirmasi Password */}
                                    <div className="space-y-1">
                                        <label className="block text-[14px] font-medium text-[#2C2C2C] font-inter">
                                            Konfirmasi Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#717182" strokeWidth="1.5"/>
                                                    <path d="M8 11V7a4 4 0 018 0v4" stroke="#717182" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                            </div>
                                            <input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Ulangi password"
                                                className="w-full h-[36px] pl-[40px] pr-[40px] bg-[#F3F3F5] border border-transparent rounded-[8px] text-[14px] text-[#2C2C2C] font-inter placeholder-[#717182] focus:outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717182] hover:text-[#3F51B5] transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/>
                                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="text-xs text-red-500">{errors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Password Requirements Box */}
                                {data.password.length > 0 && (
                                    <div className="p-3 bg-gray-50 rounded-[10px] space-y-2">
                                        <p className="text-[14px] font-medium text-[#2C2C2C] font-inter">
                                            Password harus memenuhi:
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <CheckItem passed={passwordChecks.length} label="Minimal 8 karakter" />
                                            <CheckItem passed={passwordChecks.upper} label="Huruf besar (A-Z)" />
                                            <CheckItem passed={passwordChecks.lower} label="Huruf kecil (a-z)" />
                                            <CheckItem passed={passwordChecks.number} label="Angka (0-9)" />
                                        </div>
                                    </div>
                                )}

                                {/* Terms Checkbox */}
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.terms}
                                        onChange={(e) => setData('terms', e.target.checked)}
                                        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#3F51B5] focus:ring-[#3F51B5]"
                                    />
                                    <span className="text-[14px] text-[#717182] font-inter leading-[1.43]">
                                        Saya menyetujui{' '}
                                        <a href="#" className="text-[#3F51B5] hover:underline">
                                            Syarat &amp; Ketentuan
                                        </a>{' '}
                                        serta{' '}
                                        <a href="#" className="text-[#3F51B5] hover:underline">
                                            Kebijakan Privasi
                                        </a>
                                    </span>
                                </label>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-10 bg-[#3F51B5] text-white font-medium text-[16px] font-inter rounded-[8px] hover:bg-[#3949A3] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Memproses...' : 'Daftar'}
                                </button>
                            </form>

                            {/* Card Footer */}
                            <div className="px-6 pb-6 space-y-4">
                                {/* Divider */}
                                <div className="relative flex items-center gap-3">
                                    <div className="flex-1 border-t border-black/10"></div>
                                    <span className="text-[14px] text-[#717182] font-inter uppercase">Sudah punya akun?</span>
                                    <div className="flex-1 border-t border-black/10"></div>
                                </div>

                                {/* Masuk Button */}
                                <Link
                                    href={route('login')}
                                    className="block w-full h-10 border-2 border-[#3F51B5] text-[#3F51B5] font-medium text-[16px] font-inter rounded-[8px] hover:bg-[#3F51B5]/5 transition-colors flex items-center justify-center"
                                >
                                    Masuk
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
