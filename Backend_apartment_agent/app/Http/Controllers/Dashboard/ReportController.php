<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Base\Admin\Admin;
use App\Models\Content\Apartment\Apartment;
use App\Models\Content\ApartmentService;
use App\Models\Content\Reservation\Reservation;
use App\Models\Dashboard\Payment\Payment;
use App\Models\Dashboard\Report\Report;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{

    public function Report_get(Request $request,$id)
    {
        
        $validator = Validator::make(['id_user' => $id ,'all' => $request->all()], [
            'all.report' =>'required|string',
            'all.start_date' => 'required|date',
            'all.end_date' => 'required|date',
            'id_user' => 'required|integer|exists:admins,id_card',
        ]);
        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);
        }
        
        $report_report = $request->input('report');
        $request_startDate  = Carbon::createFromFormat('Y-m', $request->input('start_date'))->startOfMonth();
        $request_endDate = Carbon::createFromFormat('Y-m', $request->input('end_date'))->endOfMonth();


        // apartment
        if($report_report === 'apartment'){
            $aparments = Apartment::with('user')->get();   
            $services = ApartmentService::with('services')->get();
            $aparments_filter = [];   

            // check apartment
            if($aparments->count() > 0){

                foreach($aparments as $apartment){
                    $apartment_created_at = Carbon::parse($apartment->create_at);

                    // check date
                    if( $apartment_created_at->between($request_startDate, $request_endDate) ){
                        $aparments_filter[] = $apartment;
                    }
                }

                // check filter
                if( count($aparments_filter) > 0){
                    return response()->json([
                        'data' => $aparments_filter ,
                        'service' =>  $services ,
                        'title' => 'Apartment' ,
                        'header' => ['ID','Frist name','Last name', 'Address','Service','Name', 'Description', 'Total','Pet','Rule', 'Price','Created_at','Updated_at']
                    ]);
                }
                else{
                    return response()->json([ 404 => 'Can not find any data in this time']);
                }
            }  

            // check error apartment
            else{
                return response()->json([ 404 => 'Can not find any data in apartment' ]);
            }    
        }

        // reservation
        else if ($report_report=== 'reservation'){
            $reservations = Reservation::with('user','apartment')->get();
            $reservations_filter = [];
            // check reservation
            if($reservations->count() > 0){

                // check date
                foreach($reservations as $reservation){
                    $reservation_created_at = Carbon::parse($reservation->create_at);

                    if( $reservation_created_at->between($request_startDate, $request_endDate)  ){
                        $reservations_filter[] = $reservation;
                    }
                }

                // check filter
                if( count($reservations_filter) > 0){
                    return response()->json([
                        'data' => $reservations , 
                        'title' => 'Reservation' ,
                        'header' => ['ID','Frist name','Last name','Apartment name','Room','People','Other','Status','Rental date','Objective rental','Pet','Reservation date']
                    ]);
                }
                else{
                    return response()->json([ 404 => 'Can not find any data in this time']);
                }

            }
            // chek error reservation
            else{
                return response()->json([ 404 => 'Can not find any data in reservation' ]);
            }

        }

        // payment
        else if ($report_report=== 'payment'){
            $payments = Payment::with('user','employee','apartment')->get();
            $payments_filter = [];
            // check payment
            if($payments->count() > 0){

                // check date
                foreach($payments as $payment){
                    $payments_create_at = Carbon::parse($payment->create_at);

                    if( $payments_create_at->between($request_startDate, $request_endDate) ){
                        $payments_filter[] = $payment;
                    }

                }

                // check filter
                if( count($payments_filter) > 0){
                    return response()->json([
                        'data' => $payments , 
                        'title' => 'Payment' ,
                        'header' => ['ID','User Frist name','User Last name','Employee Frist name','Employee Last name','Apartment Name','Price','Status user','Status employee','Created at','Updated at']
                    ]);
                }
                else{
                    return response()->json([ 404 => 'Can not find any data in this time']);
                }
            }

            // check error payment
            else{
                return response()->json([ 404 => 'Can not find any data in payment' ]);
            }
        }

        //  trash
        else if ($report_report=== 'trash'){
            $aparments = Apartment::onlyTrashed()->with('user','service')->get();
            $services = ApartmentService::with('services')->get();
            $aparments_filter = [];
            // check trash
            if($aparments->count() > 0){

                // check date
                foreach($aparments as $apartment){
                    $apartment_deleted_at = Carbon::parse($apartment->deleted_at);

                    if( $apartment_deleted_at->between($request_startDate, $request_endDate) ){
                        $aparments_filter[] = $apartment;
                    }
                }

                // check filter
                if( count($aparments_filter) > 0){
                    return response()->json([
                        'data' => $aparments_filter ,
                        'service' =>  $services ,
                        'title' => 'Trash' ,
                        'header' => ['ID','Frist name','Last name', 'Address','Service','Name', 'Description', 'Total','Pet','Rule', 'Price','Deleted at']
                    ]);
                }
                else{
                    return response()->json([ 404 => 'Can not find any data in this time']);
                }
            }

            // check error trash
            else{
                return response()->json([ 404 => 'Can not find any data in trash' ]);
            }
        }
    }

}
