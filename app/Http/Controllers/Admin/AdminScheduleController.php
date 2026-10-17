<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Disbursement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminScheduleController extends Controller
{
    public function index(): Response
    {
        $checklist = Disbursement::where('schedule_date', today())
            ->with('user')
            ->get()
            ->map(fn($d) => [
                'id'     => $d->id,
                'nama'   => $d->user->name,
                'nik'    => $d->user->nik,
                'jenis'  => $d->program,
                'status' => $d->status,
            ]);

        return Inertia::render('Admin/AdminSchedule', [
            'checklist' => $checklist,
        ]);
    }

    public function broadcast(Request $request): RedirectResponse
    {
        $request->validate([
            'tanggal' => ['required', 'date'],
            'lokasi'  => ['required', 'string'],
            'pesan'   => ['nullable', 'string'],
        ]);

        Schedule::create([
            'date'     => $request->tanggal,
            'location' => $request->lokasi,
            'message'  => $request->pesan,
            'admin_id' => auth('admin')->id(),
        ]);

        return back()->with('success', 'Jadwal berhasil disiarkan ke warga.');
    }

    public function markDone(Request $request): \Illuminate\Http\JsonResponse
    {
        $disbursement = Disbursement::findOrFail($request->id);
        $disbursement->status = 'Telah Disalurkan';
        $disbursement->disbursed_at = now();
        $disbursement->save();

        return response()->json(['ok' => true]);
    }
}
