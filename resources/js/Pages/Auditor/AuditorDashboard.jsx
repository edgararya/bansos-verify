import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AuditorLayout from '@/Components/AuditorLayout';

const SAMPLE_REPORTS = [
    { id: 1, tanggal: '16 Apr 2026', risiko: 'High',   pelapor: 'Anonim', isAnonim: true,  aduan: 'Ada dugaan pungli di desa Suka Maju oleh oknum petugas kelurahan. Warga diminta membayar sejumlah uang agar namanya masuk daftar penerima bansos.', status: 'Menunggu' },
    { id: 2, tanggal: '15 Apr 2026', risiko: 'Medium', pelapor: 'Budi',   isAnonim: false, aduan: 'Data penerima bansos tidak tepat sasaran, ada warga mampu yang tetap menerima bantuan padahal sudah memiliki usaha dan kendaraan bermotor.', status: 'Sedang Diproses' },
];

const STATUS_OPTIONS = ['Menunggu', 'Sedang Diproses', 'Selesai', 'Ditolak'];

const STATUS_STYLE = {
    'Menunggu':         { color: '#fe9a00', bg: 'rgba(254,154,0,0.12)',  border: 'rgba(254,154,0,0.3)' },
    'Sedang Diproses':  { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)' },
    'Selesai':          { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.3)' },
    'Ditolak':          { color: '#ff6467', bg: 'rgba(255,100,103,0.12)', border: 'rgba(255,100,103,0.3)' },
};

function RisikoBadge({ risiko }) {
    const isHigh = risiko === 'High' || risiko === 'Tinggi';
    return (
        <span
            className="inline-block px-2 py-0.5 rounded text-xs font-bold"
            style={{
                background: isHigh ? 'rgba(70,8,9,0.8)' : 'rgba(254,154,0,0.15)',
                border: `0.8px solid ${isHigh ? 'rgba(130,24,26,0.5)' : 'rgba(254,154,0,0.3)'}`,
                color: isHigh ? '#ff6467' : '#fe9a00',
            }}
        >
            {risiko}
        </span>
    );
}

function StatusBadge({ status }) {
    const s = STATUS_STYLE[status] ?? STATUS_STYLE['Menunggu'];
    return (
        <span
            className="inline-block px-2 py-0.5 rounded text-xs font-semibold"
            style={{ background: s.bg, color: s.color, border: `0.8px solid ${s.border}` }}
        >
            {status}
        </span>
    );
}

