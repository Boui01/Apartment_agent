<?php

namespace App\Http\Middleware;

use App\Models\Base\Admin\Admin;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {

        // Check if the user's status is active (e.g., assuming status=1 means active)
        if ($request->status_user == 'admin' || $request->status_user == 'employee') {
            return $next($request);
        }

        return response()->json([422 => "You don't have permission in this path!!"], );
        // If active, proceed to the next request

    }
}
