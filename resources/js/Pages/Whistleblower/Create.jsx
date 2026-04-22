import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ flash }) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        reported_subject: '',
        report_type: '',
        location: '',
        description: '',
        evidence: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('whistleblower.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Laporan Anonim — BansosVerify" />
            <div className="min-h-screen bg-slate-950 text-white font-sans">

                {/* Navbar minimal */}
                <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
                    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                        <Link href={route('home')} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-900 font-black">B</div>
                            <span className="font-bold">Bansos<span className="text-emerald-400">Verify</span></span>
                        </Link>
                        <Link href={route('home')} className="text-sm text-slate-400 hover:text-white transition-colors">
                            ← Kembali
                        </Link>
                    </div>
                </nav>

                <div className="max-w-2xl mx-auto px-6 py-16">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-3xl mx-auto mb-6">🔒</div>
                        <h1 className="text-3xl font-black mb-3">Portal Pelaporan Anonim</h1>
                        <p className="text-slate-400 leading-relaxed">
                            Identitas Anda <strong className="text-sky-400">tidak disimpan</strong> dalam sistem. Laporkan dugaan kecurangan distribusi bansos dengan aman.
                        </p>
                    </div>

                    {/* Anonymity Notice */}
                    <div className="bg-sky-500/5 border border-sky-500/20 rounded-2xl p-5 mb-8 flex gap-4">
                        <span className="text-sky-400 text-xl flex-shrink-0">🛡️</span>
                        <div>
                            <p className="text-sky-300 font-semibold text-sm mb-1">Jaminan Anonimitas</p>
                            <p className="text-slate-400 text-sm">Formulir ini tidak mencatat alamat IP, sesi login, atau informasi apapun yang dapat mengidentifikasi Anda sebagai pelapor.</p>
                        </div>
                    </div>

                    {/* Success State */}
                    {flash?.success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-8 text-center">
                            <span className="text-4xl block mb-3">✅</span>
                            <p className="text-emerald-400 font-semibold">{flash.success}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Pihak Yang Dilaporkan <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.reported_subject}
                                onChange={e => setData('reported_subject', e.target.value)}
                                placeholder="Nama oknum / instansi yang dicurigai"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                            {errors.reported_subject && <p className="text-rose-400 text-sm mt-1">{errors.reported_subject}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Jenis Kecurangan <span className="text-rose-400">*</span>
                            </label>
                            <select
                                value={data.report_type}
                                onChange={e => setData('report_type', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                            >
                                <option value="">-- Pilih Jenis --</option>
                                <option value="fraud">Kecurangan Penyaluran</option>
                                <option value="data_manipulation">Manipulasi Data</option>
                                <option value="nepotism">Nepotisme / Kolusi</option>
                                <option value="other">Lainnya</option>
                            </select>
                            {errors.report_type && <p className="text-rose-400 text-sm mt-1">{errors.report_type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Lokasi Kejadian
                            </label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={e => setData('location', e.target.value)}
                                placeholder="Nama kelurahan / desa / kecamatan"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Deskripsi Lengkap <span className="text-rose-400">*</span>
                            </label>
                            <textarea
                                rows={6}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Jelaskan kejadian secara detail (minimal 50 karakter). Sertakan waktu, siapa yang terlibat, dan apa yang terjadi."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                            />
                            <p className="text-slate-500 text-sm mt-1">{data.description.length} / minimal 50 karakter</p>
                            {errors.description && <p className="text-rose-400 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Bukti Pendukung <span className="text-slate-500">(opsional)</span>
                            </label>
                            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-slate-500 transition-colors cursor-pointer"
                                onClick={() => document.getElementById('evidence-upload').click()}>
                                <p className="text-slate-400 text-sm">📎 Upload foto atau PDF (maks. 5MB)</p>
                                {data.evidence && <p className="text-emerald-400 text-sm mt-2">✓ {data.evidence.name}</p>}
                            </div>
                            <input
                                id="evidence-upload"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                                onChange={e => setData('evidence', e.target.files[0])}
                            />
                            {errors.evidence && <p className="text-rose-400 text-sm mt-1">{errors.evidence}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold py-4 rounded-2xl text-lg hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50 disabled:scale-100"
                        >
                            {processing ? 'Mengirim...' : '🔒 Kirim Laporan Anonim'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
