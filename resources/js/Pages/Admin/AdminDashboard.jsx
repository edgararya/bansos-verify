import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';
import ModalValidasi from '@/Components/ModalValidasi';

const imgSearch = "https://www.figma.com/api/mcp/asset/aeb7ef3f-20e4-42a9-a096-afca488954cd";
const imgCheck  = "https://www.figma.com/api/mcp/asset/b88281c9-662a-42cc-8dac-3b2fb90023d9";
const imgView   = "https://www.figma.com/api/mcp/asset/a19ac471-df20-47bb-a5d5-e092d2bc87a1";

const SAMPLE = [
    { id: 1, nama: 'Siti Aminah',  nik: '3171234567890124', pekerjaan: 'Pedagang Kecil',   penghasilan: 'Rp 1.200.000/bln', tanggungan: '3 orang', skor: 92, status: 'Menunggu',     statusColor: '#00796b', ktp_photo: null },
    { id: 2, nama: 'Budi Santoso', nik: '3171234567890123', pekerjaan: 'Buruh Harian',     penghasilan: 'Rp 1.500.000/bln', tanggungan: '2 orang', skor: 85, status: 'Menunggu',     statusColor: '#00796b', ktp_photo: null },
    { id: 3, nama: 'Rina Marlina', nik: '3171234567890126', pekerjaan: 'Ibu Rumah Tangga', penghasilan: 'Rp 2.000.000/bln', tanggungan: '4 orang', skor: 75, status: 'Terverifikasi', statusColor: '#3f51b5', ktp_photo: null },
    { id: 4, nama: 'Joko Widodo',  nik: '3171234567890125', pekerjaan: 'Karyawan Swasta',  penghasilan: 'Rp 4.500.000/bln', tanggungan: '1 orang', skor: 45, status: 'Menunggu',     statusColor: '#00796b', catatan: null },
    { id: 5, nama: 'Ahmad Dahlan', nik: '3171234567890127', pekerjaan: 'PNS',              penghasilan: 'Rp 7.000.000/bln', tanggungan: '0 orang', skor: 30, status: 'Ditolak',      statusColor: '#d32f2f', catatan: 'Pendapatan melebihi batas kelayakan' },
];

function getSkorStyle(skor) {
    if (skor >= 70) return { bg: '#d0fae5', border: '#00bc7d', text: '#007a55' };
    if (skor >= 50) return { bg: '#fef3c6', border: '#fe9a00', text: '#bb4d00' };
    return { bg: '#ffe2e2', border: '#fb2c36', text: '#c10007' };
}

export default function AdminDashboard() {
    const { auth, applicants: serverData } = usePage().props;
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    const list = serverData ?? SAMPLE;

    const filtered = list.filter(d =>
        d.nama.toLowerCase().includes(search.toLowerCase()) || d.nik.includes(search)
    );

    function handleSuccess() {
        // Inertia will reload data, so we don't necessarily need to update state manually
        // but if we want immediate feedback before reload:
        // setList(prev => ...)
    }

    return (
        <AdminLayout activeMenu="prioritas" user={auth?.user}>
            <div className="px-4 sm:px-6 lg:px-12 pt-6 lg:pt-12 pb-10 lg:pb-16 flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
                    <div>
                        <h1 className="text-[#2c2c2c] font-bold text-3xl leading-9">Tabel Prioritas Pemohon</h1>
                        <p className="text-[#717182] text-base mt-2">
                            Daftar telah diurutkan berdasarkan skor kelayakan tertinggi untuk mempercepat validasi.
                        </p>
                    </div>
                    <div className="relative">
                        <img src={imgSearch} alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari nama atau NIK..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-[#f3f3f5] rounded-lg pl-9 pr-3 py-2 text-sm text-[#2c2c2c] placeholder-[#717182] border border-transparent focus:outline-none focus:border-[#00796b] w-52"
                        />
                    </div>
                </div>

                <div
                    className="bg-white rounded-[14px] shadow overflow-hidden"
                    style={{ border: '0.8px solid rgba(0,0,0,0.1)', borderTopWidth: '4px', borderTopColor: '#00796b' }}
                >
                    <div
                        className="flex items-start gap-3 px-4 py-4"
                        style={{ background: '#ecfdf5', borderBottom: '0.8px solid #d0fae5' }}
                    >
                        <img src={imgCheck} alt="" className="w-5 h-5 mt-0.5 shrink-0" />
                        <p className="text-[#006045] text-sm">
                            <strong>Tips Validasi Lapangan:</strong> Warga dengan sorotan{' '}
                            <span className="font-semibold text-[#007a55]">hijau</span>{' '}
                            (Skor &gt; 70%) adalah prioritas utama. Klik tombol <strong>Validasi</strong> untuk membuka detail KTP dan membuat keputusan.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '0.8px solid rgba(0,0,0,0.1)' }}>
                                    <th className="text-left px-3 py-3 text-[#2c2c2c] font-medium">Nama Lengkap & NIK</th>
                                    <th className="text-left px-3 py-3 text-[#2c2c2c] font-medium">Pekerjaan & Penghasilan</th>
                                    <th className="text-center px-3 py-3 text-[#2c2c2c] font-medium">Skor Kelayakan</th>
                                    <th className="text-left px-3 py-3 text-[#2c2c2c] font-medium">Status</th>
                                    <th className="text-right px-3 py-3 text-[#2c2c2c] font-medium">Document Approval</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((row, i) => {
                                    const sc = getSkorStyle(row.skor);
                                    const isGreen = row.skor >= 70;
                                    return (
                                        <tr
                                            key={row.id}
                                            style={{
                                                borderBottom: i < filtered.length - 1 ? '0.8px solid rgba(0,0,0,0.08)' : 'none',
                                                background: isGreen ? 'rgba(236,253,245,0.4)' : 'white',
                                            }}
                                        >
                                            <td className="px-3 py-4">
                                                <p className="text-[#2c2c2c] font-medium">{row.nama}</p>
                                                <p className="text-[#717182] text-xs mt-0.5">{row.nik}</p>
                                            </td>
                                            <td className="px-3 py-4">
                                                <p className="text-[#2c2c2c]">{row.pekerjaan}</p>
                                                <p className="text-[#717182] text-xs mt-0.5">{row.penghasilan}</p>
                                            </td>
                                            <td className="px-3 py-4 text-center">
                                                <div
                                                    className="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm"
                                                    style={{ background: sc.bg, border: `4px solid ${sc.border}`, color: sc.text }}
                                                >
                                                    {row.skor}%
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <span
                                                    className="inline-block px-2 py-0.5 rounded-lg text-xs font-medium text-white"
                                                    style={{ background: row.statusColor }}
                                                >
                                                    {row.status}
                                                </span>
                                                {row.catatan && (
                                                    <p className="text-[#fb2c36] text-[10px] mt-1">{row.catatan}</p>
                                                )}
                                            </td>
                                            <td className="px-3 py-4 text-right">
                                                <button
                                                    onClick={() => setSelected(row)}
                                                    className="inline-flex items-center gap-2 border border-black/10 bg-white rounded-lg px-3 h-8 text-sm font-medium text-[#2c2c2c] hover:bg-[rgba(0,121,107,0.05)] hover:border-[#00796b] transition"
                                                >
                                                    <img src={imgView} alt="" className="w-4 h-4" />
                                                    Validasi
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ModalValidasi
                applicant={selected}
                onClose={() => setSelected(null)}
                onSuccess={handleSuccess}
            />
        </AdminLayout>
    );
}
