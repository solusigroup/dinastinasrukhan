<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanChat
{
    /**
     * Handle an incoming request.
     * Ensure the user is authenticated, active, and not a viewer.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || $user->isViewer() || $user->isPendingRole() || !$user->isActive()) {
            abort(403, 'Pengguna dengan peran Viewer tidak diizinkan menggunakan fitur Chat.');
        }

        return $next($request);
    }
}
