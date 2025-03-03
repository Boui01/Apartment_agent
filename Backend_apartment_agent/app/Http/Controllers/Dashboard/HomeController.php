<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Base\Admin\Admin;
use App\Models\Base\Employee\Employee;
use App\Models\Base\User\ImageUser;
use App\Models\Content\Apartment\Apartment;
use App\Models\Content\Apartment\ImageApartment;
use App\Models\Content\ApartmentService;
use App\Models\Content\Reservation\Reservation;
use App\Models\Dashboard\Payment\Payment;
use App\Models\Dashboard\Problem\Problem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HomeController extends Controller
{
    public function Reservation_all(){
        $reservation = Reservation::with('user','apartment')->get();
        if($reservation->isEmpty()){
            return response()->json([404 => 'Can not found reservation!']);
        }
        else{
            return response()->json([ 'data' => $reservation]);
        }
    }
    public function Reservation_update($id,Request $request){
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
        ]);
        $validator_2 = Validator::make(['id_check' => $id],[
            'id_check' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) {
                    $employeeExists = Employee::where('id_card', $value)->exists();
                    $adminExists = Admin::where('id_card', $value)->exists();

                    if (!$employeeExists && !$adminExists) {
                        $fail("The $attribute does not exist in either the employees or admins table.");
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson()  ]);
        }
        else if ($validator_2->fails()) {
            return response()->json([422 => $validator_2->errors()->toJson() ]);
        }


        foreach ( $request->input('ids') as $index => $reservation_id ) {
            $reservation = Reservation::find($reservation_id);

            if(!$reservation){
                return response()->json([422 => 'Reservation not found!']);
            }else{
                $reservation->status = $reservation->status == 0 ?  1 : 0 ;
                $reservation->save();
            }
            
            if( $index == count($request->input('ids'))-1){
                return response()->json([ 'data'  => $reservation ]);
            }

        }

        return response()->json([ 404 => 'ids not found'.$request->input('ids') ]);
    }


    public function Reservation_destroy(Request $request){
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:reservations,id_reservation',
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson()  ]);
        }
        

        $reservation_del = Reservation::whereIn('id_reservation',$request->input('ids'))->forceDelete();
        if(!$reservation_del){
            return response()->json([422 => 'Failed to delete reservations!'], 422);
        }
        
        return response()->json([ 'data'  => $request->input('ids') ]);
    }



                                        ///////////////            Apartment              /////////////// 
    public function Apartment_all(){
        $apartment = Apartment::with('user')->get();
        if($apartment){
            $service = ApartmentService::with('services')->get();
            $images = ImageApartment::all();
            $image_data = [];
            $user_image = [];

                foreach ($images as $image) {
                    if($images){
                        $image_data[$image->apartment_id] = base64_encode($image->image);
                    }
                    else{
                        return response()->json([ 404 => 'Can not found image aparment']); 
                    }
                }


                foreach ($apartment as $data) {
                    if($data){
                        $imageU = ImageUser::where('user_card_id', $data->card_id)->first();
                        $user_image[$data->card_id] = base64_encode( $imageU->image );
                    }
                    else{
                        return response()->json([ 404 => 'Can not found data aparment']);
                    }
                    
                }


            if( $apartment && $service && $image_data && $user_image ){
                return response()->json([
                    'data' => $apartment,
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


    public function Apartment_Edite($id,Request $request){
        $validator = Validator::make(['request' =>$request->all()], [
            'request.ids' => 'required|array',
        ]);
        $validator_2 = Validator::make(['id_check' => $id],[
            'id_check' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) {
                    $employeeExists = Employee::where('id_card', $value)->exists();
                    $adminExists = Admin::where('id_card', $value)->exists();

                    if (!$employeeExists && !$adminExists) {
                        $fail("The $attribute does not exist in either the employees or admins table.");
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);
        }
        else if ($validator_2->fails()) {
            return response()->json([422 => $validator_2->errors()->toJson() ]);
        }
        $apartment_send_back = [];
        foreach ($request->input('ids') as $id_apartment) {
            $apartment = Apartment::find($id_apartment);
            if(!$apartment){
                return response()->json([404 => 'Apartment not found!']);
            }

            $apartment->update(['status' => $apartment->status == 1 ? 0 : 1]);
            $apartment_send_back[] = $apartment;
        }
        return response()->json(['data' => $apartment_send_back]);
    }

    public function Apartment_Delete(Request $request , $id){
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
        ]);
        $validator_2 = Validator::make(['id_check' => $id],[
            'id_check' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) {
                    $employeeExists = Employee::where('id_card', $value)->exists();
                    $adminExists = Admin::where('id_card', $value)->exists();

                    if (!$employeeExists && !$adminExists) {
                        $fail("The $attribute does not exist in either the employees or admins table.");
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson()  ]);
        }
        else if ($validator_2->fails()) {
            return response()->json([422 => $validator_2->errors()->toJson() ]);
        }

        $apartment_del = Apartment::whereIn('id_apartment',$request->input('ids'))->delete();
        if(!$apartment_del){
            return response()->json([422 => 'Failed to delete apartment!'], 422);
        }

        return response()->json([ 'data'  => $apartment_del ]);
    }


                                        ///////////////            Payment              /////////////// 

    public function Payment_all(){
        $payment = Payment::with('user','employee','apartment')->get();

        return response()->json([ 'data' => $payment]);

    }

    public function Payment_create(Request $request,$id){
        $validator =  Validator::make(['ids' => $request->input('ids')] , [
            'ids'=> 'required|array',
        ]);
        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson()  ]);
        }

        $ids_reservation = $request->input('ids');
        $reservations = Reservation::whereIn('id_reservation',$ids_reservation)->with('apartment')->get();
        $payment = [];

        // check reservation
        if($reservations->isEmpty()){
            return response()->json([404 => 'Can not found reservation!']);
        }
        else{
            foreach ($reservations as $reservation) {
                // check permission
                if ($reservation->apartment && $reservation->status == 1 ) {
                    $validator_2 = Validator::make(['id_employee_id_admin'=> $id],[
                        'id_employee_id_admin' => 'required|string' ,       
                            function ($attribute, $value, $fail) {
                                $employeeExists = Employee::where('id_card', $value)->exists();
                                $adminExists = Admin::where('id_card', $value)->exists();
                                
                                if (!$employeeExists && !$adminExists) {
                                    $fail("The $attribute does not exist in either the employees or admins table.");
                                }
                            },
                    ]);
                    if ($validator_2->fails()) {
                        return response()->json([422=> $validator_2->errors()->toJson() ]);
                    }
                    // change when permission admin
                    $id_secure = Employee::find($id) ? $id : '0';


                    $payment[] = [
                        'user_card_id' => $reservation->card_id,
                        'employee_card_id' => $id_secure,
                        'apartment_id' => $reservation->apartment_id,
                        'reservation_id' => $reservation->id_reservation,
                        'price' => $reservation->apartment->price,
                        'status_user' => false,
                        'status_employee' => false,
                        'created_at' => now(),
                        'updated_at' => now(),                                      
                    ];
                }
                else{
                    return response()->json([422 => 'You must got confirm this reservation from own apartment this' .
                                                    ' ID Reservation : '.$reservation->id_reservation.
                                                    ' ID User : '.$reservation->card_id.
                                                    ' Name  : '.$reservation->apartment->name.
                                                    ' !']);
                }   
            }
            Payment::insert($payment);
            return response()->json([ 'data'  =>   $payment ]);
        }
    }

    public function Payment_update(Request $request,$id){
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:payments,id_payment',
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);
        }

        $payments = Payment::whereIn('id_payment',$request->input('ids'))->get();
        // change when permission admin
        $id_secure = Employee::find($id) ? $id : '0';
        
        foreach ($payments as $payment ) {
            // check permission
            if ($id_secure === $payment->employee_card_id || $id_secure === '0') {    

                // update total room
                if( $payment->status_employee == 0){
                    $reservation = Reservation::find($payment->reservation_id);
                    // check reservation
                    if( $reservation){
                        // check apartment
                        $apartment = Apartment::find($reservation->apartment_id);
                        if( $apartment ){
                            // update total room
                            $apartment->total_room = $apartment->total_room - $reservation->room;
                            // check for change status
                            if ($apartment->total_room <= 0){
                                $apartment->total_room = 0;
                                $apartment->status = 0;                               
                            }
                            $apartment->save();

                            // change status payment
                            $payment->status_employee = $payment->status_employee == 1? 0 : 1;
                            $payment->save();
                        }
                        else{
                            response()->json([ 404 => 'Can not found Apartment!'] );
                        }
                    }
                    else{
                        response()->json([404 => 'Can not found Reservation!']);
                    }
                }
                // restore total room
                else{
                    $reservation = Reservation::find($payment->reservation_id);
                    // check reservation
                    if( $reservation){
                        // check apartment
                        $apartment = Apartment::find($reservation->apartment_id);
                        if( $apartment ){
                            // update total room
                            $apartment->total_room = $apartment->total_room + $reservation->room;
                            // check for change status
                            if($apartment->total_room > 0){
                                $apartment->status = 1;    
                            }
                            $apartment->save();

                            // change status payment
                            $payment->status_employee = $payment->status_employee === 1? 0 : 1;
                            $payment->save();
                        }
                        else{
                            response()->json([ 404 => 'Can not found Apartment!'] );
                        }
                    }
                    else{
                        response()->json([404 => 'Can not found Reservation!']);
                    }
                }
            }

            // error permission
            else{
                return response()->json([422 => "You don't have Permission in this payment!" ], );
            }
        }

        return response()->json([ 'data'  => $payments ]);
    }

    public function Payment_destroy(Request $request,$id){
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:payments,id_payment',
        ]);
        $validator_2 = Validator::make(['id_check' => $id],[
            'id_check' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) {
                    $employeeExists = Employee::where('id_card', $value)->exists();
                    $adminExists = Admin::where('id_card', $value)->exists();

                    if (!$employeeExists && !$adminExists) {
                        $fail("The $attribute does not exist in either the employees or admins table.");
                    }
                },
            ],
        ]);


        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson()  ]);
        }
        
        else if ($validator_2->fails()) {
            return response()->json([422 => $validator_2->errors()->toJson() ]);
        }
        
        $payments = Payment::whereIn('id_payment',$request->input('ids'))->get();
        // change when permission admin
        $id = Employee::find($id) ? $id : '0';

        foreach ($payments as $payment ) {
            if ($id === $payment->employee_card_id || $id == '0'){
                $payments_del = $payment->delete();
                if(!$payments_del){
                    return response()->json([422 => 'Failed to delete payments!'], 422);
                }
            }
        }
        return response()->json([ 'data'  => $payments ]);

    }



                                        ///////////////            Problem             /////////////// 
                                        
    public function Problem_all(){
        $problems = Problem::with('user','employee')->get();
        $problem_filter_onePm = [];
        if(count($problems) > 0){
            foreach ($problems as $problem) {
                if ($problem->permission == 1 && $problem->solve != null) {
                    $problem_filter_onePm[] = $problem;
                }
            }

            return response()->json([ 'data' => $problem_filter_onePm]);
        }
        else{
            return response()->json([ 404 => 'Can not found data problem!']);
        }
    }
    public function Problem_dashboard_all(){
        $problems = Problem::with('user','employee')->get();
        return response()->json([ 'data' => $problems]);
    }


    public function Problem_find($value){
        $validate = Validator::make(['value'=>$value],[
            'value' => 'string|max:255',
        ]);
        if ($validate->fails()) {
            return response()->json([422 => $validate->errors()->toJson() ]);
        }

        $problems = Problem::where('content','like',"%{$value}%")->with('user','employee')->get();
        $problem_filter_onePm = [];

        foreach ($problems as $problem ) {
            if ($problem->permission == 1 && $problem->solve != null) {
                $problem_filter_onePm[] = $problem;
            }
        }

        return response()->json([ 'data' => $problem_filter_onePm]);
    }

    public function Problem_create(Request $request , $id){
        $validator =  Validator::make($request->all(), [
           'search' => 'string|max:255'
        ]);

        if ($validator->fails()){
            return response()->json([422 => $validator->errors()->toJson() ]);
        }

        $problem = new Problem();
        $problem->user_card_id = $id;
        $problem->content = $request->input('search');
        $problem->permission = 1;
        $problem->save();
        
        return response()->json([ 'data' => 'Send problem and created successfully!']);
    }
    public function Problem_update(Request $request , $id){
        $validator = Validator::make($request->all(), [
            'ids.*' => 'integer|exists:problems,id_problem',
            'edite.type' => 'string|max:255',
            'edite.permission' => 'integer|max:10',
            'edite.solve' =>'string|max:255',
        ]);
        $validator_2 = Validator::make(['id_employee' => $id],[
            'id_employee' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) {
                    $employeeExists = Employee::where('id_card', $value)->exists();
                    $adminExists = Admin::where('id_card', $value)->exists();

                    if (!$employeeExists && !$adminExists) {
                        $fail("The $attribute does not exist in either the employees or admins table.");
                    }
                },
            ],
        ]);
        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);
        }
        else if ($validator_2->fails()) {
            return response()->json([422 => $validator_2->errors()->toJson() ]);
        }

        $problems = Problem::whereIn('id_problem',$request->input('ids'))->get();
        $id_emp_or_adm = Employee::find($id) ? $id : '0';

        foreach ($problems as $problem ) {
            if ($id_emp_or_adm === $problem->employee_card_id || $problem->employee_card_id == null){
               $problem->employee_card_id = $id_emp_or_adm;
               $problem->type = $request->input('edite')['type'];
               $problem->permission = $request->input('edite')['permission'];
               $problem->solve = $request->input('edite')['solve'];
               $problem->save();           
            }
            else{
                return response()->json([422 => "You don't have Permission in this problem!" ], );
            }
        }
        return response()->json([ 'data' => $problems]);
    }
    public function Problem_destroy(Request $request,$id){
        $validator = Validator::make($request->all(), [
            'ids.*' => 'integer|exists:problems,id_problem',
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson()  ]);
        }

        $problems = Problem::whereIn('id_problem',$request->input('ids'))->get();
        foreach ($problems as $problem ) {
            if ($id === $problem->employee_card_id  || $problem->employee_card_id == null){
                $problems_del = $problem->delete();
                if(!$problems_del){
                    return response()->json([422 => 'Failed to delete problems!'], 422);
                }
            }
        }
        return response()->json([ 'data'  => $problems ]);

    }
}
