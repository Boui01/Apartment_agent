<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Content\Apartment\Apartment;
use App\Models\Content\ApartmentService;
use Illuminate\Http\Request;


class TrashController extends Controller
{
    public function Trash()
    {
        // Retrieve all soft-deleted apartments
        $apartment_trash = Apartment::onlyTrashed()->get();
        $services = []; 
        if(count($apartment_trash) > 0){
            foreach ($apartment_trash as $apartment) {
                if( $apartment ){
                    $apartment_service = ApartmentService::where("apartment_id", $apartment->id_apartment)->with("services")->get();
                    if ( $apartment_service->count() > 0){
                        foreach ($apartment_service as $s) {
                            $services[] = $s;
                        }
                    }
                    else{
                        return response()->json([ 404 => 'Services not found in this apartment!']);
                    }
                }
                else{
                    return response()->json([ 404 => 'Apartment not found this time!']);
                }
            }

            return response()->json([
                'message' => 'Apartments restored successfully',
                'data' => $apartment_trash->toArray(), // Convert restored apartments to array
                'services' => $services
            ]);
        }
        else{
            return response()->json([ 404 => 'Apartment not found this time!']);
        }
    }

    public  function Apartment_Restore(Request $request){
        $ids = $request->input('ids'); 
        $data = Apartment::withTrashed()->whereIn('id_apartment', $ids)->restore();
        if (!$data) {
            return response()->json(['message' => 'Apartment not found'], 404);
        }

        return response()->json([
            'message' => 'Apartments restored successfully',
            'data' => $data
        ]);

    }

    public  function Apartment_Destroy(Request $request){
        $ids = $request->input('ids'); 
        $data = Apartment::withTrashed()->whereIn('id_apartment', $ids)->forceDelete();
        if (!$data) {
            return response()->json(['message' => 'Apartment not found'], 404);
        }

        return response()->json([
            'message' => 'Apartments deleted successfully',
            'data' => $data
        ]);
  
 
     }
}
