import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function TicketInspector({ tickets, summary, filters, flash }) {
    const [expandedTicket, setExpandedTicket] = useState(null);
    const { data, setData, patch, processing, reset } = useForm({ status: '', investigator_note: '' });

    const getStatusConfig = (status) => ({
        open:          { label: 'Dibuka',          badge: 'bg-sky-500/20 text-sky-400 border-sky-500/30', dot: 'bg-sky-400' },
        investigating: { label: 'Diselidiki',      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
        resolved:      { label: 'Selesai',         badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
        dismissed:     { label: 'Ditutup',         badge: 'bg-slate-700 text-slate-400', dot: 'bg-slate-500' },
    }[status] || { label: status, badge: 'bg-slate-700 text-slate-400', dot: 'bg-slate-500' });

    const getTypelabel = (type) => ({
        fraud:             '💰 Kecurangan',
        data_manipulation: '📝 Manipulasi Data',
        nepotism:          '🤝 Nepotisme',
        other:             '📌 Lainnya',
    }[type] || type);

    const handleFilterStatus = (status) => {
        router.get(route('auditor.tickets'), { status }, { preserveState: true, replace: true });
    };

    const handleUpdateTicket = (ticketId) => {
        patch(route('auditor.tickets.update', ticketId), {
            onSuccess: () => { setExpandedTicket(null); reset(); },
        });
    };

    const openUpdatePanel = (ticket) => {
        setExpandedTicket(ticket.id);
        setData({ status: ticket.status, investigator_note: ticket.investigator_note || '' });
    };

    return (
        <>
            <Head title="Ticket Inspector — Auditor BansosVerify" />
            <div className="min-h-screen bg-slate-950 text-white font-sans">
                <div className="flex">
                    {/* Sidebar */}
                    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0 hidden lg:flex flex-col">
                        <div className="p-6 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-900 font-black text-sm">B</div>
                                <span className="font-bold">Bansos<span className="text-emerald-400">Verify</span></span>
                            </div>
                            <div className="mt-3 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-400 inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                                Panel Auditor
                            </div>
                        </div>
                        <nav className="flex-1 p-4 space-y-1">
                            <Link href={route('auditor.tickets')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm bg-sky-500/10 text-sky-400 font-semibold">
                                <span>🎫</span><span>Ticket Inspector</span>
                            </Link>
                            <Link href={route('home')} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                <span>🌐</span><span>Landing Page</span>
                            </Link>
                        </nav>
                        <div className="p-4 border-t border-slate-800">
                            <Link href={route('logout')} method="post" as="button" className="w-full text-left text-sm text-slate-500 hover:text-rose-400 px-3 py-2">
                                🚪 Keluar
                            </Link>
                        </div>
                    </aside>

                    <main className="flex-1 lg:ml-64 p-6 lg:p-10">
                        {/* Flash */}
                        {flash?.success && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
                                <span>✅</span><p className="text-emerald-300 text-sm">{flash.success}</p>
                            </div>
                        )}

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-black">Ticket Inspector</h1>
                            <p className="text-slate-400 text-sm mt-1">Investigasi laporan anonim whistleblower. Identitas pelapor tidak tersimpan di sistem.</p>
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <button onClick={() => handleFilterStatus('open')} className="bg-slate-900/50 border border-sky-500/20 rounded-2xl p-5 text-left hover:scale-[1.02] transition-transform">
                                <p className="text-2xl font-black text-sky-400">{summary.open}</p>
                                <p className="text-slate-400 text-sm mt-1">Dibuka</p>
                            </button>
                            <button onClick={() => handleFilterStatus('investigating')} className="bg-slate-900/50 border border-amber-500/20 rounded-2xl p-5 text-left hover:scale-[1.02] transition-transform">
                                <p className="text-2xl font-black text-amber-400">{summary.investigating}</p>
                                <p className="text-slate-400 text-sm mt-1">Diselidiki</p>
                            </button>
                            <button onClick={() => handleFilterStatus('resolved')} className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-5 text-left hover:scale-[1.02] transition-transform">
                                <p className="text-2xl font-black text-emerald-400">{summary.resolved}</p>
                                <p className="text-slate-400 text-sm mt-1">Selesai</p>
                            </button>
                        </div>

                        {/* Filter tabs */}
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {['', 'open', 'investigating', 'resolved', 'dismissed'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleFilterStatus(s)}
                                    className={`text-sm px-4 py-2 rounded-xl font-semibold transition-colors ${
                                        filters?.status === s || (!filters?.status && s === '')
                                            ? 'bg-sky-500 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {{ '': 'Semua', open: 'Dibuka', investigating: 'Diselidiki', resolved: 'Selesai', dismissed: 'Ditutup' }[s]}
                                </button>
                            ))}
                        </div>

                        {/* Ticket List */}
                        <div className="space-y-4">
                            {tickets.data.length === 0 ? (
                                <div className="border border-dashed border-slate-700 rounded-2xl p-12 text-center">
                                    <p className="text-slate-500">Tidak ada laporan ditemukan.</p>
                                </div>
                            ) : tickets.data.map(ticket => {
                                const statusCfg = getStatusConfig(ticket.status);
                                const isExpanded = expandedTicket === ticket.id;

                                return (
                                    <div key={ticket.id} className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                                        {/* Ticket header */}
                                        <div className="p-5 flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`${statusCfg.badge} border text-xs font-semibold px-2.5 py-1 rounded-full`}>
                                                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusCfg.dot} mr-1.5`}></span>
                                                        {statusCfg.label}
                                                    </span>
                                                    <span className="text-slate-500 text-xs">{getTypelabel(ticket.report_type)}</span>
                                                    <span className="text-slate-600 text-xs">#{ticket.id}</span>
                                                </div>
                                                <h3 className="font-bold text-white">{ticket.reported_subject}</h3>
                                                {ticket.location && <p className="text-slate-400 text-sm mt-0.5">📍 {ticket.location}</p>}
                                                <p className="text-slate-400 text-sm mt-2 line-clamp-2">{ticket.description}</p>
                                                <p className="text-slate-600 text-xs mt-2">
                                                    Dilaporkan: {new Date(ticket.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => isExpanded ? setExpandedTicket(null) : openUpdatePanel(ticket)}
                                                className="flex-shrink-0 text-sm font-semibold text-sky-400 border border-sky-500/30 bg-sky-500/10 px-4 py-2 rounded-xl hover:bg-sky-500/20 transition-colors"
                                            >
                                                {isExpanded ? 'Tutup' : 'Tindak Lanjut'}
                                            </button>
                                        </div>

                                        {/* Expanded Panel */}
                                        {isExpanded && (
                                            <div className="border-t border-slate-700/50 p-5 bg-slate-800/30">
                                                <h4 className="font-semibold text-sm text-slate-300 mb-4">Update Status Investigasi</h4>

                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    {['open', 'investigating', 'resolved', 'dismissed'].map(s => {
                                                        const cfg = getStatusConfig(s);
                                                        return (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => setData('status', s)}
                                                                className={`p-3 rounded-xl border text-left text-sm transition-all ${
                                                                    data.status === s
                                                                        ? `${cfg.badge} border`
                                                                        : 'border-slate-700 text-slate-400 hover:border-slate-500'
                                                                }`}
                                                            >
                                                                <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot} mr-2`}></span>
                                                                {cfg.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <textarea
                                                    rows={3}
                                                    value={data.investigator_note}
                                                    onChange={e => setData('investigator_note', e.target.value)}
                                                    placeholder="Catatan investigasi (opsional)..."
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none mb-4"
                                                />

                                                <div className="flex gap-3">
                                                    <button onClick={() => { setExpandedTicket(null); reset(); }} className="flex-1 bg-slate-700 font-bold py-3 rounded-xl hover:bg-slate-600">
                                                        Batal
                                                    </button>
                                                    <button onClick={() => handleUpdateTicket(ticket.id)} disabled={processing}
                                                        className="flex-1 bg-sky-500 text-white font-bold py-3 rounded-xl hover:bg-sky-400 disabled:opacity-50">
                                                        {processing ? 'Menyimpan...' : 'Simpan Update'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {tickets.links && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                {tickets.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                            link.active ? 'bg-sky-500 text-white font-bold' :
                                            link.url ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' :
                                            'text-slate-600 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}
