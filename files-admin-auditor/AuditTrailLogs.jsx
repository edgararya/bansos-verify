import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AuditorLayout from '@/Components/AuditorLayout';

const imgApprove = "https://www.figma.com/api/mcp/asset/9d81f4a1-5bf8-431d-a076-d9f83676e98c";
const imgReject  = "https://www.figma.com/api/mcp/asset/53be69c4-a4a4-4c23-b6c6-1fd0ce0c13fc";
const imgSuspend = "https://www.figma.com/api/mcp/asset/d1919eeb-3630-4b22-8ca3-3dea05c03f21";

const SAMPLE_LOGS = [
    { id: 1, timestamp: '16 Apr 2026 10:30', pelaku: 'Bapak RT / Admin',   warga: 'Joko Widodo',   skor: 45, aksi: 'Disetujui', bypass: true,  rowBg: 'rgba(70,8,9,0.15)' },
    { id: 2, timestamp: '16 Apr 2026 09:15', pelaku: 'Operator Kelurahan', warga: 'Siti Aminah',   skor: 92, aksi: 'Disetujui', bypass: false, rowBg: 'transparent' },
    { id: 3, timestamp: '15 Apr 2026 14:20', pelaku: 'Bapak RT / Admin',   warga: 'Ahmad Dahlan',  skor: 30, aksi: 'Ditolak',   bypass: false, rowBg: 'transparent' },
];

function SkorBadge({ skor }) {
    const isHigh = skor >= 70;
    return (
        <span
            className="inline-block px-2 py-0.5 rounded text-xs font-bold"
            style={{
                background: isHigh ? 'rgba(0,44,34,0.8)' : 'rgba(70,8,9,0.8)',
                border: `0.8px solid ${isHigh ? 'rgba(0,79,59,0.5)' : 'rgba(130,24,26,0.5)'}`,
                color: isHigh ? '#00bc7d' : '#fb2c36',
            }}
        >
            {skor}%
        </span>
    );
}

function AksiBadge({ aksi }) {
    const isApprove = aksi === 'Disetujui';
    return (
        <span className={`flex items-center gap-1 text-sm font-medium ${isApprove ? 'text-[#00d492]' : 'text-[#ff6467]'}`}>
            <img src={isApprove ? imgApprove : imgReject} alt="" className="w-4 h-4" />
            {aksi}
        </span>
    );
}

export default function AuditTrailLogs() {
    const { auth, logs: serverLogs } = usePage().props;
    const [logs, setLogs] = useState(serverLogs ?? SAMPLE_LOGS);
    const [suspendLoading, setSuspendLoading] = useState(null);

    function handleSuspend(logId) {
        setSuspendLoading(logId);
        router.post(
            route('auditor.suspend', logId),
            {},
            {
                onSuccess: () => {
                    setLogs(prev => prev.map(l => l.id === logId ? { ...l, suspended: true } : l));
                    setSuspendLoading(null);
                },
                onError: () => setSuspendLoading(null),
            }
        );
    }

    return (
        <AuditorLayout activeMenu="audit" user={auth?.user}>
            <div className="px-12 pt-12 pb-16 flex flex-col gap-6">
                <div>
                    <h1 className="text-white font-bold text-3xl leading-9">Audit Trail Logs (Jejak Admin)</h1>
                    <p className="text-[#a1a1a1] text-base mt-2">
                        Pantau seluruh keputusan setujui/tolak yang dibuat oleh Admin Desa di lapangan.
                    </p>
                </div>

                <div
                    className="rounded-[14px] overflow-hidden"
                    style={{ background: '#171717', border: '0.8px solid #262626', borderTopWidth: '4px', borderTopColor: '#fb2c36' }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ background: '#0a0a0a', borderBottom: '0.8px solid #262626' }}>
                                    {['Timestamp', 'Pelaku (Admin/Operator)', 'Objek (Warga)', 'Skor Awal', 'Aksi Final', 'Sidang Pembekuan (Bypass)'].map(h => (
                                        <th key={h} className="text-left px-3 py-3 text-[#a1a1a1] font-medium whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        style={{
                                            borderBottom: i < logs.length - 1 ? '0.8px solid #262626' : 'none',
                                            background: row.rowBg ?? 'transparent',
                                        }}
                                    >
                                        <td className="px-3 py-3 text-[#a1a1a1] font-mono text-xs whitespace-nowrap">
                                            {row.timestamp}
                                        </td>
                                        <td className="px-3 py-3 text-white">{row.pelaku}</td>
                                        <td className="px-3 py-3 text-white font-medium">{row.warga}</td>
                                        <td className="px-3 py-3">
                                            <SkorBadge skor={row.skor} />
                                        </td>
                                        <td className="px-3 py-3">
                                            <AksiBadge aksi={row.aksi} />
                                        </td>
                                        <td className="px-3 py-3">
                                            {row.bypass ? (
                                                row.suspended ? (
                                                    <span className="text-[#737373] text-xs italic">Telah Disuspend</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSuspend(row.id)}
                                                        disabled={suspendLoading === row.id}
                                                        className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm font-bold text-[#ff6467] transition disabled:opacity-60"
                                                        style={{ background: '#460809', border: '0.8px solid #9f0712' }}
                                                    >
                                                        <img src={imgSuspend} alt="" className="w-4 h-4" />
                                                        {suspendLoading === row.id ? '...' : 'Suspend'}
                                                    </button>
                                                )
                                            ) : (
                                                <span className="text-[#737373] text-xs italic">Aman</span>
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