/* Modal Detail Laporan */
function DetailModal({ report, onClose }) {
    if (!report) return null;
    const s = STATUS_STYLE[report.status] ?? STATUS_STYLE['Menunggu'];
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-[16px] p-6 flex flex-col gap-4"
                style={{ background: '#1a1a1a', border: '0.8px solid #333' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-white font-semibold text-base">Detail Laporan #{report.id}</p>
                        <p className="text-[#737373] text-xs mt-0.5">{report.tanggal}</p>
                    </div>
                    <button onClick={onClose} className="text-[#737373] hover:text-white text-xl leading-none">✕</button>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[10px] p-3" style={{ background: '#262626', border: '0.8px solid #333' }}>
                        <p className="text-[#737373] text-xs mb-1">Pelapor</p>
                        <p className="text-white text-sm font-medium">{report.pelapor}{report.isAnonim && <span className="text-[#737373] text-[10px] ml-1 uppercase">(Anonim)</span>}</p>
                    </div>
                    <div className="rounded-[10px] p-3" style={{ background: '#262626', border: '0.8px solid #333' }}>
                        <p className="text-[#737373] text-xs mb-1">Level Risiko</p>
                        <RisikoBadge risiko={report.risiko} />
                    </div>
                </div>

                {/* Deskripsi Lengkap */}
                <div className="rounded-[10px] p-4" style={{ background: '#0f0f0f', border: '0.8px solid #262626' }}>
                    <p className="text-[#737373] text-xs mb-2 uppercase tracking-wide">Deskripsi Aduan</p>
                    <p className="text-[#d4d4d4] text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{report.aduan}</p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                    <p className="text-[#737373] text-xs">Status saat ini:</p>
                    <StatusBadge status={report.status} />
                </div>
            </div>
        </div>
    );
}

export default function AuditorDashboard() {
    const { auth, reports: serverReports, flash } = usePage().props;
    const reports = serverReports ?? [];

    const [detailRow, setDetailRow]   = useState(null);
    const [updating, setUpdating]     = useState(null); // id of row being updated

    function changeStatus(reportId, newStatus) {
        setUpdating(reportId);
        router.patch(
            route('auditor.report.update-status', { id: reportId }),
            { status: newStatus },
            {
                preserveScroll: true,
                onFinish: () => setUpdating(null),
            }
        );
    }

    return (
        <AuditorLayout activeMenu="whistleblowing" user={auth?.user}>
            {/* Detail Modal */}
            <DetailModal report={detailRow} onClose={() => setDetailRow(null)} />

            <div className="px-4 sm:px-6 lg:px-12 pt-6 lg:pt-12 pb-10 lg:pb-16 flex flex-col gap-6">
                <div>
                    <h1 className="text-white font-bold text-3xl leading-9">Whistleblowing Desk</h1>
                    <p className="text-[#a1a1a1] text-base mt-2">
                        Ruang pelaporan anonim tertutup. Admin kelurahan <span className="text-[#ff6467] font-semibold">TIDAK BISA</span> melihat dasbor ini.
                    </p>
                </div>

                {/* Flash success */}
                {flash?.success && (
                    <div className="rounded-[10px] px-4 py-3" style={{ background: 'rgba(74,222,128,0.1)', border: '0.8px solid rgba(74,222,128,0.3)' }}>
                        <p className="text-[#4ade80] text-sm">✓ {flash.success}</p>
                    </div>
                )}

                <div className="rounded-[14px] px-4 py-3" style={{ background: 'rgba(70,8,9,0.45)', border: '0.8px solid rgba(130,24,26,0.6)' }}>
                    <p className="text-[#ffd6d6] text-sm leading-relaxed">
                        <strong>Confidential:</strong> Laporan anonim dilindungi enkripsi. Identitas pelapor tidak pernah direkam. Investigasi laporan berisiko <em>Critical</em> terlebih dahulu sebelum menindak admin di lapangan.
                    </p>
                </div>

                <div
                    className="rounded-[14px] overflow-hidden"
                    style={{ background: '#171717', border: '0.8px solid #262626', borderTopWidth: '4px', borderTopColor: '#ff8904' }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ background: '#0a0a0a', borderBottom: '0.8px solid #262626' }}>
                                    {['Tanggal', 'Level Risiko', 'Pelapor', 'Deskripsi Aduan', 'Status', 'Aksi'].map(h => (
                                        <th key={h} className="text-left px-3 py-3 text-[#a1a1a1] font-medium whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-10 text-center text-[#525252] text-sm">
                                            Belum ada laporan masuk.
                                        </td>
                                    </tr>
                                ) : reports.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        style={{ borderBottom: i < reports.length - 1 ? '0.8px solid #262626' : 'none' }}
                                    >
                                        <td className="px-3 py-4 text-[#a1a1a1] whitespace-nowrap">{row.tanggal}</td>
                                        <td className="px-3 py-4"><RisikoBadge risiko={row.risiko} /></td>
                                        <td className="px-3 py-4 text-white whitespace-nowrap">
                                            {row.pelapor}
                                            {row.isAnonim && <span className="text-[#737373] text-[10px] ml-1 uppercase">(ID Terenkripsi)</span>}
                                        </td>
                                        {/* Deskripsi — terpotong + tombol baca selengkapnya */}
                                        <td className="px-3 py-4 text-[#d4d4d4]" style={{ maxWidth: '220px', width: '220px' }}>
                                            <span className="line-clamp-2 text-sm leading-snug" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{row.aduan}</span>
                                            <button
                                                onClick={() => setDetailRow(row)}
                                                className="text-[#60a5fa] text-xs mt-1 hover:underline"
                                            >
                                                Baca selengkapnya →
                                            </button>
                                        </td>
                                        {/* Status badge */}
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <StatusBadge status={row.status} />
                                        </td>
                                        {/* Aksi: dropdown update status */}
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <select
                                                value={row.status}
                                                disabled={updating === row.id}
                                                onChange={e => changeStatus(row.id, e.target.value)}
                                                className="text-xs rounded-lg px-2 py-1.5 border focus:outline-none disabled:opacity-50 cursor-pointer"
                                                style={{
                                                    background: '#262626',
                                                    color: '#d4d4d4',
                                                    border: '0.8px solid #404040',
                                                }}
                                            >
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            {updating === row.id && (
                                                <span className="text-[#737373] text-[10px] ml-2">menyimpan...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuditorLayout>
    );
}
