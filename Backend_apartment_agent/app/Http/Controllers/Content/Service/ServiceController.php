<?php

namespace App\Http\Controllers\Content\Service;

use App\Models\Content\ApartmentService;
use App\Models\Content\Service\Service;
use Illuminate\Routing\Controller; // Import the Controller class

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    public function Service_all (){
        $services = Service::all();
        return response()->json([ 'data' => $services ]);
    }

    public function Service_find ($id){
        $services = Service::find($id);
        if($services){
            return response()->json([ 'data' => $services ]);
        }
        else{
            return response()->json([ 404 => 'Data service not found']);
        }
        
    }
    public function Service_apartment_service_search ($id){
        $services = ApartmentService::where('service_id',$id)->with('apartments')->get();
        $service_check = [];
        foreach ($services as $item) {
            if ($item->apartments) {
                $service_check[] = $item;
            }
        }
        if($service_check){
            return response()->json([ 'data' => $service_check ]);
        }
        else{
            return response()->json([ 404 => 'Data service not found']);
        }
    }

    public function Service_apartment_search ($id){
        $services = ApartmentService::where('apartment_id',$id)->with('services')->get();
        if($services){
            return response()->json([ 'data' => $services ]);
        }
        else{
            return response()->json([ 404 => 'Data service not found']);
        }
    }

    public function Service_create (Request $request){
        $validated = Validator::make($request->input('list'),[
            'name' => 'required|string|max:255',
            'thai_name' => 'required|string|max:255',
        ]);
        


        if ($validated->fails()) {
            return response()->json([402 => $validated->errors()->toJson() ]);
        }

        $list = $request->input('list');

        $service = Service::create([
            'name'  => $list['name'],
            'thai_name'  => $list['thai_name']
        ]);
        
        return response()->json(['data' => $service]);
    }
}
