<?php

namespace App\Http\Controllers\Content\Favorite;

use App\Models\Content\Apartment\ImageApartment;
use App\Models\Content\ApartmentService;
use App\Models\Content\Favorite\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controller; // Import the Controller class

class FavoriteController extends Controller
{
    public function favorite_all(){
        $favarites = Favorite::all();

        return response()->json([ 'data' => $favarites]);
    }
    public function favorite_find($id){
        $validator = Validator::make(['id' => $id],[
            'id' => 'required|integer|exists:users,id_card',
        ]);
        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);
        }

        $favorites = Favorite::where('card_id',$id)->with('apartment')->get();
        $service = [];
        $image = [];

        if($favorites){                
            foreach($favorites as $favorite ) {
                $get = ApartmentService::where('apartment_id',$favorite->apartment_id)->with('services')->get();
                if($get->count() > 0){
                    foreach($get as $item){
                        $service[] = $item;
                    }
                }
            }
            foreach($favorites as $favorite ) {
                $get = ImageApartment::where('apartment_id',$favorite->apartment_id)->first();
                $image[$favorite->apartment_id] = base64_encode($get->image);
            }
        }
        else{
            return response()->json([ 404 => 'Data not found']);
        }

        return response()->json([ 'data' => $favorites , 'service' => $service , 'image' => $image]);
    }

    public function favorite_create(Request $request,$id){
        $validator_1 = Validator::make($request->all(), [
            '*.id' => 'required|integer|exists:apartments,id_apartment',
            '*.room' => 'required|integer|max:10',
            '*.people' =>'required|integer|max:10',
            '*.other' => 'required|string|max:255',
            '*.rental_date' => 'required|date_format:Y-m-d' ,
            '*.objective_rental' => 'required|string|max:255' ,
            '*.pet' => 'required|string|max:255',
        ]);


        $validator_2 = Validator::make( ['id' => $id],[
            'id' => 'required|integer|exists:users,id_card',
        ]);

        if($validator_1->fails()){
            return response()->json([422 => $validator_1->errors()->toJson() ]);
        }
        else if($validator_2->fails()){
            return response()->json([422 => $validator_2->errors()->toJson() ]);
        }

        $favarites = [];
        foreach ($request->all() as $favorite){
            $favarites[] = [
                'card_id' => $id,
                'apartment_id' => $favorite['id'],
                'room' => $favorite['room'],
                'people' => $favorite['people'],
                'other' => $favorite['other'],
                'rental_date' => $favorite['rental_date'],
                'objective_rental' => $favorite['objective_rental'],
                'pet' => $favorite['pet'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        Favorite::insert($favarites);

        return response()->json([ 'data' =>  $favarites]);
    }
    
    public function favorite_update(Request $request,$id){
        $validator = Validator::make($request->all(), [
            'id' => 'integer|exists:favorites,id_favorite',
            'position' => 'string|max:255',
        ]);
        $validator2 = Validator::make(['id' => $id],[
            'id' => 'required|integer|exists:users,id_card'
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);
        }
        else if($validator2->fails()){
            return response()->json([422 => $validator2->errors()->toJson() ]);
        }

        // check favorite exist
        $favorite = Favorite::find($request->input('id'))->first();
        if(!$favorite){
            return response()->json([ 404 => 'Can not found favorite!']);
        }

        // check permission
        if($favorite->card_id != $id){
            return response()->json([ 422 => 'You don\'t have permission!']);
        }

        // check position
        if ($favorite[$request->input('position')] == 'room' ||  $favorite[$request->input('position')] == 'people')
        {
            $validator = Validator::make([ 'value' => $favorite[$request->input('value')]], [
                'value' => 'integer|max:10',
            ]);
            if ($validator->fails()) {
                return response()->json([422 => $validator->errors()->toJson() ]);
            }
        }
        else if ($favorite[$request->input('position')] == 'other' ||  $favorite[$request->input('position')] == 'objective_rental' ||  $favorite[$request->input('position')] == 'objective_rental' ||  $favorite[$request->input('position')] == 'pet')
        {
            $validator = Validator::make([ 'value' => $favorite[$request->input('value')]], [
                'value' => 'string|max:255',
            ]);
            if ($validator->fails()) {
                return response()->json([422 => $validator->errors()->toJson() ]);
            }
        }
        else if ($favorite[$request->input('position')] == 'rental_date'){
            $validator = Validator::make([ 'value' => $favorite[$request->input('value')]], [
                'value' => 'date_format:Y-m-d',
            ]);
            if ($validator->fails()) {
                return response()->json([422 => $validator->errors()->toJson() ]);
            }
        }

        // update
        $favorite->update([ 
            $request->input('position')  =>  $request->input('value'),
            'updated_at' => now(),
        ]);

        return response()->json([ 'data' =>  $favorite]);
    }
    public function favorite_delete(Request $request,$id){
        $validator = Validator::make($request->all(), [
            'id_favorites' => 'required|array',
            'id_favorites.*' => 'integer|exists:favorites,id_favorite',
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);
        }

        $count_delete = 0;
        $favarites = Favorite::whereIn('id_favorite', $request->input('id_favorites'))->get();
        foreach ($favarites as $favarite){
            if($favarite->card_id == (int)$id){
                $favarite->delete();
                $count_delete += 1 ; 
            }
        }

        if($count_delete > 0){
            return response()->json(['message' => 'Deleted Successfully!']);
        }
        else{
            return response()->json(['message' => "You don't have permission this" ]);
        }
    }

    public function favorite_checkbox_delete(Request $request,$id){
        $validator = Validator::make($request->all(), [
            'data.*' => 'integer|exists:favorites,apartment_id',
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);
        }

        $favarites = Favorite::whereIn('apartment_id', $request->input('apartment_ids'))->get();
        foreach ($favarites as $favarite){
            if($favarite->card_id == (int)$id){
                $favarite->delete();
            }
            return response()->json(['message' => 'Deleted Successfully!']);
        }
            return response()->json(['message' => "You don't have permission this" ]);

    }

}
