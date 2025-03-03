<?php

namespace App\Http\Controllers\Content\Api;

use App\Models\Base\User\ImageUser;
use App\Models\Content\Apartment\Apartment;
use App\Models\Content\Apartment\ImageApartment;
use App\Models\Content\ApartmentService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller; // Import the Controller class
use Illuminate\Support\Facades\Validator;

class ApiController extends Controller
{

    public function Create(Request $request){
        $all = $request->all();
        $validated = Validator::make($all,[
            'card_id' => 'required|string|exists:users,id_card',
            'name' => 'required|string|max:255',
            'thai_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'service' => 'required|array',
            'service.*' => 'required|integer|exists:services,id_service',
            'description' => 'required|string|max:255',
            'thai_description' => 'required|string|max:255',
            'bedroom' => 'required|integer|max:10',
            'bathroom' => 'required|integer|max:10',
            'total_room' => 'required|integer|max:10',
            'pet' => 'required|integer|max:2',
            'rule' => 'required|string|max:255',
            'score' => 'required|integer|max:10',
            'price' => 'required|integer|max:999999',
        ]);

        if ($validated->fails()) {
            return response()->json([402 => $validated->errors()->toJson() ]);
        }


        $apartment_create =  Apartment::create([
            'card_id' => $request->card_id,
            'name' => $request->name,
            'thai_name' => $request->thai_name,
            'address' => $request->address,
            'description' => $request->description,
            'thai_description' => $request->thai_description,
            'bedroom' => $request->bedroom,
            'bathroom' => $request->bathroom,
            'total_room' => $request->total_room,
            'pet' => $request->pet,
            'rule' => $request->rule,
            'score' => $request->score,
            'price' => $request->price,
            'status' => 0
        ]);

        foreach($request->service as $service ){
            ApartmentService::create([
                'apartment_id' => $apartment_create->id_apartment,
                'service_id' => $service,
            ]);
        }

        return response()->json([ 'data'  => $apartment_create]);
    }


    public function Edite(Request $request,$id)
    {

        $validated = Validator::make($request->all(),[
            'name' => 'required|string|max:255',
            'thai_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'service' => 'required|array',
            'service.*' => 'required|integer|exists:services,id_service',
            'description' => 'required|string|max:1000',
            'thai_description' => 'required|string|max:1000',
            'bedroom' => 'required|integer|max:10',
            'bathroom' => 'required|integer|max:10',
            'total_room' => 'required|integer|max:10',
            'score' => 'required|integer|max:10',
            'pet'=> 'required|integer|max:2',
            'rule'=> 'required|string|max:255',
            'price' => 'required|integer|max:999999',
        ]);
        $validated_2 = Validator::make(['id_apartment' => $id],[
            'id_apartment' => 'required|integer|exists:apartments,id_apartment',
        ]);

        if ($validated->fails()) {
            return response()->json([422 => $validated->errors()->toJson() ]);
        }
        else if($validated_2->fails()){
            return response()->json([422 => $validated_2->errors()->toJson() ]);
        }

        $data = Apartment::find($id);
        // check apartment
        if ($data) {
            $data->name = $request->name;
            $data->thai_name = $request->thai_name;
            $data->address = $request->address;
            $data->description = $request->description;
            $data->thai_description = $request->thai_description;
            $data->bedroom = $request->bedroom;
            $data->bathroom = $request->bathroom;
            $data->total_room = $request->total_room;
            $request->score == 0 ? null : $data->score = $request->score ;
            $data->pet = $request->pet;
            $data->rule = $request->rule;
            $data->price = $request->price;	
            
            $data->save();
            
            $services = ApartmentService::where('apartment_id',$id)->get();
            // check service
            if($services->count() > 0){
                // delete service
                foreach($services as $service){
                    $service->delete();
                }

                // create service
                foreach($request->service as $service_rq ){
                    ApartmentService::create([
                        'apartment_id' => $id,
                        'service_id' => $service_rq,
                    ]);
                }
                
                return response()->json([
                    'data' => $data,
                    'service' => $services
                ]);
            }
            else{
                return response()->json([404 => 'Data services not found']);
            }

        }
        else{
            return response()->json([404 => 'Data apartment not found']);
        }

    }

    public function Delete($id)
    {
        $data = Apartment::find($id);
        

        if (!$data) {
            return response()->json(['data' => 'Data not found'], 404);
        }

        //$data->softDelete();
        $data->delete();

        return response()->json(['data' => 'Data deleted successfully'], 200);
    }



    public function Find($value)
    {
        $validate = Validator::make(['value' => (int)$value], [
            'value' => 'required|integer|exists:apartments,id_apartment',
        ]);

        if ($validate->fails()) {
            return response()->json([422 => $validate->errors()->toJson() ]);
        }
        
        $data = Apartment::where('id_apartment',(int)$value)->with('user')->first();
        $service = ApartmentService::where('apartment_id',(int)$value)->with('services')->get();
        $image_user = ImageUser::where('user_card_id', $data->card_id)->first();
        $image_apartment = ImageApartment::where('apartment_id',$data->id_apartment)->first();
        $imageU = [$data->card_id => base64_encode($image_user->image)];
        $imageA = [$data->id_apartment => base64_encode($image_apartment->image)];



        return response()->json([
            'data' => $data->toArray(), // Convert users to array
            'service' => $service,
            'image' => $imageA,
            'image_user' => $imageU
        ]);
    }


    
}
