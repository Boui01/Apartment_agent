<?php

namespace App\Http\Controllers\Content\Reservation;

use App\Http\Controllers\Controller;
use App\Models\Content\Apartment\ImageApartment;
use App\Models\Content\ApartmentService;
use App\Models\Content\Reservation\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    public function Reservation_find($id){
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer|exists:users,id_card',
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson()  ]);
        }

        $reservations = Reservation::where('card_id', $id)->with('apartment')->get();
        $services = [];
        $image = [];
        if (!$reservations) {
            return response()->json([404 => 'Can not found reservation!']);
        }
        foreach ($reservations as $reservation) {
            $get_image = ImageApartment::where('apartment_id', $reservation->apartment_id)->get();
            $get_service = ApartmentService::where('apartment_id', $reservation->apartment_id)->with('services')->get();
            // image
            foreach ($get_image as $item) {
                if ($item->image) {
                    $image[$item->apartment_id] =  base64_encode($item->image );
                }
                else {
                    return response()->json([404 => 'Can not found image apartment!']);
                }
            }

            // service
            foreach ($get_service as $item) {
                if ( $item->services){
                    $services[] = [ 'reservation_id' => $reservation->id_reservation,'service' => $item];
                }else{
                    return response()->json([ 404 => 'Can not found image service!']);
                }
            }

        }
        return response()->json([ 
            'data' => $reservations, 
            'service' => $services,
            'image' => $image,
    
        ]);
    }
    
    public function Reservation_create(Request $request,$id){
        $validator = Validator::make($request->all(), [
            'reservations' => 'required|array',
            'reservations.*.apartment_id' =>'required|integer|exists:apartments,id_apartment',
            'reservations.*.room' => 'required|integer',
            'reservations.*.people' => 'required|integer',
            'reservations.*.other' => 'required|string|max:255',
            'reservations.*.rental_date' => 'required|date_format:Y-m-d',
            'reservations.*.objective_rental' => 'required|string|max:255',
            'reservations.*.pet' => 'required|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson()  ]);
        }
        
        $reservations = [];
        foreach ($request->input('reservations') as $reservation) {
            $reservations[] = [
                'card_id' => $id,
                'apartment_id' => $reservation['apartment_id'],
                'room' => $reservation['room'],
                'people' => $reservation['people'],
                'other' => $reservation['other'],
                'status' => 0,
                'rental_date' => $reservation['rental_date'],
                'objective_rental' => $reservation['objective_rental'],
                'pet' => $reservation['pet'],
                'reservation_date' => now(),
                'deleted_at' => null,
            ];
        }
        Reservation::insert($reservations);

        return response()->json([ 'data' => $reservations]);
    }

}
