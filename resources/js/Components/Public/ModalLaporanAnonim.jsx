import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function ModalLaporanAnonim({ isOpen, onClose }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        reporter_name: 'Anonim',
        category: 'Laporan Anonim',
        location: 'Tidak disebutkan',
        description: '',
        is_anonymous: true,
    });

    // Handle ESC key to close
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    // Lock scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    function submit(e) {
        e.preventDefault();
        post(route('public.laporan-anonim'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="relative bg-white w-full rounded-2xl overflow-hidden"
                style={{
                    maxWidth: '520px',
                    boxShadow: '0px 20px 60px rgba(0,0,0,0.25)',
                    animation: 'modalIn 0.2s ease-out',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="font-semibold text-[#e7000b] flex items-center gap-2" style={{ fontSize: '34px' }}>
                                <span>⚠</span>
                                Laporan Anonim
                            </h2>
                            <p className="text-[#717182] mt-2 leading-relaxed">
                                Identitas Anda sebagai pelapor disamarkan sepenuhnya. Mohon berikan informasi selengkap mungkin agar tim dapat segera melakukan tindak lanjut.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-gray-100"
                            aria-label="Tutup"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717182" strokeWidth={2} strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={submit} className="px-6 pb-5 space-y-4">
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={6}
                        placeholder="Contoh: Terjadi pemotongan dana bansos di Desa X oleh oknum Y pada tanggal..."
                        className="w-full px-4 py-3 rounded-xl text-sm bg-[#f3f3f5] border border-transparent focus:outline-none focus:border-[#3f51b5] focus:bg-white transition placeholder-[#aaa] resize-none"
                        required
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}

                    <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 px-5 rounded-xl text-[#2c2c2c] text-sm font-medium"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.description.trim()}
                            className="h-10 px-6 rounded-xl text-sm font-semibold text-white transition disabled:opacity-60"
                            style={{ background: '#e7000b' }}
                        >
                            {processing ? 'Mengirim...' : 'Kirim Laporan'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.96) translateY(8px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
