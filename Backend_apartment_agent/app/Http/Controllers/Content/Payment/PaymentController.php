<?php

namespace App\Http\Controllers\Content\Payment;

use App\Http\Controllers\Controller;
use App\Models\Content\Apartment\ImageApartment;
use App\Models\Content\ApartmentService;
use App\Models\Dashboard\Payment\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function Payment_find($id){

        $validator = Validator::make(['id' => $id], [
            'id' => 'required|string|exists:users,id_card',
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson()  ]);
        }
        
        $payments = Payment::where('user_card_id', $id)->with('apartment' , 'reservation')->get();
        $payment_new = [];
        $service = [];
        $image = [];
        if (!$payments) {
            return response()->json([404 => 'Can not found payment!']);
        }

        foreach ($payments as $payment) {
            // check status
            if( $payment->status_user == 0){      
                $payment_new[] = $payment;         
                $get_service = ApartmentService::where('apartment_id', $payment->apartment_id)->with('services')->get();
                $get_image = ImageApartment::where('apartment_id', $payment->apartment_id)->get();

                // service
                foreach ($get_service as $item) {
                    if ($item->services) {
                        $service[] = ['payment_id' => $payment->id_payment , 'service' => $item];
                    }
                    else {
                        return response()->json([404 => 'Can not found service apartment!']);
                    }
                }

                // image
                foreach ($get_image as $item) {
                    if ($item->image) {
                        $image[$item->apartment_id] =  base64_encode($item->image );
                    }
                    else {
                        return response()->json([404 => 'Can not found image apartment!']);
                    }
                }
            }
        }
        return response()->json(['data' => $payment_new, 'service' => $service, 'image' => $image]);    
    }

    public function Payment_update(Request $request,$id){
        $validate = Validator::make(['id' => $id], [
            'id' => 'required|integer|exists:users,id_card',
        ]);

        $validator = Validator::make($request->all(), [
            'payments' => 'required|array',
            'payments.*.id_payment' => 'integer|exists:payments,id_payment',
            'payments.*.user_card_id' => 'integer|exists:users,id_card',
            'payments.*.apartment_id' => 'integer|exists:apartments,id_apartment',
            'payments.*.reservation_id' => 'integer|exists:reservations,id_reservation',
            'payments.*.status_user' => 'integer|in:0,1',
            'payments.*.status_employee' => 'integer|in:0,1',
        ]);

        if ($validate->fails()) {
            return response()->json([422 => $validate->errors()->toJson()  ]);
        }
        else if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson()  ]);
        }

        foreach ($request->input('payments') as $index => $rq_payment) {
            // check payment
            $payment = Payment::where( 'id_payment', $rq_payment['id_payment'])->first();
            if (!$payment) {
                return response()->json([404 => 'Can not found payment!']);
            }
            
            $payment->status_user = $rq_payment['status_user'];
            $checkUpdate = $payment->save();

            if (!$checkUpdate) {
                return response()->json([422 => 'Failed to update payment!']);
            }

            if ($index == count($request->input('payments')) - 1) {
                return response()->json(['data' => 'Update payment success!' , 'Check' => $payment]);
            }
        }

    }
}
