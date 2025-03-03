<?php

namespace App\Http\Controllers\Content\Apartment;

use App\Http\Controllers\Controller;
use App\Models\Base\User\ImageUser;
use App\Models\Content\Apartment\Apartment;
use App\Models\Content\Apartment\ImageApartment;
use App\Models\Content\Apartment\RememberLikeApartment\Remember_Like_Apartment;
use App\Models\Content\ApartmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApartmentController extends Controller
{
    
    public function All()
    {
        $datas = Apartment::where('status', 1)->with('user')->get();
        
        if($datas){
            $service = ApartmentService::with('services')->get();
            $images = ImageApartment::with('apartment')->get();
            $image_data = [];
            $user_image = [];

                foreach ($images as $image) {
                    if($image && $image->apartment != null){
                        if($image->apartment->deleted_at == null && $image->apartment->status == 1){
                            $image_data[$image->apartment_id] = base64_encode($image->image);
                        }
                    }
                    else if(!$image){
                        return response()->json([ 404 => 'Can not found image aparment']); 
                    }
                }


                foreach ($datas as $data) {
                    if($data && $data->deleted_at == null){
                        $imageU = ImageUser::where('user_card_id', $data->card_id)->first();
                        $user_image[$data->card_id] = base64_encode( $imageU->image );
                    }
                    else{
                        return response()->json([ 404 => 'Can not found data aparment']);
                    }
                    
                }


            if( $datas && $service && $image_data && $user_image ){
                return response()->json([
                    'data' => $datas,
                    'service' => $service,
                    'image' => $image_data,
                    'image_user' => $user_image
                ]);
            }
            else{
                return response()->json([ 404 => 'Can not have data to sent']);
            }
        }
        else{
            return response()->json([ 404 => 'Can not found data in corrent table']);
        }
    }


    public function Search($value)
    {
        $datas = Apartment::where('name', 'like', "%{$value}%") // Search by name
                  //->orWhere('email', 'like', "%{$value}%") // Search by email (optional)
                  ->with("user")->get();

        $serivce = [];
        $imageU = [];
        $imageA = [];
        foreach ($datas as $data) {
            $serivce_list = ApartmentService::where('apartment_id', $data->id_apartment)->with('services')->get();
            $images_list = ImageApartment::where('apartment_id', $data->id_apartment)->get();
            $images_user_list = ImageUser::where('user_card_id', $data->card_id)->get();

           foreach ($serivce_list as $s) {
                $serivce[] = $s;
            }
            foreach ($images_list as $a) {
                $imageA[$data->id_apartment] = base64_encode( $a->image );
            }
            foreach ($images_user_list as $u) {
                $imageU[$data->card_id] = base64_encode($u->image);
            }

        }


        return response()->json([
            'data' => $datas, // Convert users to array
            'service' => $serivce,
            'image' => $imageA,
            'image_user' => $imageU
        ]);
    }

    public function Apartment_owner ( $id){
        $validate = Validator::make(['id_user' => $id],[
            'id_user'=> 'required|integer|exists:users,id_card',
       ] );
       if ($validate->fails()) {
           return response()->json([422 => $validate->errors()->toJson() ]);
       }

       $datas = Apartment::where('card_id', $id)->with("user")->get();
       $serivce = [];
       $imageU = [];
       $imageA = [];

       if( $datas->count() > 0){
            foreach ($datas as $data) {
                $serivce_list = ApartmentService::where('apartment_id', $data->id_apartment)->with('services')->get();
                $images_list = ImageApartment::where('apartment_id', $data->id_apartment)->get();
                $images_user_list = ImageUser::where('user_card_id', $data->card_id)->get();  
                // put in list
                if( $serivce_list->count() > 0  && $images_list->count() > 0 && $images_user_list->count() > 0){
                    foreach ($serivce_list as $s) {
                        $serivce[] = $s;
                    }
                    foreach ($images_list as $a) {
                        $imageA[$data->id_apartment] = base64_encode( $a->image );
                    }
                    foreach ($images_user_list as $u) {
                        $imageU[$data->card_id] = base64_encode($u->image);
                    }
                }
                else{
                    return response()->json([ 404 => 'Can not found data in Apartment or ImageApartment  or ImageUserOwner table']);
                }
            }
        }
        else{
            return response()->json([ 404=> 'Can not found data in apartment table'] );
        }

        if(isset($data) && isset($serivce) && isset($imageU) && isset($imageA)){
            return response()->json([
                'data' => $datas,
                'service' => $serivce,
                'image' => $imageA,
                'image_user' => $imageU
            ]);
        }
        else{
            return response()->json([ 404 => 'Can not found data in all table']);
        }
    }


    public function Apartment_other ( $id){
        $validate = Validator::make(['id_user' => $id],[
            'id_user'=> 'required|integer|exists:users,id_card',
       ] );
       if ($validate->fails()) {
           return response()->json([422 => $validate->errors()->toJson() ]);
       }

       $datas = Apartment::where('card_id', '<>', $id)->with("user")->get();
       $serivce = [];
       $imageU = [];
       $imageA = [];

       if( $datas->count() > 0){
            foreach ($datas as $data) {
                $serivce_list = ApartmentService::where('apartment_id', $data->id_apartment)->with('services')->get();
                $images_list = ImageApartment::where('apartment_id', $data->id_apartment)->get();
                $images_user_list = ImageUser::where('user_card_id', $data->card_id)->get();  
                // put in list
                if( $serivce_list->count() > 0  && $images_list->count() > 0 && $images_user_list->count() > 0){
                    foreach ($serivce_list as $s) {
                        $serivce[] = $s;
                    }
                    foreach ($images_list as $a) {
                        $imageA[$data->id_apartment] = base64_encode( $a->image );
                    }
                    foreach ($images_user_list as $u) {
                        $imageU[$data->card_id] = base64_encode($u->image);
                    }
                }
                else{
                    return response()->json([ 404 => 'Can not found data in Apartment or ImageApartment  or ImageUserOwner table']);
                }
            }
        }
        else{
            return response()->json([ 404=> 'Can not found data in apartment table'] );
        }

        if(isset($data) && isset($serivce) && isset($imageU) && isset($imageA)){
            return response()->json([
                'data' => $datas,
                'service' => $serivce,
                'image' => $imageA,
                'image_user' => $imageU
            ]);
        }
        else{
            return response()->json([ 404 => 'Can not found data in all table']);
        }
    }



    public function Like(Request $request,$id)
    {
        $validate = Validator::make(['id' => $id], [
            'id' => 'required|integer|exists:users,id_card',
        ]);
        $validate_2 = Validator::make(['id_apartment'=> $request->input('apartment_id')], [
            'id_apartment.*' => 'required|integer|exists:apartments,id_apartment',
        ]);
        if ($validate->fails()) {
            return response()->json([422 => $validate->errors()->toJson() ]);
        }
        else if($validate_2->fails()){
            return response()->json([422 => $validate_2->errors()->toJson() ]);
        }

        $remembers = Remember_Like_Apartment::where('apartment_id',$request->input('apartment_id'))->get();
        if($remembers->count() > 0){
            foreach ($remembers as $remember){
                if($remember->card_id == $id){
                    $remember->delete();
                    
                    $apartment = Apartment::where('id_apartment',$request->input('apartment_id'))->first();
                    if($apartment){
                        $apartment->score = $apartment->score-1;
                        $apartment->save();
                        return response()->json(['data' =>  'Deleted remember like Successfully!' ,'status' => false ]);
                    }else{
                        return response()->json([404 => 'Deleted remember can not find apartment!']);
                    }
                }
            }
        }

        Remember_Like_Apartment::create([
            'card_id' => $id,
            'apartment_id' => $request->input('apartment_id'),
            'like' => 1,
            'created_at' => now(),
            'updated_at'=> now()
        ]);
        $apartment = Apartment::where('id_apartment',$request->input('apartment_id'))->first();
        if($apartment){
            $apartment->score = $apartment->score + 1;
            $apartment->save();

            return response()->json(['data'=> 'Remember like Successfully!','status' => true,$apartment]);
        }
        else{
            return response()->json([ 404 => 'Can not find apartment with id '.$request->input('apartment_id')] );
        }

        

    }


    public function Check_like(Request $request , $id){
        $validate = Validator::make(['id_user' => $id], [
            'id_user' => 'required|integer|exists:users,id_card',
        ]);
        $validate_2 = Validator::make($request->all(), [
            'apartment_id' => 'required|integer|exists:apartments,id_apartment',
        ]);
        if ($validate->fails()) {
            return response()->json([422 => $validate->errors()->toJson() ]);
        }
        else if($validate_2->fails()){
            return response()->json([422 => $validate_2->errors()->toJson() ]);
        }

        $remembers = Remember_Like_Apartment::where('apartment_id',$request->input('apartment_id'))->get();
        if($remembers->count() > 0 ){
            foreach($remembers as $remember){
                if($remember){
                    if($remember->card_id == $id){
                        return response()->json(['Data check success','status' => true]);
                    }
                }
                else{
                    return response()->json([404 => 'Can not found remmember data']);
                }
            }
        }
        return response()->json(['Data check success','status' => false]);
    }



    public function Apartment_room( $id){
        $validate = Validator::make(['id_apartment'=> $id], [
            'id_apartment' => 'required|integer|exists:apartments,id_apartment',
        ]);
        if ($validate->fails()) {  
            return response()->json([422=> $validate->errors()->toJson() ]);
        }

        $apartment = Apartment::find($id);
        if($apartment){
            return response()->json(['data' => $apartment->total_room]);
        }
        else{
            return response()->json([404=> 'Apartment not found!']);
        }
    }
}
