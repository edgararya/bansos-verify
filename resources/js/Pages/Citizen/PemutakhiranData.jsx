import { useRef, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import CitizenLayout from '@/Components/CitizenLayout';
import { Camera, Upload } from 'lucide-react';

export default function PemutakhiranData() {
    const { auth } = usePage().props;
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        pekerjaan:       auth?.user?.occupation ?? '',
        penghasilan:     auth?.user?.monthly_income ?? '',
        tanggungan:      '',
        status_rumah:    'own',
        penyakit_kronis: false,
        disabilitas:     false,
        ktp_photo:       null,
    });

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setData('ktp_photo', file);
        setPreview(URL.createObjectURL(file));
    }

    function submit(e) {
        e.preventDefault();
        post(route('citizen.update.store'), { forceFormData: true });
    }

    const inputClass = "w-full bg-[#f3f3f5] rounded-lg px-3 py-2 text-sm text-[#2c2c2c] placeholder-[#717182] border border-transparent focus:outline-none focus:border-[#3f51b5] focus:bg-white transition";
    const labelClass = "text-[#2c2c2c] text-sm font-medium";
    const errorClass = "text-red-500 text-xs mt-1";

    return (
        <CitizenLayout activeMenu="pemutakhiran">
            <div className="px-4 sm:px-6 lg:px-12 pt-6 lg:pt-12 pb-10 lg:pb-16 flex flex-col gap-6">
                <div>
                    <h1 className="text-[#2c2c2c] font-bold text-3xl leading-9">Pemutakhiran Data</h1>
                    <p className="text-[#717182] text-base mt-2">
                        Perbarui informasi Anda agar proses verifikasi lebih akurat. Data ini digunakan untuk menghitung skor kelayakan.
                    </p>
                </div>

                {recentlySuccessful && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                        ✓ Data berhasil disimpan! Permohonan Anda kini masuk dalam antrian verifikasi operator.
                    </div>
                )}

                <div
                    className="bg-white rounded-[14px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)]"
                    style={{ border: '0.8px solid rgba(0,0,0,0.1)', borderTopWidth: '4px', borderTopColor: '#3f51b5' }}
                >
                    <div className="px-6 pt-5 pb-4 border-b border-black/10">
                        <p className="text-[#2c2c2c] font-medium text-base">Formulir Data Ekonomi & Kondisi</p>
                        <p className="text-[#717182] text-sm mt-1">
                            Isi sesuai dengan kondisi riil saat ini. Pemalsuan data dapat mengakibatkan pembatalan bantuan.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <div className="px-6 py-6 flex flex-col gap-5">

                            {/* Pekerjaan */}
                            <div className="flex flex-col gap-2">
                                <label className={labelClass}>Pekerjaan Utama <span className="text-red-500">*</span></label>
                                <select
                                    value={data.pekerjaan}
                                    onChange={e => setData('pekerjaan', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="">-- Pilih Status Pekerjaan --</option>
                                    <option value="unemployed">Tidak Bekerja / Pengangguran</option>
                                    <option value="informal">Informal (Buruh, Petani, Pedagang Kecil, dll)</option>
                                    <option value="formal">Formal (Karyawan Swasta / PNS)</option>
                                    <option value="ibu rumah tangga">Ibu Rumah Tangga</option>
                                </select>
                                {errors.pekerjaan && <p className={errorClass}>{errors.pekerjaan}</p>}
                            </div>

                            {/* Penghasilan & Tanggungan berdampingan */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className={labelClass}>Estimasi Penghasilan/Bulan <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#717182] text-sm font-medium">Rp</span>
                                        <input
                                            type="number"
                                            value={data.penghasilan}
                                            onChange={e => setData('penghasilan', e.target.value)}
                                            placeholder="0"
                                            min="0"
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                    {errors.penghasilan && <p className={errorClass}>{errors.penghasilan}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className={labelClass}>Jumlah Tanggungan (jiwa) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={data.tanggungan}
                                        onChange={e => setData('tanggungan', e.target.value)}
                                        placeholder="Contoh: 3"
                                        min="0"
                                        max="20"
                                        className={inputClass}
                                    />
                                    {errors.tanggungan && <p className={errorClass}>{errors.tanggungan}</p>}
                                </div>
                            </div>

                            {/* Status Rumah */}
                            <div className="flex flex-col gap-2">
                                <label className={labelClass}>Status Kepemilikan Rumah <span className="text-red-500">*</span></label>
                                <select
                                    value={data.status_rumah}
                                    onChange={e => setData('status_rumah', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="poor_condition">Kondisi Buruk / Tidak Layak Huni</option>
                                    <option value="free">Numpang / Tidak Bayar</option>
                                    <option value="rent">Sewa / Kontrak</option>
                                    <option value="own">Milik Sendiri</option>
                                </select>
                                {errors.status_rumah && <p className={errorClass}>{errors.status_rumah}</p>}
                            </div>

                            {/* Kondisi Kesehatan */}
                            <div className="flex flex-col gap-3">
                                <label className={labelClass}>Kondisi Kesehatan</label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.penyakit_kronis}
                                            onChange={e => setData('penyakit_kronis', e.target.checked)}
                                            className="w-4 h-4 accent-[#3f51b5]"
                                        />
                                        <span className="text-[#2c2c2c] text-sm">Memiliki penyakit kronis (diabetes, jantung, kanker, dll)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.disabilitas}
                                            onChange={e => setData('disabilitas', e.target.checked)}
                                            className="w-4 h-4 accent-[#3f51b5]"
                                        />
                                        <span className="text-[#2c2c2c] text-sm">Memiliki disabilitas fisik atau mental</span>
                                    </label>
                                </div>
                            </div>

                            {/* Upload KTP */}
                            <div className="flex flex-col gap-3">
                                <label className={labelClass}>Upload Foto KTP</label>
                                <div
                                    className="rounded-[10px] border-[1.6px] border-dashed border-black/10 bg-[rgba(245,247,250,0.2)] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[rgba(63,81,181,0.03)] transition"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview KTP"
                                            className="max-h-40 rounded-lg object-contain border border-black/10"
                                        />
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-[rgba(63,81,181,0.1)] rounded-full flex items-center justify-center">
                                                <Camera size={24} color="#3f51b5" />
                                            </div>
                                            <p className="text-[#2c2c2c] font-medium text-sm">Upload KTP Anda</p>
                                            <p className="text-[#717182] text-xs text-center max-w-xs">
                                                Pastikan foto jelas, tidak terpotong, dan tulisan dapat terbaca (Max 2MB, JPG/PNG)
                                            </p>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                                        className="flex items-center gap-2 border border-black/10 bg-white rounded-lg px-4 h-9 text-sm font-medium text-[#2c2c2c] hover:bg-gray-50 transition mt-1"
                                    >
                                        <Upload size={16} />
                                        {preview ? 'Ganti File' : 'Pilih File'}
                                    </button>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/jpeg,image/png"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                {errors.ktp_photo && <p className={errorClass}>{errors.ktp_photo}</p>}
                            </div>
                        </div>

                        <div className="px-6 py-5 bg-[rgba(245,247,250,0.3)] border-t border-black/5 rounded-b-[14px] flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#3f51b5] hover:bg-[#3447a3] text-white font-medium text-sm px-6 h-9 rounded-lg transition disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : 'Kirim Permohonan'}
                            </button>
                            <p className="text-[#717182] text-xs">Data Anda akan diverifikasi oleh operator kelurahan.</p>
                        </div>
                    </form>
                </div>
            </div>
        </CitizenLayout>
    );
}
