<?php

namespace App\Http\Controllers\Base\Verify;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CheckStatusUser extends Controller
{
    public function index (Request $request){
        $user = $request->user();

        // Get status from request
        $status = $request->header('Status'); // If status is sent in the headers
    
        // Or if the status is sent in the body
        // $status = $request->input('status');
    
        // Perform the logic based on the status and token
        if ($user && $status == 'admin') {
            // Your logic to update apartment status or something else
            return response()->json(['message' => 'Success', 'status' => $status]);
        }
    
        // Return error if status or user is missing
        return response()->json(['message' => 'Unauthorized or missing status'], 401);
    }
}
