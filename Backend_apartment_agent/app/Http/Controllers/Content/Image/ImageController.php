<?php

namespace App\Http\Controllers\Content\Image;

use App\Http\Controllers\Controller;
use App\Models\Base\User\ImageUser;
use App\Models\Content\Apartment\ImageApartment;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function Image_upload(Request $request,$id){
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:65',
            'position' => 'required|string|max:100'
        ]);

        $imageFile = $request->file('image');
        $imageName = $id;
        $imageData = file_get_contents($imageFile);

        // Handle image record (assuming you are saving image info in ImageUser)
        if( $request->position == 'user'){
            $image = ImageUser::where('user_card_id', $id)->get();

            if (count($image) > 0) {
                $image[0]->image = $imageData;
                $image[0]->save();
    
                return response()->json(['image' => base64_encode($image[0]->image), 'id_user' => $imageName], 201);
            } 
            else {
                $make = ImageUser::create([
                            'user_card_id' => $id,
                            'image' => $imageData
                        ]);
    
                return response()->json(['image' => base64_encode($make->image), 'id_user' => $imageName], 201);
            }

        }
        else if($request->position == 'apartment'){
            $image = ImageApartment::where('apartment_id', $id)->get();

            if (count($image) > 0 ) {
                foreach ($image as $img) {
                    $img->image = $imageData;
                    $img->save();
        
                    return response()->json(['image' => base64_encode($image[0]->image), 'id_user' => $imageName], 201);
                }
            } 
            else {
                $make = ImageApartment::create([
                            'apartment_id' => $id,
                            'image' => $imageData
                        ]);
    
                return response()->json(['image' => base64_encode($make->image), 'id_user' => $imageName], 201);
            }
        }

    }
    public function Image_show(Request $request){ 
        $validatedData = $request->validate([
            'data' => 'required|array',
        ]);
    
        $image_get = ImageApartment::whereIn('apartment_id' ,$validatedData['data'])->get();
    
        $image = [];

        foreach ($image_get as $img) {
         $image[$img->apartment_id] = base64_encode($img->image);
        }

        return response()->json(['image'=> $image ,$validatedData['data']]);
    }
}
