<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminLoginController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/LoginAdmin');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nik'      => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $identifier = trim($validated['nik']);
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL) !== false;

        if (!$isEmail && !(ctype_digit($identifier) && strlen($identifier) === 16)) {
            return back()->withErrors([
                'nik' => 'Masukkan email admin atau NIK 16 digit.',
            ]);
        }

        $credentials = [
            $isEmail ? 'email' : 'nik' => $identifier,
            'password' => $validated['password'],
        ];

        if (Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            if (Auth::guard('admin')->user()->role !== 'admin') {
                Auth::guard('admin')->logout();
                return back()->withErrors(['nik' => 'Akses ditolak. Anda bukan Admin Desa.']);
            }
            $request->session()->regenerate();
            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'nik' => 'Email/NIK atau password salah.',
        ]);
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
