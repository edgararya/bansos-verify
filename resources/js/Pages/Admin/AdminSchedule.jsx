import { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

const imgBroadcast = "https://www.figma.com/api/mcp/asset/cc41064e-1236-4bbc-85a1-e5498acc3be7";
const imgDone      = "https://www.figma.com/api/mcp/asset/25b0e8ec-a1b0-4079-8022-f70c713c72af";

const SAMPLE_CHECKLIST = [
    { id: 1, nama: 'Rina Marlina', nik: '3171234567890126', jenis: 'Bantuan Tunai',  status: 'Siap Diambil' },
    { id: 2, nama: 'Kartini',      nik: '3171234567890128', jenis: 'Bantuan Pangan', status: 'Telah Disalurkan' },
    { id: 3, nama: 'Siti Aminah',  nik: '3171234567890124', jenis: 'Bantuan Pangan', status: 'Siap Diambil' },
];

export default function AdminSchedule() {
    const { auth, checklist: serverChecklist } = usePage().props;
    const checklist = serverChecklist ?? SAMPLE_CHECKLIST;

    const { data, setData, post, processing, reset, recentlySuccessful } = useForm({
        tanggal: '',
        lokasi: 'Kantor Kelurahan Suka Maju',
        pesan: '',
    });

    function submitBroadcast(e) {
        e.preventDefault();
        post(route('admin.schedule.broadcast'), {
            onSuccess: () => reset('tanggal', 'pesan'),
        });
    }

    function tandaiSelesai(id) {
        // We'll let the fetch handle it and Inertia reload the data
        if (typeof window !== 'undefined') {
            fetch(route('admin.schedule.mark-done'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content ?? '' 
                },
                body: JSON.stringify({ id }),
            }).then(() => {
                router.reload({ only: ['checklist'] });
            });
        }
    }

    return (
        <AdminLayout activeMenu="jadwal" user={auth?.user}>
            <div className="px-4 sm:px-6 lg:px-12 pt-6 lg:pt-12 pb-10 lg:pb-16 flex flex-col gap-6">
                <div>
                    <h1 className="text-[#2c2c2c] font-bold text-3xl leading-9">Manajemen Jadwal Penyaluran</h1>
                    <p className="text-[#717182] text-base mt-2">
                        Broadcast jadwal dan kelola daftar hadir pengambilan bansos.
                    </p>
                </div>

                <div className="flex flex-col xl:flex-row gap-6 items-start">
                    <div
                        className="bg-white rounded-[14px] shadow-sm flex flex-col w-full xl:w-[220px] shrink-0"
                        style={{ border: '0.8px solid rgba(0,0,0,0.1)', borderTopWidth: '4px', borderTopColor: '#fe9a00' }}
                    >
                        <div className="px-6 pt-5 pb-3 flex items-center gap-2" style={{ borderBottom: '0.8px solid rgba(0,0,0,0.08)' }}>
                            <img src={imgBroadcast} alt="" className="w-5 h-5 shrink-0" />
                            <p className="text-[#2c2c2c] font-medium text-[18px] leading-7">Broadcast Jadwal</p>
                        </div>
                        <form onSubmit={submitBroadcast} className="px-5 py-4 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#2c2c2c] text-sm font-medium">Tanggal Pengambilan</label>
                                <input
                                    type="date"
                                    value={data.tanggal}
                                    onChange={e => setData('tanggal', e.target.value)}
                                    className="bg-[#f3f3f5] rounded-lg px-3 py-1.5 text-sm text-[#2c2c2c] border border-transparent focus:outline-none focus:border-[#00796b] focus:bg-white transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#2c2c2c] text-sm font-medium">Lokasi</label>
                                <input
                                    type="text"
                                    value={data.lokasi}
                                    onChange={e => setData('lokasi', e.target.value)}
                                    className="bg-[#f3f3f5] rounded-lg px-3 py-1.5 text-sm text-[#2c2c2c] border border-transparent focus:outline-none focus:border-[#00796b] focus:bg-white transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#2c2c2c] text-sm font-medium">Pesan Tambahan</label>
                                <textarea
                                    value={data.pesan}
                                    onChange={e => setData('pesan', e.target.value)}
                                    rows={4}
                                    placeholder="Contoh: Harap membawa fotokopi KK dan KTP asli"
                                    className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-sm text-[#717182] placeholder-[#717182] border border-transparent focus:outline-none focus:border-[#00796b] focus:bg-white transition resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing || !data.tanggal}
                                className="w-full bg-[#fe9a00] hover:bg-[#e58900] text-white font-medium text-sm py-2 rounded-lg transition disabled:opacity-60"
                            >
                                {processing ? 'Mengirim...' : 'Umumkan ke Warga'}
                            </button>
                            {recentlySuccessful && (
                                <p className="text-[#007a55] text-xs text-center">✓ Berhasil disiarkan!</p>
                            )}
                        </form>
                    </div>

                    <div className="flex-1 bg-white rounded-[14px] border border-black/10 shadow-sm overflow-hidden">
                        <div className="px-6 pt-5 pb-3" style={{ borderBottom: '0.8px solid rgba(0,0,0,0.08)' }}>
                            <p className="text-[#2c2c2c] font-medium text-[18px]">Checklist Pengambilan Hari Ini</p>
                            <p className="text-[#717182] text-base mt-1">
                                Tandai warga yang sudah mengambil bansos secara fisik.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '0.8px solid rgba(0,0,0,0.1)' }}>
                                        <th className="text-left px-4 py-3 text-[#2c2c2c] font-medium">Nama & NIK</th>
                                        <th className="text-left px-4 py-3 text-[#2c2c2c] font-medium">Jenis Bantuan</th>
                                        <th className="text-left px-4 py-3 text-[#2c2c2c] font-medium">Status</th>
                                        <th className="text-right px-4 py-3 text-[#2c2c2c] font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checklist.map((row, i) => {
                                        const isDone = row.status === 'Telah Disalurkan';
                                        return (
                                            <tr
                                                key={row.id}
                                                style={{ borderBottom: i < checklist.length - 1 ? '0.8px solid rgba(0,0,0,0.08)' : 'none' }}
                                            >
                                                <td className="px-4 py-3">
                                                    <p className="text-[#2c2c2c] font-medium">{row.nama}</p>
                                                    <p className="text-[#717182] text-xs">{row.nik}</p>
                                                </td>
                                                <td className="px-4 py-3 text-[#2c2c2c]">{row.jenis}</td>
                                                <td className="px-4 py-3">
                                                    {isDone ? (
                                                        <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-medium text-white" style={{ background: '#00bc7d' }}>
                                                            Telah Disalurkan
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-medium text-[#1447e6]" style={{ background: '#eff6ff', border: '0.8px solid #bedbff' }}>
                                                            Siap Diambil
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {isDone ? (
                                                        <span className="inline-flex items-center gap-1 text-[#009966] text-sm font-medium opacity-60">
                                                            <img src={imgDone} alt="" className="w-4 h-4" />
                                                            Berhasil
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => tandaiSelesai(row.id)}
                                                            className="border border-[#00796b] text-[#00796b] text-sm font-medium px-3 h-8 rounded-lg hover:bg-[rgba(0,121,107,0.05)] transition"
                                                        >
                                                            Tandai Selesai
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
