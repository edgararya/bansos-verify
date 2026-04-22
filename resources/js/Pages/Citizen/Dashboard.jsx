import { usePage } from '@inertiajs/react';
import CitizenLayout from '@/Components/CitizenLayout';

const imgClock   = "https://www.figma.com/api/mcp/asset/5203b1d2-34cb-456b-88dd-969fc86a6060";
const imgEmpty   = "https://www.figma.com/api/mcp/asset/ddfbae96-b85a-4029-abdd-d320ca64bbff";

const STATUS_CONFIG = {
    'MENUNGGU VERIFIKASI': {
        gradient: 'linear-gradient(154.66deg, #FFB900 0%, #FF6900 100%)',
        icon: imgClock,
        description: 'Data Anda sedang dalam tahap peninjauan oleh petugas lapangan. Proses ini memerlukan waktu maksimal 14 hari kerja sejak pemutakhiran data terakhir.',
    },
    'DITERIMA': {
        gradient: 'linear-gradient(154.66deg, #00bc7d 0%, #007a55 100%)',
        icon: imgClock,
        description: 'Selamat! Data Anda telah diverifikasi dan Anda berhak menerima bantuan sosial.',
    },
    'DITOLAK': {
        gradient: 'linear-gradient(154.66deg, #fb2c36 0%, #c10007 100%)',
        icon: imgClock,
        description: 'Maaf, berdasarkan hasil verifikasi data, Anda belum memenuhi kriteria penerima bantuan saat ini.',
    },
};

export default function CitizenDashboard() {
    const { auth, bansos_status, citizen_info, history } = usePage().props;
    const user = auth?.user;

    const statusKey = bansos_status ?? 'MENUNGGU VERIFIKASI';
    const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG['MENUNGGU VERIFIKASI'];

    const info = citizen_info ?? {
        nama: user?.name ?? 'Budi Santoso',
        nik: user?.nik ?? '3171234567890123',
        alamat: 'Jl. Merdeka No. 45, RT 01/RW 02, Jakarta',
        program: 'Bantuan Pangan Non Tunai (BPNT)',
    };

    const riwayat = history ?? [];

    return (
        <CitizenLayout activeMenu="dashboard">
            <div className="px-12 pt-12 pb-16 flex flex-col gap-6">
                <div>
                    <h1 className="text-[#2c2c2c] font-bold text-3xl leading-9">
                        Selamat Datang, {info.nama.split(' ')[0]}
                    </h1>
                    <p className="text-[#717182] text-base mt-2">
                        Pantau status penerimaan bantuan sosial Anda di sini.
                    </p>
                </div>

                <div
                    className="relative rounded-[14px] overflow-hidden shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] h-[316px] flex flex-col items-center justify-center gap-3 px-12 text-center"
                    style={{ background: cfg.gradient }}
                >
                    <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mb-1">
                        <img src={cfg.icon} alt="" className="w-10 h-10" />
                    </div>
                    <p className="text-white/80 text-sm font-semibold uppercase tracking-[1.4px]">Status Saat Ini</p>
                    <p className="text-white font-bold text-5xl leading-tight">{statusKey}</p>
                    <p className="text-white/90 text-base max-w-xl">{cfg.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-[14px] border border-black/10 shadow-sm p-6 flex flex-col gap-4">
                        <h2 className="text-[#2c2c2c] font-medium text-[18px]">Informasi Terdaftar</h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-[#717182] text-xs uppercase tracking-wider mb-1">Nama Lengkap</p>
                                <p className="text-[#2c2c2c] font-medium text-base">{info.nama}</p>
                            </div>
                            <div>
                                <p className="text-[#717182] text-xs uppercase tracking-wider mb-1">NIK</p>
                                <p className="text-[#2c2c2c] font-medium text-base">{info.nik}</p>
                            </div>
                            <div>
                                <p className="text-[#717182] text-xs uppercase tracking-wider mb-1">Alamat</p>
                                <p className="text-[#2c2c2c] font-medium text-base">{info.alamat}</p>
                            </div>
                            <div>
                                <p className="text-[#717182] text-xs uppercase tracking-wider mb-1">Program Bantuan</p>
                                <span className="inline-block bg-[rgba(63,81,181,0.1)] text-[#3f51b5] text-xs font-medium px-3 py-1 rounded-full">
                                    {info.program}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[14px] border border-black/10 shadow-sm p-6 flex flex-col gap-4">
                        <h2 className="text-[#2c2c2c] font-medium text-[18px]">Riwayat Penyaluran</h2>
                        {riwayat.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                                <div className="w-12 h-12 bg-[#f5f7fa] rounded-full flex items-center justify-center">
                                    <img src={imgEmpty} alt="" className="w-6 h-6" />
                                </div>
                                <p className="text-[#717182] text-base text-center">
                                    Belum ada riwayat penyaluran karena status masih dalam proses verifikasi.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {riwayat.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                                        <div>
                                            <p className="text-[#2c2c2c] font-medium text-sm">{item.program}</p>
                                            <p className="text-[#717182] text-xs">{item.tanggal}</p>
                                        </div>
                                        <span className="text-[#007a55] font-semibold text-sm">{item.nominal}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CitizenLayout>
    );
}
