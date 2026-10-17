import { usePage } from '@inertiajs/react';
import AuditorLayout from '@/Components/AuditorLayout';

const imgDownload = "https://www.figma.com/api/mcp/asset/4231545c-1e16-4b1f-bdc6-79189d935416";
const imgChart    = "https://www.figma.com/api/mcp/asset/9eca002b-fe4b-4a87-9dbe-3bd047e68dcb";

const STATS = [
    {
        label: 'Total Dana Tersalurkan',
        value: 'Rp 4.5 Miliar',
        sub: 'Bulan Ini - Kabupaten XYZ',
        color: '#00d492',
    },
    {
        label: 'Aduan Masyarakat',
        value: '124 Tiket',
        sub: 'Menunggu Resolusi & Investigasi',
        color: '#ff8904',
    },
    {
        label: 'Akurasi Sasaran AI',
        value: '92.5%',
        sub: 'Berdasarkan Audit Validasi Silang',
        color: '#51a2ff',
    },
];

export default function LaporanEksekutif() {
    const { auth, stats: serverStats } = usePage().props;
    const stats = serverStats ?? STATS;

    function handleExport() {
        window.location.href = route('auditor.export-csv');
    }

    return (
        <AuditorLayout activeMenu="laporan" user={auth?.user}>
            <div className="px-12 pt-12 pb-16 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-white font-bold text-3xl leading-9">Laporan Eksekutif</h1>
                        <p className="text-[#a1a1a1] text-base mt-2">
                            Analitik transparansi & efektivitas untuk Gubernur/Bupati.
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-5 h-9 rounded-lg text-sm font-medium text-white transition"
                        style={{ background: '#155dfc' }}
                    >
                        <img src={imgDownload} alt="" className="w-4 h-4" />
                        Export CSV Data Kelurahan
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {stats.map(stat => (
                        <div
                            key={stat.label}
                            className="rounded-[14px] p-6 flex flex-col gap-6"
                            style={{ background: '#171717', border: '0.8px solid #262626' }}
                        >
                            <p className="text-[#a1a1a1] text-sm text-center uppercase tracking-[0.7px]">
                                {stat.label}
                            </p>
                            <p
                                className="text-3xl font-bold text-center"
                                style={{ color: stat.color }}
                            >
                                {stat.value}
                            </p>
                            <p className="text-[#737373] text-xs text-center">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                <div
                    className="rounded-[14px] flex flex-col items-center justify-center gap-4 py-16 px-8"
                    style={{ background: '#0a0a0a', border: '0.8px dashed #262626' }}
                >
                    <img src={imgChart} alt="" className="w-16 h-16 opacity-60" />
                    <p className="text-[#d4d4d4] font-medium text-xl text-center">
                        Modul Grafik Dinamis (Placeholder)
                    </p>
                    <p className="text-[#737373] text-base text-center max-w-lg">
                        Di versi production, area ini akan menampilkan grafik Line Chart tren kemiskinan dan Pie Chart distribusi demografi menggunakan Recharts untuk dilaporkan ke eksekutif.
                    </p>
                </div>
            </div>
        </AuditorLayout>
    );
}
