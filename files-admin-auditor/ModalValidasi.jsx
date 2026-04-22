import { useState } from 'react';
import { router } from '@inertiajs/react';

const imgCheck  = "https://www.figma.com/api/mcp/asset/b88281c9-662a-42cc-8dac-3b2fb90023d9";
const imgReject = "https://www.figma.com/api/mcp/asset/a19ac471-df20-47bb-a5d5-e092d2bc87a1";

function getSkorStyle(skor) {
    if (skor >= 70) return { bg: '#d0fae5', border: '#00bc7d', text: '#007a55' };
    if (skor >= 50) return { bg: '#fef3c6', border: '#fe9a00', text: '#bb4d00' };
    return { bg: '#ffe2e2', border: '#fb2c36', text: '#c10007' };
}

export default function ModalValidasi({ applicant, onClose, onSuccess }) {
    const [catatan, setCatatan] = useState('');
    const [loading, setLoading] = useState(false);

    if (!applicant) return null;

    const sc = getSkorStyle(applicant.skor);

    function handleAction(action) {
        setLoading(true);
        router.post(
            route('admin.validate', applicant.id),
            { action, catatan },
            {
                onSuccess: () => {
                    setLoading(false);
                    onSuccess?.();
                    onClose();
                },
                onError: () => setLoading(false),
            }
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-[14px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] border border-black/10 w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="px-6 py-4 rounded-t-[14px] flex items-center justify-between"
                    style={{ borderBottom: '0.8px solid rgba(0,0,0,0.1)' }}
                >
                    <div>
                        <h2 className="text-[#2c2c2c] font-semibold text-lg">Document Approval</h2>
                        <p className="text-[#717182] text-sm mt-0.5">Verifikasi kelayakan penerima bantuan sosial</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#717182] hover:text-[#2c2c2c] transition"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                    <div className="flex items-start gap-4">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base shrink-0"
                            style={{ background: sc.bg, border: `4px solid ${sc.border}`, color: sc.text }}
                        >
                            {applicant.skor}%
                        </div>
                        <div className="flex-1">
                            <p className="text-[#2c2c2c] font-semibold text-lg">{applicant.nama}</p>
                            <p className="text-[#717182] text-sm">NIK: {applicant.nik}</p>
                            <p className="text-[#717182] text-sm">{applicant.pekerjaan} · {applicant.penghasilan}</p>
                        </div>
                    </div>

                    <div
                        className="rounded-lg p-4 flex flex-col gap-3"
                        style={{ background: 'rgba(245,247,250,0.5)', border: '0.8px solid rgba(0,0,0,0.08)' }}
                    >
                        <p className="text-[#2c2c2c] text-sm font-medium">Detail Skor Kelayakan</p>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                            {[
                                { label: 'Pekerjaan', val: applicant.pekerjaan, pct: '30%' },
                                { label: 'Penghasilan', val: applicant.penghasilan, pct: '40%' },
                                { label: 'Tanggungan', val: applicant.tanggungan ?? '-', pct: '30%' },
                            ].map(item => (
                                <div key={item.label} className="bg-white rounded-lg p-3 border border-black/5">
                                    <p className="text-[#717182] text-xs uppercase tracking-wider">{item.label}</p>
                                    <p className="text-[#2c2c2c] font-medium mt-0.5 truncate">{item.val}</p>
                                    <p className="text-[#717182] text-xs">Bobot {item.pct}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {applicant.ktp_photo && (
                        <div>
                            <p className="text-[#2c2c2c] text-sm font-medium mb-2">Foto KTP yang Diunggah</p>
                            <img
                                src={`/storage/${applicant.ktp_photo}`}
                                alt="KTP"
                                className="w-full max-h-40 object-contain rounded-lg border border-black/10 bg-[#f5f7fa]"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-[#2c2c2c] text-sm font-medium">
                            Catatan Validasi <span className="text-[#717182] font-normal">(opsional)</span>
                        </label>
                        <textarea
                            value={catatan}
                            onChange={e => setCatatan(e.target.value)}
                            rows={3}
                            placeholder="Tambahkan catatan untuk keputusan ini..."
                            className="w-full bg-[#f3f3f5] rounded-lg px-3 py-2 text-sm text-[#2c2c2c] placeholder-[#717182] border border-transparent focus:outline-none focus:border-[#00796b] focus:bg-white transition resize-none"
                        />
                    </div>
                </div>

                <div
                    className="px-6 py-4 flex items-center justify-between rounded-b-[14px]"
                    style={{ background: 'rgba(245,247,250,0.4)', borderTop: '0.8px solid rgba(0,0,0,0.08)' }}
                >
                    <button
                        onClick={onClose}
                        className="px-4 h-9 rounded-lg text-sm font-medium text-[#717182] hover:bg-black/5 transition"
                    >
                        Batal
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleAction('tolak')}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium text-[#d32f2f] border transition hover:bg-red-50 disabled:opacity-60"
                            style={{ border: '0.8px solid #d32f2f' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            Tolak
                        </button>
                        <button
                            onClick={() => handleAction('setujui')}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 h-9 rounded-lg text-sm font-medium text-white transition disabled:opacity-60"
                            style={{ background: '#00796b' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            {loading ? 'Menyimpan...' : 'Setujui & Verifikasi'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
