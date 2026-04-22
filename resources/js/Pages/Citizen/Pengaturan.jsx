import { useForm, usePage } from '@inertiajs/react';
import CitizenLayout from '@/Components/CitizenLayout';

export default function Pengaturan() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function submitProfile(e) {
        e.preventDefault();
        put(route('citizen.settings.update-profile'));
    }

    function submitPassword(e) {
        e.preventDefault();
        put(route('citizen.settings.update-password'), {
            onSuccess: () => {
                setData('current_password', '');
                setData('password', '');
                setData('password_confirmation', '');
            }
        });
    }

    return (
        <CitizenLayout activeMenu="pengaturan">
            <div className="px-4 sm:px-6 lg:px-12 pt-6 lg:pt-12 pb-10 lg:pb-16 flex flex-col gap-6">
                <div>
                    <h1 className="text-[#2c2c2c] font-bold text-3xl leading-9">Pengaturan Akun</h1>
                    <p className="text-[#717182] text-base mt-2">
                        Kelola keamanan akun dan preferensi notifikasi Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white rounded-[14px] border border-black/10 shadow-sm p-6">
                        <div className="mb-5">
                            <p className="text-[#2c2c2c] font-semibold text-[36px] md:text-[38px]">Ubah Password</p>
                            <p className="text-[#717182] text-base mt-1">Pastikan password baru Anda kuat dan aman</p>
                        </div>
                        <form onSubmit={submitPassword} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[#2c2c2c] text-sm font-medium">Password Saat Ini</label>
                                <input
                                    type="password"
                                    value={data.current_password}
                                    onChange={e => setData('current_password', e.target.value)}
                                    className="bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-[#2c2c2c] border border-transparent focus:outline-none focus:border-[#3f51b5] focus:bg-white transition"
                                />
                                {errors.current_password && <p className="text-red-500 text-xs">{errors.current_password}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[#2c2c2c] text-sm font-medium">Password Baru</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-[#2c2c2c] border border-transparent focus:outline-none focus:border-[#3f51b5] focus:bg-white transition"
                                />
                                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[#2c2c2c] text-sm font-medium">Konfirmasi Password Baru</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-[#2c2c2c] border border-transparent focus:outline-none focus:border-[#3f51b5] focus:bg-white transition"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full bg-[#3f51b5] hover:bg-[#3447a3] text-white font-medium text-sm h-10 rounded-lg transition disabled:opacity-60"
                            >
                                {processing ? 'Memperbarui...' : 'Perbarui Password'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-[14px] border border-black/10 shadow-sm p-6">
                        <div className="mb-7">
                            <p className="text-[#2c2c2c] font-semibold text-[36px] md:text-[38px]">Preferensi Notifikasi</p>
                            <p className="text-[#717182] text-base mt-1">Pilih bagaimana Anda ingin menerima pembaruan status</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[#2c2c2c] font-medium text-[28px] leading-tight">Notifikasi WhatsApp</p>
                                    <p className="text-[#717182] text-sm mt-1">Kirim pembaruan status ke nomor WhatsApp terdaftar.</p>
                                </div>
                                <button type="button" className="mt-1 relative w-12 h-7 rounded-full bg-[#3f51b5]">
                                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white" />
                                </button>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[#2c2c2c] font-medium text-[28px] leading-tight">Notifikasi Email</p>
                                    <p className="text-[#717182] text-sm mt-1">Terima informasi program bantuan melalui Email.</p>
                                </div>
                                <button type="button" className="mt-1 relative w-12 h-7 rounded-full bg-[#e5e7eb]">
                                    <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={submitProfile} className="mt-8 border-t border-black/10 pt-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Nama Lengkap"
                                    className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-sm text-[#2c2c2c] border border-transparent focus:outline-none focus:border-[#3f51b5] focus:bg-white transition"
                                />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="Email"
                                    className="bg-[#f3f3f5] rounded-lg px-3 py-2 text-sm text-[#2c2c2c] border border-transparent focus:outline-none focus:border-[#3f51b5] focus:bg-white transition"
                                />
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="No. Telepon"
                                    className="md:col-span-2 bg-[#f3f3f5] rounded-lg px-3 py-2 text-sm text-[#2c2c2c] border border-transparent focus:outline-none focus:border-[#3f51b5] focus:bg-white transition"
                                />
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#3f51b5] hover:bg-[#3447a3] text-white font-medium text-sm px-4 h-9 rounded-lg transition disabled:opacity-60"
                                >
                                    Simpan Profil
                                </button>
                                {recentlySuccessful && (
                                    <p className="text-[#007a55] text-sm font-medium">✓ Berhasil disimpan</p>
                                )}
                                {(errors.name || errors.email || errors.phone) && (
                                    <p className="text-red-500 text-xs">Periksa kembali data profil Anda.</p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </CitizenLayout>
    );
}
