import { usePage } from '@inertiajs/react';
import AuditorLayout from '@/Components/AuditorLayout';
import { Download } from 'lucide-react';
import {
    ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, Tooltip as PieTooltip,
} from 'recharts';

/* ── Fallback data biar chart tidak kosong saat DB masih kosong ── */
const FALLBACK_TREND = [
    { bulan: 'Nov', disetujui: 0, ditolak: 0, pending: 0 },
    { bulan: 'Des', disetujui: 0, ditolak: 0, pending: 0 },
    { bulan: 'Jan', disetujui: 0, ditolak: 0, pending: 0 },
    { bulan: 'Feb', disetujui: 0, ditolak: 0, pending: 0 },
    { bulan: 'Mar', disetujui: 0, ditolak: 0, pending: 0 },
    { bulan: 'Apr', disetujui: 1, ditolak: 0, pending: 1 },
];

const FALLBACK_DISTRIBUSI = [
    { name: 'Tidak Bekerja',  value: 1 },
    { name: 'Pekerja Informal', value: 1 },
    { name: 'Pekerja Formal',  value: 0 },
];

const STATS_FALLBACK = [
    { label: 'Total Dana Tersalurkan', value: 'Rp 0.0 Miliar', sub: 'Bulan Ini - Kabupaten XYZ', color: '#00d492' },
    { label: 'Aduan Masyarakat',       value: '0 Tiket',       sub: 'Menunggu Resolusi & Investigasi', color: '#ff8904' },
    { label: 'Akurasi Sasaran AI',     value: '0%',            sub: 'Berdasarkan Audit Validasi Silang', color: '#51a2ff' },
];

const PIE_COLORS = ['#ff6467', '#ff8904', '#51a2ff'];

/* ── Custom Tooltip untuk Line Chart ── */
function CustomLineTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div
            className="rounded-[10px] px-4 py-3 text-sm shadow-lg"
            style={{ background: '#1a1a1a', border: '0.8px solid #333' }}
        >
            <p className="text-[#a1a1a1] font-medium mb-2">{label}</p>
            {payload.map(p => (
                <p key={p.dataKey} style={{ color: p.color }} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
                    {p.name}: <strong>{p.value}</strong>
                </p>
            ))}
        </div>
    );
}

/* ── Custom Tooltip untuk Pie Chart ── */
function CustomPieTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    return (
        <div
            className="rounded-[10px] px-3 py-2 text-sm shadow-lg"
            style={{ background: '#1a1a1a', border: '0.8px solid #333' }}
        >
            <p style={{ color: payload[0].payload.fill }} className="font-medium">{payload[0].name}</p>
            <p className="text-white">{payload[0].value} permohonan</p>
        </div>
    );
}

export default function LaporanEksekutif() {
    const { auth, stats: serverStats, chartTrend: serverTrend, chartDistribusi: serverDist } = usePage().props;
    const stats       = (serverStats && serverStats.length) ? serverStats : STATS_FALLBACK;
    const chartTrend  = (serverTrend && serverTrend.length) ? serverTrend : FALLBACK_TREND;
    const chartDist   = (serverDist  && serverDist.length)  ? serverDist  : FALLBACK_DISTRIBUSI;

    /* total untuk persentase pie */
    const totalDist = chartDist.reduce((s, d) => s + d.value, 0) || 1;

    function handleExport() {
        window.location.href = route('auditor.export-csv');
    }

    return (
        <AuditorLayout activeMenu="laporan" user={auth?.user}>
            <div className="px-4 sm:px-6 lg:px-12 pt-6 lg:pt-12 pb-10 lg:pb-16 flex flex-col gap-6">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-white font-bold text-3xl leading-9">Laporan Eksekutif</h1>
                        <p className="text-[#a1a1a1] text-base mt-2">
                            Analitik transparansi &amp; efektivitas untuk Gubernur/Bupati.
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-5 h-9 rounded-lg text-sm font-medium text-white transition self-start lg:self-auto"
                        style={{ background: '#155dfc' }}
                    >
                        <Download size={16} />
                        Export CSV Data Kelurahan
                    </button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map(stat => (
                        <div
                            key={stat.label}
                            className="rounded-[14px] p-5 flex flex-col gap-2"
                            style={{ background: '#171717', border: '0.8px solid #262626' }}
                        >
                            <p className="text-[#a1a1a1] text-xs uppercase tracking-[0.7px]">{stat.label}</p>
                            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                            <p className="text-[#737373] text-xs">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Charts Row ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Line Chart — Tren Permohonan (2/3 lebar) */}
                    <div
                        className="xl:col-span-2 rounded-[14px] p-5"
                        style={{ background: '#171717', border: '0.8px solid #262626', borderTopWidth: '4px', borderTopColor: '#ff8904' }}
                    >
                        <p className="text-white font-semibold text-sm mb-1">Tren Permohonan 6 Bulan Terakhir</p>
                        <p className="text-[#737373] text-xs mb-5">Jumlah permohonan per status per bulan</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={chartTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                                <XAxis
                                    dataKey="bulan"
                                    tick={{ fill: '#737373', fontSize: 11 }}
                                    axisLine={{ stroke: '#333' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fill: '#737373', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomLineTooltip />} />
                                <Legend
                                    wrapperStyle={{ fontSize: '11px', color: '#a1a1a1', paddingTop: '12px' }}
                                />
                                <Line type="monotone" dataKey="disetujui" name="Disetujui" stroke="#00d492" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="ditolak"   name="Ditolak"   stroke="#ff6467" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="pending"   name="Menunggu"  stroke="#ff8904" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart — Distribusi Pekerjaan (1/3 lebar) */}
                    <div
                        className="rounded-[14px] p-5"
                        style={{ background: '#171717', border: '0.8px solid #262626', borderTopWidth: '4px', borderTopColor: '#51a2ff' }}
                    >
                        <p className="text-white font-semibold text-sm mb-1">Distribusi Status Pekerjaan</p>
                        <p className="text-[#737373] text-xs mb-3">Berdasarkan data permohonan aktif</p>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={chartDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {chartDist.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <PieTooltip content={<CustomPieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend manual */}
                        <div className="mt-3 flex flex-col gap-2">
                            {chartDist.map((d, i) => (
                                <div key={d.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                        <span className="text-[#a1a1a1] text-xs">{d.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-white text-xs font-medium">{d.value}</span>
                                        <span className="text-[#737373] text-xs ml-1">({Math.round(d.value / totalDist * 100)}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info footer */}
                <p className="text-[#525252] text-xs text-center">
                    Data diperbarui secara real-time dari database kelurahan · Export CSV tersedia untuk pelaporan resmi
                </p>
            </div>
        </AuditorLayout>
    );
}
