<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuditorLoginController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/LoginAuditor');
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::guard('auditor')->attempt($credentials, $request->boolean('remember'))) {
            if (Auth::guard('auditor')->user()->role !== 'auditor') {
                Auth::guard('auditor')->logout();
                return back()->withErrors(['email' => 'Akses ditolak. Anda bukan Auditor Pusat.']);
            }
            $request->session()->regenerate();
            return redirect()->intended(route('auditor.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ]);
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('auditor')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
