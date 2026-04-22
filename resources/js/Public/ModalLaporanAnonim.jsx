import { useState } from 'react';
import { useForm } from '@inertiajs/react';

const imgAlert = "https://www.figma.com/api/mcp/asset/7579b01c-d20d-444d-98e0-ce76501ff5ec";

export default function ModalLaporanAnonim({ isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        deskripsi: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('public.laporan-anonim'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    }

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-[10px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] border border-black/10 w-full max-w-[510px] p-6"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition"
                    aria-label="Tutup"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2c2c2c" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>

                <div className="flex flex-col gap-5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <img src={imgAlert} alt="" className="w-5 h-5 shrink-0" />
                            <h2 className="text-[#e7000b] font-semibold text-[18px] leading-[18px]">Laporan Anonim</h2>
                        </div>
                        <p className="text-[#717182] text-sm leading-5">
                            Identitas Anda sebagai pelapor disamarkan sepenuhnya. Mohon berikan informasi selengkap mungkin agar tim dapat segera melakukan tindak lanjut.
                        </p>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <textarea
                            value={data.deskripsi}
                            onChange={e => setData('deskripsi', e.target.value)}
                            rows={6}
                            placeholder="Contoh: Terjadi pemotongan dana bansos di Desa X oleh oknum Y pada tanggal..."
                            className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2 text-sm text-[#2c2c2c] placeholder-[#717182] border border-transparent focus:outline-none focus:border-[#e7000b] focus:bg-white transition resize-none"
                        />
                        {errors.deskripsi && <p className="text-red-500 text-xs">{errors.deskripsi}</p>}

                        <div className="flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 h-9 rounded-lg text-sm font-medium text-[#2c2c2c] hover:bg-gray-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !data.deskripsi.trim()}
                                className="bg-[#e7000b] hover:bg-[#c40009] text-white font-medium text-sm px-5 h-9 rounded-lg transition disabled:opacity-60"
                            >
                                {processing ? 'Mengirim...' : 'Kirim Laporan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
