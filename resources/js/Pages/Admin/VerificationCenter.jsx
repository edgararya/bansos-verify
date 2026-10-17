import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function VerificationCenter({ applications, summary, filters, flash }) {
    const [showRejectModal, setShowRejectModal] = useState(null);
    const { data: rejectData, setData: setRejectData, patch, processing, reset } = useForm({ rejection_reason: '', notes: '' });

    const getPriorityStyle = (score, status) => {
        if (status !== 'pending' && status !== 'under_review') return '';
        if (score >= 70) return 'border-l-4 border-l-emerald-500 bg-emerald-500/5';
        if (score >= 40) return 'border-l-4 border-l-amber-500 bg-amber-500/5';
        return 'border-l-4 border-l-slate-600';
    };

    const getScoreBadge = (score) => {
        if (score >= 70) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        if (score >= 40) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
        return 'bg-slate-700 text-slate-400';
    };

    const getStatusBadge = (status) => {
        const map = {
            pending:      'bg-slate-700 text-slate-300',
            under_review: 'bg-amber-500/20 text-amber-400',
            approved:     'bg-emerald-500/20 text-emerald-400',
            rejected:     'bg-rose-500/20 text-rose-400',
        };
        const labels = { pending: 'Menunggu', under_review: 'Ditinjau', approved: 'Disetujui', rejected: 'Ditolak' };
        return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || map.pending}`}>{labels[status] || status}</span>;
    };

    const handleSearch = (e) => {
        router.get(route('admin.verification'), { ...filters, search: e.target.value }, { preserveState: true, replace: true });
    };

    const handleFilterStatus = (status) => {
        router.get(route('admin.verification'), { ...filters, status }, { preserveState: true, replace: true });
    };

    const handleApprove = (id) => {
        router.patch(route('admin.verification.approve', id), {}, { preserveScroll: true });
    };

    const handleReject = (applicationId) => {
        patch(route('admin.verification.reject', applicationId), {
            onSuccess: () => { setShowRejectModal(null); reset(); },
        });
    };

    return (
        <>
            <Head title="Verification Center — Admin BansosVerify" />
            <div className="min-h-screen bg-slate-950 text-white font-sans">

                {/* Sidebar + Layout */}
                <div className="flex">
                    {/* Sidebar */}
                    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0 hidden lg:flex flex-col">
                        <div className="p-6 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-900 font-black text-sm">B</div>
                                <span className="font-bold">Bansos<span className="text-emerald-400">Verify</span></span>
                            </div>
                            <div className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400 inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Panel Admin
                            </div>
                        </div>
                        <nav className="flex-1 p-4 space-y-1">
                            <SidebarLink href={route('admin.verification')} icon="✅" label="Verification Center" active />
                            <SidebarLink href={route('home')} icon="🌐" label="Lihat Landing Page" />
                            <SidebarLink href={route('profile.edit')} icon="👤" label="Profil" />
                        </nav>
                        <div className="p-4 border-t border-slate-800">
                            <Link href={route('logout')} method="post" as="button" className="w-full text-left text-sm text-slate-500 hover:text-rose-400 transition-colors px-3 py-2">
                                🚪 Keluar
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 lg:ml-64 p-6 lg:p-10">

                        {/* Flash */}
                        {flash?.success && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
                                <span>✅</span>
                                <p className="text-emerald-300 text-sm">{flash.success}</p>
                            </div>
                        )}

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <SummaryCard label="Menunggu" count={summary.pending} color="slate" onClick={() => handleFilterStatus('pending')} />
                            <SummaryCard label="Ditinjau" count={summary.under_review} color="amber" onClick={() => handleFilterStatus('under_review')} />
                            <SummaryCard label="Disetujui" count={summary.approved} color="emerald" onClick={() => handleFilterStatus('approved')} />
                            <SummaryCard label="Ditolak" count={summary.rejected} color="rose" onClick={() => handleFilterStatus('rejected')} />
                        </div>

                        {/* Header + Filters */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-black">Verification Center</h1>
                                <p className="text-slate-400 text-sm mt-1">Baris hijau = skor ≥70 (direkomendasikan). Urutan: prioritas tertinggi di atas.</p>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Cari nama / NIK..."
                                    defaultValue={filters?.search}
                                    onChange={handleSearch}
                                    className="flex-1 md:w-56 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                                <button onClick={() => handleFilterStatus('')} className="text-sm px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:border-slate-500 text-slate-400">
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-700/50">
                                            <th className="text-left text-xs font-semibold text-slate-400 uppercase px-6 py-4">Pemohon</th>
                                            <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-4">Skor</th>
                                            <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-4 hidden md:table-cell">Penghasilan</th>
                                            <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-4 hidden lg:table-cell">Pekerjaan</th>
                                            <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-4">Status</th>
                                            <th className="text-right text-xs font-semibold text-slate-400 uppercase px-6 py-4">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/30">
                                        {applications.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-16 text-slate-500">
                                                    Tidak ada pengajuan ditemukan.
                                                </td>
                                            </tr>
                                        ) : applications.data.map((app) => (
                                            <tr key={app.id} className={`${getPriorityStyle(app.score, app.status)} transition-colors hover:bg-slate-800/30`}>
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-sm text-white">{app.user?.name}</p>
                                                    <p className="text-slate-500 text-xs">{app.user?.nik || 'NIK belum terisi'}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex items-center font-black text-sm px-3 py-1.5 rounded-lg ${getScoreBadge(app.score)}`}>
                                                        {app.score}
                                                        {app.score >= 70 && <span className="ml-1 text-xs">★</span>}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 hidden md:table-cell text-slate-300 text-sm">
                                                    Rp {(app.monthly_income || 0).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-4 py-4 hidden lg:table-cell text-slate-300 text-sm">
                                                    {{ unemployed: 'Tidak Bekerja', informal: 'Informal', formal: 'Formal' }[app.employment_status] || app.employment_status}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {getStatusBadge(app.status)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {(app.status === 'pending' || app.status === 'under_review') ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleApprove(app.id)}
                                                                className="text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors">
                                                                ✓ Setujui
                                                            </button>
                                                            <button onClick={() => setShowRejectModal(app.id)}
                                                                className="text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg hover:bg-rose-500/20 transition-colors">
                                                                ✗ Tolak
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-600 text-xs">Sudah diproses</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {applications.links && (
                                <div className="border-t border-slate-700/50 px-6 py-4 flex items-center justify-between">
                                    <p className="text-slate-500 text-sm">
                                        Menampilkan {applications.from}–{applications.to} dari {applications.total} pengajuan
                                    </p>
                                    <div className="flex gap-2">
                                        {applications.links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                preserveScroll
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                                    link.active
                                                        ? 'bg-emerald-500 text-slate-950 font-bold'
                                                        : link.url
                                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                            : 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
                            <h3 className="font-bold text-lg mb-1 text-rose-400">Tolak Pengajuan</h3>
                            <p className="text-slate-400 text-sm mb-6">Berikan alasan penolakan yang akan ditampilkan ke pemohon.</p>
                            <textarea
                                rows={4}
                                value={rejectData.rejection_reason}
                                onChange={e => setRejectData('rejection_reason', e.target.value)}
                                placeholder="Alasan penolakan (minimal 10 karakter)..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none mb-4"
                            />
                            <div className="flex gap-3">
                                <button onClick={() => { setShowRejectModal(null); reset(); }} className="flex-1 bg-slate-800 border border-slate-700 font-bold py-3 rounded-xl hover:bg-slate-700">
                                    Batal
                                </button>
                                <button onClick={() => handleReject(showRejectModal)} disabled={processing || rejectData.rejection_reason.length < 10}
                                    className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-400 disabled:opacity-40">
                                    {processing ? 'Memproses...' : 'Tolak Pengajuan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function SidebarLink({ href, icon, label, active }) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <span>{icon}</span>
            <span>{label}</span>
        </Link>
    );
}

function SummaryCard({ label, count, color, onClick }) {
    const colours = {
        slate:   'border-slate-700/50 text-slate-300',
        amber:   'border-amber-500/20 text-amber-400',
        emerald: 'border-emerald-500/20 text-emerald-400',
        rose:    'border-rose-500/20 text-rose-400',
    };
    return (
        <button onClick={onClick} className={`bg-slate-900/50 border ${colours[color]} rounded-2xl p-5 text-left hover:scale-[1.02] transition-transform`}>
            <p className="text-2xl font-black">{count}</p>
            <p className="text-slate-400 text-sm mt-1">{label}</p>
        </button>
    );
}
