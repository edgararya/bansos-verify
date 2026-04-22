import { useForm, usePage } from '@inertiajs/react';
import CitizenLayout from '@/Components/CitizenLayout';

export default function PortalPengaduan() {
    const { complaints } = usePage().props;
    const list = complaints ?? [];

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        kategori: 'laporan-resmi',
        lokasi: 'Kelurahan',
        deskripsi: '',
        is_anonymous: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('citizen.complaint.store'), {
            onSuccess: () => reset(),
        });
    }

    const STATUS_COLOR = {
        'Menunggu': { bg: '#f5f7fa', text: '#717182', border: 'rgba(0,0,0,0.1)' },
        'Sedang Diproses': { bg: 'rgba(22,36,86,0.08)', text: '#3f51b5', border: 'rgba(63,81,181,0.3)' },
        'Selesai': { bg: 'rgba(0,121,107,0.08)', text: '#00796b', border: 'rgba(0,121,107,0.3)' },
        'Ditolak': { bg: 'rgba(211,47,47,0.08)', text: '#d32f2f', border: 'rgba(211,47,47,0.3)' },
    };

    return (
        <CitizenLayout activeMenu="portal-pengaduan">
            <div className="px-4 sm:px-6 lg:px-12 pt-6 lg:pt-12 pb-10 lg:pb-16 flex flex-col gap-6">
                <div>
                    <h1 className="text-[#2c2c2c] font-bold text-3xl leading-9">Portal Pengaduan</h1>
                    <p className="text-[#717182] text-base mt-2">
                        Laporkan indikasi kecurangan penyaluran bantuan sosial secara resmi melalui akun Anda.
                    </p>
                </div>

                <div
                    className="bg-white rounded-[14px] shadow-sm"
                    style={{ border: '0.8px solid rgba(0,0,0,0.1)', borderTopWidth: '4px', borderTopColor: '#3f51b5' }}
                >
                    <form onSubmit={submit} className="px-6 py-6 flex flex-col gap-5">
                        <div className="flex items-start gap-3 rounded-[10px] bg-[rgba(63,81,181,0.06)] border border-[rgba(63,81,181,0.2)] p-4">
                            <span className="text-xl text-[#3f51b5]">⚠</span>
                            <div>
                                <p className="text-[#3f51b5] font-medium">Laporan Resmi (Terverifikasi)</p>
                                <p className="text-[#717182] text-sm">
                                    Laporan akan diteruskan beserta data akun Anda sebagai identitas pelapor yang sah
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[10px] bg-[#fffced] border border-[#fef08a] p-4 text-[#854d0e] leading-relaxed">
                            <p>
                                <strong>Perhatian:</strong> Berikan informasi sedetail mungkin (lokasi, nama oknum, jenis bantuan, kronologi) agar tim dapat melakukan investigasi dengan tepat. Laporan palsu atau fitnah dapat dikenakan sanksi sesuai undang-undang.
                            </p>
                        </div>

                        <input type="hidden" name="kategori" value={data.kategori} />
                        <input type="hidden" name="lokasi" value={data.lokasi} />
                        <input type="hidden" name="is_anonymous" value={data.is_anonymous ? '1' : '0'} />

                        <div className="flex flex-col gap-2">
                            <label className="text-[#2c2c2c] text-sm font-medium">Rincian Laporan Pengaduan</label>
                            <textarea
                                value={data.deskripsi}
                                onChange={e => setData('deskripsi', e.target.value)}
                                rows={7}
                                placeholder="Ceritakan kronologi kejadian, lokasi, dan nama pihak yang terlibat..."
                                className="w-full bg-[#f3f3f5] rounded-lg px-3 py-3 text-sm text-[#2c2c2c] placeholder-[#717182] border border-transparent focus:outline-none focus:border-[#3f51b5] focus:bg-white transition resize-none"
                            />
                            {errors.deskripsi && <p className="text-red-500 text-xs">{errors.deskripsi}</p>}
                        </div>

                        <div className="flex items-center gap-4 pt-1">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#3f51b5] hover:bg-[#3447a3] text-white font-medium text-sm px-6 h-9 rounded-lg transition disabled:opacity-60"
                            >
                                {processing ? 'Mengirim...' : 'Kirim Laporan Pengaduan'}
                            </button>
                            <button
                                type="button"
                                className="text-[#2c2c2c] text-sm font-medium"
                                onClick={() => reset('deskripsi')}
                            >
                                Batal
                            </button>
                            {recentlySuccessful && (
                                <p className="text-[#007a55] text-sm font-medium">✓ Laporan berhasil dikirim!</p>
                            )}
                        </div>
                    </form>
                </div>

                {list.length > 0 && (
                    <div className="bg-white rounded-[14px] border border-black/10 shadow-sm">
                        <div className="px-6 pt-5 pb-4 border-b border-black/10">
                            <p className="text-[#2c2c2c] font-medium text-base">Riwayat Laporan Saya</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/10">
                                        <th className="text-left px-6 py-3 text-[#717182] font-medium">Tanggal</th>
                                        <th className="text-left px-4 py-3 text-[#717182] font-medium">Kategori</th>
                                        <th className="text-left px-4 py-3 text-[#717182] font-medium">Lokasi</th>
                                        <th className="text-left px-4 py-3 text-[#717182] font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item, i) => {
                                        const sc = STATUS_COLOR[item.status] ?? STATUS_COLOR['Menunggu'];
                                        return (
                                            <tr key={i} className="border-b border-black/5 last:border-0">
                                                <td className="px-6 py-3 text-[#2c2c2c]">{item.tanggal}</td>
                                                <td className="px-4 py-3 text-[#2c2c2c]">{item.kategori}</td>
                                                <td className="px-4 py-3 text-[#717182]">{item.lokasi}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className="inline-block px-2 py-0.5 rounded-lg text-xs font-medium"
                                                        style={{ background: sc.bg, color: sc.text, border: `0.8px solid ${sc.border}` }}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </CitizenLayout>
    );
}
