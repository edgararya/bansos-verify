import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import CitizenLayout from '@/Components/CitizenLayout';

/* ── Komponen Input ── */
function Field({ label, error, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[#2c2c2c] text-sm font-medium">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}

function TextInput({ type = 'text', ...props }) {
    return (
        <input
            type={type}
            className="bg-[#f3f3f5] rounded-lg px-3 py-2.5 text-sm text-[#2c2c2c] placeholder-[#717182] border border-transparent focus:outline-none focus:border-[#3f51b5] focus:bg-white transition w-full"
            {...props}
        />
    );
}

/* ── Toggle Switch ── */
function Toggle({ checked, onChange, label, desc }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3.5 border-b border-black/[0.06] last:border-0">
            <div>
                <p className="text-[#2c2c2c] text-sm font-medium">{label}</p>
                <p className="text-[#717182] text-xs mt-0.5">{desc}</p>
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200"
                style={{ background: checked ? '#3f51b5' : '#d1d5db' }}
            >
                <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200"
                    style={{ left: checked ? '22px' : '2px' }}
                />
            </button>
        </div>
    );
}

/* ── Card wrapper ── */
function Card({ topColor, children }) {
    return (
        <div
            className="bg-white rounded-[14px] shadow-sm"
            style={{
                border: '0.8px solid rgba(0,0,0,0.1)',
                borderTopWidth: '4px',
                borderTopColor: topColor ?? 'transparent',
            }}
        >
            {children}
        </div>
    );
}

export default function Pengaturan() {
    const { auth, flash } = usePage().props;
    const user = auth?.user ?? {};

    /* state untuk 2 form terpisah */
    const profileForm = useForm({
        name:  user.name  ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
    });

    const pwForm = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    const [notifWa,    setNotifWa]    = useState(true);
    const [notifEmail, setNotifEmail] = useState(false);

    function submitProfile(e) {
        e.preventDefault();
        profileForm.put(route('citizen.settings.update-profile'));
    }

    function submitPassword(e) {
        e.preventDefault();
        pwForm.put(route('citizen.settings.update-password'), {
            onSuccess: () => pwForm.reset(),
        });
    }

    return (
        <CitizenLayout activeMenu="pengaturan">
            <div className="px-4 sm:px-6 lg:px-12 pt-6 lg:pt-12 pb-10 lg:pb-16 flex flex-col gap-8">

                {/* Header */}
                <div>
                    <h1 className="text-[#2c2c2c] font-bold text-3xl leading-9">Pengaturan Akun</h1>
                    <p className="text-[#717182] text-sm mt-1.5">
                        Kelola informasi profil, keamanan akun, dan preferensi notifikasi Anda.
                    </p>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-[10px] px-4 py-3 bg-[rgba(0,122,85,0.08)] border border-[rgba(0,122,85,0.25)]">
                        <p className="text-[#007a55] text-sm font-medium">✓ {flash.success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {/* ── Kartu Kiri: Profil ── */}
                    <Card topColor="#3f51b5">
                        <div className="px-6 pt-5 pb-4 border-b border-black/[0.07]">
                            <p className="text-[#2c2c2c] font-semibold text-base">Informasi Profil</p>
                            <p className="text-[#717182] text-xs mt-0.5">Perbarui nama, email, dan nomor telepon Anda</p>
                        </div>

                        <form onSubmit={submitProfile} className="px-6 py-5 flex flex-col gap-4">
                            {/* Avatar placeholder */}
                            <div className="flex items-center gap-4 pb-2">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg,#3f51b5,#5c6bc0)' }}
                                >
                                    {(user.name ?? 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[#2c2c2c] font-semibold text-sm">{user.name}</p>
                                    <p className="text-[#717182] text-xs">{user.email}</p>
                                    {user.nik && <p className="text-[#717182] text-xs">NIK: {user.nik}</p>}
                                </div>
                            </div>

                            <Field label="Nama Lengkap" error={profileForm.errors.name}>
                                <TextInput
                                    value={profileForm.data.name}
                                    onChange={e => profileForm.setData('name', e.target.value)}
                                    placeholder="Nama lengkap sesuai KTP"
                                />
                            </Field>

                            <Field label="Alamat Email" error={profileForm.errors.email}>
                                <TextInput
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={e => profileForm.setData('email', e.target.value)}
                                    placeholder="contoh@email.com"
                                />
                            </Field>

                            <Field label="Nomor Telepon / WhatsApp" error={profileForm.errors.phone}>
                                <TextInput
                                    type="tel"
                                    value={profileForm.data.phone}
                                    onChange={e => profileForm.setData('phone', e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                />
                            </Field>

                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="bg-[#3f51b5] hover:bg-[#3447a3] text-white font-medium text-sm px-5 h-9 rounded-lg transition disabled:opacity-60"
                                >
                                    {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                {profileForm.recentlySuccessful && (
                                    <p className="text-[#007a55] text-sm">✓ Profil diperbarui</p>
                                )}
                            </div>
                        </form>
                    </Card>

                    {/* ── Kartu Kanan: Password + Notifikasi ── */}
                    <div className="flex flex-col gap-6">

                        {/* Password */}
                        <Card topColor="#e53935">
                            <div className="px-6 pt-5 pb-4 border-b border-black/[0.07]">
                                <p className="text-[#2c2c2c] font-semibold text-base">Keamanan — Ubah Password</p>
                                <p className="text-[#717182] text-xs mt-0.5">Pastikan password baru Anda kuat dan aman</p>
                            </div>

                            <form onSubmit={submitPassword} className="px-6 py-5 flex flex-col gap-4">
                                <Field label="Password Saat Ini" error={pwForm.errors.current_password}>
                                    <TextInput
                                        type="password"
                                        value={pwForm.data.current_password}
                                        onChange={e => pwForm.setData('current_password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </Field>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Password Baru" error={pwForm.errors.password}>
                                        <TextInput
                                            type="password"
                                            value={pwForm.data.password}
                                            onChange={e => pwForm.setData('password', e.target.value)}
                                            placeholder="Min. 8 karakter"
                                        />
                                    </Field>
                                    <Field label="Konfirmasi Password">
                                        <TextInput
                                            type="password"
                                            value={pwForm.data.password_confirmation}
                                            onChange={e => pwForm.setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi password baru"
                                        />
                                    </Field>
                                </div>

                                <div className="flex items-center gap-3 pt-1">
                                    <button
                                        type="submit"
                                        disabled={pwForm.processing}
                                        className="bg-[#e53935] hover:bg-[#c62828] text-white font-medium text-sm px-5 h-9 rounded-lg transition disabled:opacity-60"
                                    >
                                        {pwForm.processing ? 'Memperbarui...' : 'Perbarui Password'}
                                    </button>
                                    {pwForm.recentlySuccessful && (
                                        <p className="text-[#007a55] text-sm">✓ Password diperbarui</p>
                                    )}
                                </div>
                            </form>
                        </Card>

                        {/* Notifikasi */}
                        <Card topColor="#00796b">
                            <div className="px-6 pt-5 pb-4 border-b border-black/[0.07]">
                                <p className="text-[#2c2c2c] font-semibold text-base">Preferensi Notifikasi</p>
                                <p className="text-[#717182] text-xs mt-0.5">Pilih cara Anda menerima pembaruan status bantuan</p>
                            </div>
                            <div className="px-6 py-4">
                                <Toggle
                                    checked={notifWa}
                                    onChange={setNotifWa}
                                    label="Notifikasi WhatsApp"
                                    desc="Kirim pembaruan status ke nomor WhatsApp terdaftar"
                                />
                                <Toggle
                                    checked={notifEmail}
                                    onChange={setNotifEmail}
                                    label="Notifikasi Email"
                                    desc="Terima informasi program bantuan melalui Email"
                                />
                            </div>
                        </Card>

                    </div>
                </div>
            </div>
        </CitizenLayout>
    );
}
