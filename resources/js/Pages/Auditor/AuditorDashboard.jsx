import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AuditorLayout from '@/Components/AuditorLayout';

const imgMsg = "https://www.figma.com/api/mcp/asset/24914e47-6cb3-4bae-9349-8dcb77418275";

const SAMPLE_REPORTS = [
    { id: 1, tanggal: '16 Apr 2026', risiko: 'High',   pelapor: 'Anonim', isAnonim: true,  aduan: 'Ada dugaan pungli di desa Suka Maju.', status: 'Menunggu Investigasi' },
    { id: 2, tanggal: '15 Apr 2026', risiko: 'Medium', pelapor: 'Budi',   isAnonim: false, aduan: 'Data penerima bansos tidak tepat sasaran.', status: 'Sedang Diproses' },
];

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

export default function AuditorDashboard() {
    const { auth, reports: serverReports } = usePage().props;
    const reports = serverReports ?? SAMPLE_REPORTS;

    return (
        <AuditorLayout activeMenu="whistleblowing" user={auth?.user}>
            <div className="px-4 sm:px-6 lg:px-12 pt-6 lg:pt-12 pb-10 lg:pb-16 flex flex-col gap-6">
                <div>
                    <h1 className="text-white font-bold text-3xl leading-9">Whistleblowing Desk</h1>
                    <p className="text-[#a1a1a1] text-base mt-2">
                        Ruang pelaporan anonim tertutup. Admin kelurahan <span className="text-[#ff6467] font-semibold">TIDAK BISA</span> melihat dasbor ini.
                    </p>
                </div>

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
                                    {['Tanggal', 'Level Risiko', 'Pelapor', 'Deskripsi Aduan', 'Status'].map(h => (
                                        <th key={h} className="text-left px-3 py-3 text-[#a1a1a1] font-medium whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        style={{ borderBottom: i < reports.length - 1 ? '0.8px solid #262626' : 'none' }}
                                    >
                                        <td className="px-3 py-4 text-[#a1a1a1] whitespace-nowrap">{row.tanggal}</td>
                                        <td className="px-3 py-4">
                                            <RisikoBadge risiko={row.risiko} />
                                        </td>
                                        <td className="px-3 py-4 text-white">
                                            {row.pelapor}
                                            {row.isAnonim && <span className="text-[#737373] text-[10px] ml-1 uppercase">(ID Terenkripsi)</span>}
                                        </td>
                                        <td className="px-3 py-4 text-[#d4d4d4] max-w-md truncate">{row.aduan}</td>
                                        <td className="px-3 py-4">
                                            <span className="text-[#fe9a00] font-medium">{row.status}</span>
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
