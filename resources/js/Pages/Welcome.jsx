import { useState, useEffect } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import ModalLaporanAnonim from '@/Components/Public/ModalLaporanAnonim';

export default function Welcome({ auth, stats, scoreDistribution, employmentDistribution }) {
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            setToast(flash.success);
            const t = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    const statCards = [
        {
            label: 'Total Pengajuan',
            value: stats?.total_applicants ?? '0',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            iconBg: 'rgba(63,81,181,0.1)',
            iconColor: '#3F51B5',
        },
        {
            label: 'Terverifikasi',
            value: stats?.total_approved ?? '0',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            iconBg: 'rgba(0,121,107,0.1)',
            iconColor: '#00796B',
        },
        {
            label: 'Akurasi Sasaran',
            value: (stats?.avg_score ?? '0') + '%',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            iconBg: 'rgba(92,107,192,0.1)',
            iconColor: '#5C6BC0',
        },
        {
            label: 'Aduan Masuk',
            value: stats?.total_reports ?? '0',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            iconBg: 'rgba(66,165,245,0.1)',
            iconColor: '#42A5F5',
        },
    ];

    const features = [
        {
            title: 'Aman & Terpercaya',
            desc: 'Data dilindungi dengan enkripsi tingkat tinggi dan sistem keamanan berlapis untuk menjaga privasi warga.',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            iconBg: 'rgba(63,81,181,0.08)',
            iconColor: '#3F51B5',
        },
        {
            title: 'Real-time Monitoring',
            desc: 'Pantau status penyaluran bantuan secara langsung dengan update otomatis setiap saat.',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            iconBg: 'rgba(0,121,107,0.08)',
            iconColor: '#00796B',
        },
        {
            title: 'Tepat Sasaran',
            desc: 'Verifikasi data penerima untuk memastikan bantuan sosial sampai ke yang berhak menerimanya.',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            iconBg: 'rgba(92,107,192,0.08)',
            iconColor: '#5C6BC0',
        },
        {
            title: 'Laporan Transparan',
            desc: 'Akses laporan lengkap dan audit trail untuk akuntabilitas penuh program bantuan sosial.',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            iconBg: 'rgba(66,165,245,0.08)',
            iconColor: '#42A5F5',
        },
    ];

    const scoreTotal = scoreDistribution?.reduce((acc, curr) => acc + curr.count, 0) || 0;

    // Pie chart data: Tepat Sasaran, Dalam Proses, Perlu Perbaikan
    const accuracyRate = stats?.avg_score ?? 87.5;
    const inProgress = 8.2;
    const needsFix = 4.3;
    const onTarget = Math.max(0, 100 - inProgress - needsFix);

    // SVG donut chart helpers (cx=100, cy=100, r=80)
    const RADIUS = 80;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    const buildArc = (pct, offset) => ({
        strokeDasharray: `${(pct / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`,
        strokeDashoffset: -offset * CIRCUMFERENCE / 100,
    });
    const arc1 = buildArc(onTarget, 0);
    const arc2 = buildArc(inProgress, onTarget);
    const arc3 = buildArc(needsFix, onTarget + inProgress);

    const totalBeneficiaries = stats?.total_applicants ? (stats.total_applicants * 1000).toLocaleString('id-ID') : '2.450.000';

    return (
        <>
            <Head title="Sistem Bansos – Transparansi & Akuntabilitas" />

            {/* ===== TOAST NOTIFICATION ===== */}
            {toast && (
                <div
                    className="fixed bottom-6 left-1/2 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-medium"
                    style={{
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg,#1A9E8A,#15897A)',
                        animation: 'toastIn 0.3s ease-out',
                        maxWidth: '420px',
                        width: 'calc(100% - 32px)',
                    }}
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1">{toast}</span>
                    <button onClick={() => setToast(null)} className="opacity-70 hover:opacity-100 transition">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            )}

            <div className="min-h-screen bg-white font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>

                {/* ===== NAVBAR ===== */}
                <nav
                    className="sticky top-0 z-50 bg-white"
                    style={{ boxShadow: '0px 1px 2px -1px rgba(0,0,0,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1)', borderBottom: '0.8px solid rgba(0,0,0,0.1)' }}
                >
                    <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-[72px]">
                        {/* Brand */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3F51B5,#5C6BC0)' }}>
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#2C2C2C] leading-tight">Sistem Bansos</p>
                                <p className="text-[11px] text-[#717182] leading-tight">Transparansi &amp; Akuntabilitas</p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#" className="text-sm text-[#2C2C2C] hover:text-[#3F51B5] transition-colors">Beranda</a>
                            <a href="#" className="text-sm text-[#2C2C2C] hover:text-[#3F51B5] transition-colors">Tentang</a>
                            <a href="#" className="text-sm text-[#2C2C2C] hover:text-[#3F51B5] transition-colors">Panduan</a>
                            <a href="#" className="text-sm text-[#2C2C2C] hover:text-[#3F51B5] transition-colors">Kontak</a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href={
                                        auth.user.role === 'admin' ? route('admin.dashboard') :
                                        auth.user.role === 'auditor' ? route('auditor.dashboard') :
                                        route('citizen.dashboard')
                                    }
                                    className="text-sm font-medium rounded-lg px-4 py-2 transition-all"
                                    style={{ color: '#3F51B5' }}
                                >
                                    Dashboard Saya
                                </Link>
                            ) : (
                                <>
                                    <button
                                        className="flex items-center gap-1.5 text-sm text-[#2C2C2C] px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Bantuan
                                    </button>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium px-4 py-[7px] rounded-lg transition-all"
                                        style={{ background: 'linear-gradient(135deg,#3F51B5,#5C6BC0)', color: '#fff' }}
                                    >
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ===== HERO SECTION ===== */}
                <header
                    style={{
                        background: 'linear-gradient(135deg, rgba(63,81,181,1) 0%, rgba(66,83,182,1) 9%, rgba(68,86,183,1) 18%, rgba(71,88,184,1) 27%, rgba(73,91,185,1) 36%, rgba(76,93,186,1) 45%, rgba(79,95,187,1) 55%, rgba(81,98,188,1) 64%, rgba(84,100,189,1) 73%, rgba(87,102,190,1) 82%, rgba(89,105,191,1) 91%, rgba(92,107,192,1) 100%)',
                        padding: '80px 24px 56px',
                    }}
                >
                    <div className="max-w-screen-xl mx-auto">
                        <div className="text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-white text-sm" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Transparansi Data Real-time
                            </div>

                            {/* Headline */}
                            <h1 className="text-white font-medium mb-6 leading-tight" style={{ fontSize: '48px', lineHeight: '1.25', maxWidth: '768px', margin: '0 auto 24px' }}>
                                Sistem Monitoring Penyaluran Bantuan Sosial
                            </h1>

                            {/* Subheadline */}
                            <p className="mb-12 leading-relaxed" style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', maxWidth: '768px', margin: '0 auto 48px' }}>
                                Pantau transparansi dan akuntabilitas penyaluran bantuan sosial secara real-time. Memastikan bantuan tepat sasaran untuk masyarakat yang membutuhkan.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
                                <Link
                                    href={route('login')}
                                    className="w-full sm:w-auto text-center font-medium text-sm rounded-lg px-8 py-2.5 transition-all"
                                    style={{
                                        background: '#fff',
                                        color: '#3F51B5',
                                        boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    Cek Status
                                </Link>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full sm:w-auto text-center font-medium text-sm rounded-lg px-8 py-2.5 text-white transition-all hover:bg-white/10"
                                    style={{ border: '1.6px solid #fff' }}
                                >
                                    Lapor Anonim
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ===== TRANSPARENCY SECTION ===== */}
                <section className="py-16 px-6" style={{ background: '#F5F7FA' }}>
                    <div className="max-w-screen-xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <h2 className="font-medium text-[#2C2C2C] mb-3" style={{ fontSize: '36px', lineHeight: '1.11' }}>
                                Transparansi Penyaluran Bansos
                            </h2>
                            <p className="text-[#717182]" style={{ fontSize: '18px' }}>
                                Data real-time status penyaluran bantuan sosial periode April 2026
                            </p>
                        </div>

                        {/* Main content: pie chart card + stacked stat cards */}
                        <div className="flex flex-col lg:flex-row gap-6">

                            {/* Pie Chart Card */}
                            <div
                                className="bg-white flex-1 p-8"
                                style={{
                                    border: '0.8px solid rgba(0,0,0,0.08)',
                                    boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
                                    borderRadius: '16px',
                                }}
                            >
                                <h3 className="font-semibold text-[#2C2C2C] text-lg mb-1">Status Ketepatan Sasaran</h3>
                                <p className="text-sm text-[#717182] mb-8">Persentase penerima bantuan berdasarkan status verifikasi</p>

                                {/* SVG Donut Chart */}
                                <div className="flex flex-col items-center">
                                    <div className="relative" style={{ width: 220, height: 220 }}>
                                        <svg viewBox="0 0 200 200" width="220" height="220">
                                            {/* Track */}
                                            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#F0F0F0" strokeWidth="28" />
                                            {/* Tepat Sasaran – teal */}
                                            <circle
                                                cx="100" cy="100" r={RADIUS}
                                                fill="none" stroke="#1A9E8A" strokeWidth="28"
                                                strokeDasharray={arc1.strokeDasharray}
                                                strokeDashoffset="0"
                                                style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                                            />
                                            {/* Dalam Proses – indigo */}
                                            <circle
                                                cx="100" cy="100" r={RADIUS}
                                                fill="none" stroke="#3F51B5" strokeWidth="28"
                                                strokeDasharray={arc2.strokeDasharray}
                                                strokeDashoffset={`${-arc1.strokeDasharray.split(' ')[0]}`}
                                                style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                                            />
                                            {/* Perlu Perbaikan – light indigo */}
                                            <circle
                                                cx="100" cy="100" r={RADIUS}
                                                fill="none" stroke="#9FA8DA" strokeWidth="28"
                                                strokeDasharray={arc3.strokeDasharray}
                                                strokeDashoffset={`${-(parseFloat(arc1.strokeDasharray) + parseFloat(arc2.strokeDasharray))}`}
                                                style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                                            />
                                            {/* Center label */}
                                            <text x="100" y="93" textAnchor="middle" fill="#2C2C2C" fontSize="28" fontWeight="700" fontFamily="Inter,sans-serif">
                                                {onTarget.toFixed(1)}%
                                            </text>
                                            <text x="100" y="113" textAnchor="middle" fill="#717182" fontSize="11" fontFamily="Inter,sans-serif">
                                                Tepat Sasaran
                                            </text>
                                        </svg>
                                    </div>

                                    {/* Legend */}
                                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#1A9E8A' }}></span>
                                            <span className="text-xs text-[#717182]">Tepat Sasaran</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#3F51B5' }}></span>
                                            <span className="text-xs text-[#717182]">Dalam Proses Verifikasi</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#9FA8DA' }}></span>
                                            <span className="text-xs text-[#717182]">Perlu Perbaikan Data</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right side stacked stat cards */}
                            <div className="flex flex-col gap-6 lg:w-96">

                                {/* Accuracy Rate Card - teal/green */}
                                <div
                                    className="p-6 text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #1A9E8A 0%, #15897A 100%)',
                                        borderRadius: '16px',
                                        boxShadow: '0px 4px 16px rgba(26,158,138,0.3)',
                                    }}
                                >
                                    <p className="text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.85)' }}>Tingkat Ketepatan Sasaran</p>
                                    <p className="font-bold mb-2" style={{ fontSize: '48px', lineHeight: '1', letterSpacing: '-1px' }}>
                                        {onTarget.toFixed(1)}%
                                    </p>
                                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                                        Dari total 2.450.000 penerima bantuan telah terverifikasi sesuai kriteria
                                    </p>
                                </div>

                                {/* Total Beneficiaries Card */}
                                <div
                                    className="bg-white p-6"
                                    style={{
                                        border: '0.8px solid rgba(0,0,0,0.08)',
                                        boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
                                        borderRadius: '16px',
                                    }}
                                >
                                    <p className="text-sm text-[#717182] mb-2">Total Penerima Manfaat</p>
                                    <p className="font-bold mb-2" style={{ fontSize: '36px', color: '#3F51B5', letterSpacing: '-0.5px' }}>2.450.000</p>
                                    <p className="text-sm text-[#717182]">Keluarga penerima manfaat program bantuan sosial yang terdaftar dalam sistem</p>
                                </div>

                                {/* Last Updated Card */}
                                <div
                                    className="bg-white p-6"
                                    style={{
                                        border: '0.8px solid rgba(0,0,0,0.08)',
                                        boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
                                        borderRadius: '16px',
                                    }}
                                >
                                    <p className="text-sm text-[#717182] mb-2">Update Terakhir</p>
                                    <p className="font-bold mb-2" style={{ fontSize: '22px', color: '#3F51B5' }}>16 April 2026, 14:30 WIB</p>
                                    <p className="text-sm text-[#717182]">Data diperbarui secara otomatis setiap 6 jam</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== FEATURES SECTION ===== */}
                <section className="py-16 px-6 bg-white">
                    <div className="max-w-screen-xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <h2 className="font-medium text-[#2C2C2C] mb-3" style={{ fontSize: '36px', lineHeight: '1.11' }}>
                                Keunggulan Sistem
                            </h2>
                            <p className="text-[#717182]" style={{ fontSize: '18px', maxWidth: '672px', margin: '0 auto' }}>
                                Platform digital untuk meningkatkan transparansi dan efektivitas program bantuan sosial
                            </p>
                        </div>

                        {/* 4 Feature Cards: 2×2 grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feat, i) => (
                                <div
                                    key={i}
                                    className="bg-white p-6 transition-all hover:-translate-y-0.5"
                                    style={{
                                        border: '1.6px solid rgba(0,0,0,0.1)',
                                        borderRadius: '14px',
                                    }}
                                >
                                    {/* Icon */}
                                    <div
                                        className="w-12 h-12 rounded-[10px] flex items-center justify-center mb-4"
                                        style={{ background: feat.iconBg, color: feat.iconColor }}
                                    >
                                        {feat.icon}
                                    </div>
                                    {/* Title */}
                                    <h3 className="font-semibold text-[#2C2C2C] text-base mb-2">{feat.title}</h3>
                                    {/* Desc */}
                                    <p className="text-sm text-[#717182] leading-relaxed">{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== FOOTER ===== */}
                <footer style={{ background: '#2C2C2C' }} className="pt-12 pb-6 px-6">
                    <div className="max-w-screen-xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                            {/* Brand Column */}
                            <div className="md:col-span-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3F51B5,#5C6BC0)' }}>
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <span className="text-white font-semibold text-sm">Sistem Bansos</span>
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                    Platform resmi monitoring dan transparansi penyaluran bantuan sosial oleh Pemerintah Daerah.
                                </p>
                            </div>

                            {/* Tautan Cepat */}
                            <div>
                                <h4 className="text-white text-sm font-semibold mb-4">Tautan Cepat</h4>
                                <ul className="space-y-3">
                                    {['Beranda', 'Tentang Kami', 'Panduan', 'FAQ'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}
                                                onMouseEnter={e => e.target.style.color = '#fff'}
                                                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                                            >{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Informasi Legal */}
                            <div>
                                <h4 className="text-white text-sm font-semibold mb-4">Informasi Legal</h4>
                                <ul className="space-y-3">
                                    {['Syarat & Ketentuan', 'Kebijakan Privasi', 'Keamanan Data', 'Laporan Audit'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}
                                                onMouseEnter={e => e.target.style.color = '#fff'}
                                                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                                            >{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Hubungi Kami */}
                            <div>
                                <h4 className="text-white text-sm font-semibold mb-4">Hubungi Kami</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>+62 21 1234 5678</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>info@sistembansos.go.id</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.55)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Jakarta, Indonesia</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="pt-6" style={{ borderTop: '0.8px solid rgba(255,255,255,0.1)' }}>
                            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                © 2026 Sistem Bansos. Seluruh hak cipta dilindungi undang-undang.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            <ModalLaporanAnonim
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            <style>{`
                @keyframes toastIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>
        </>
    );
}
