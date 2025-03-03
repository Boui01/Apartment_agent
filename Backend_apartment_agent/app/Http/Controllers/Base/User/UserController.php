<?php

namespace App\Http\Controllers\Base\User;

use App\Models\Base\User\ImageUser;
use App\Models\Base\User\User;
use App\Models\Content\Apartment\Apartment;
use App\Models\Content\Reservation\Reservation;
use App\Models\Dashboard\Payment\Payment;
use Illuminate\Routing\Controller; // Import the Controller class
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function User_all (){
        $users = User::all();
        return response()->json(['data' => $users]);
    }
    public function User_update(Request $request,$id){
        $request->validate([
            'position' => 'required|string|max:255',
        ]);

        $user = User::findOrFail($id);
        $position = $request->position;
        $value = $request->value;
      
       if($position === 'email'){
            $validate = Validator::make($request->all(), [
                'value' => 'required|string|email|max:255|unique:users,email',
            ]);
            if ($validate->fails()) {
                return response()->json([ 422 => $validate->errors()->toJson() ]);
            }

            $user->$position = $value;
            $user->email_verified_at = null;
            $user->save();
        }
        else if($position === 'password'){
            $validate = Validator::make($request->all(), [
                'value' => 'required|string|min:8',
            ]);
            if ($validate->fails()) {
                return response()->json([ 422 => $validate->errors()->toJson() ]);
            }

            $user->$position = Hash::make($request->value);
            $user->email_verified_at = null;
            $user->save();
        }
        else if($position == 'financial_statement' || $position == 'age'){
            $request->validate([
                'value' => 'required|integer|max:999999 ',
            ]);
            $user->$position = $value;
            $user->save();
        }
        else if($position == 'phone' || $position == 'religion' || $position ==  'sex'){
            $request->validate([
                'value' => 'required|string|max:10 ',
            ]);
            $user->$position = $value;
            $user->save();
        }
        else if($position == 'address' || $position == 'guarantor_address'){
            $request->validate([
                'value' => 'required|string|max:255 ',
            ]);
            $user->$position = $value;
            $user->save();
        }
        else if($position == 'birthday'){
            $request->validate([
                'value' => 'required|date_format:Y-m-d',
            ]);
            $user->$position = $value;
            $user->save();
        }
        else{
            $request->validate([
                'value' => 'required|string|max:30',
            ]);
            $user->$position = $value;
            $user->save();
        }

        $result = [ 'id' => $user->id_card,
                    'th_fname' => $user->thai_fname,
                    'th_lname' => $user->thai_lname,
                    'fname' => $user->english_fname,
                    'lname' => $user->english_lname,
                    'address' => $user->address,
                    'birthday' => $user->birthday,
                    'age' => $user->age,
                    'religion'=> $user->religion,
                    'sex'=> $user->sex,
                    'phone' => $user->phone,
                    'line_id' => $user->line_id,
                    'bank_id' => $user->bank_id,
                    'financial_statement'  => $user->financial_statement,     
                    'guarantor_thai_fname'  => $user->guarantor_thai_fname,       
                    'guarantor_thai_lname' => $user->guarantor_thai_lname,    
                    'guarantor_english_fname' => $user->guarantor_english_fname, 
                    'guarantor_english_lname' => $user->guarantor_english_lname, 
                    'guarantor_address' => $user->guarantor_address,      
                    'guarantor_phone' => $user->guarantor_phone,     
                    'email' => $user->email,
                    'status' => "user"
                ];

        return response()->json(['data' =>  $result]);
    }
    public function User_apartments($id){
        $users = Reservation::with('user')->get();
        $aparments = Apartment::where('card_id',$id)->get();
        $reservations = [];

        foreach( $users as $user ){
            if ( $user->apartment != null){
                if( $user->apartment->card_id === $id){
                    $reservations[] = $user;
                }
            }
        }

        

        return response()->json(['data' => $aparments , 'reservation' => $reservations]);
    }
    public function User_payments($id){
        $users = Payment::with('apartment','employee')->where('user_card_id',$id)->get();

        return response()->json(['data' => $users]);
    }
    public function User_reservations($id){
        $users = Reservation::with('apartment')->where('card_id',$id)->get();
        $user_filter = [];
        foreach( $users as $user ){
            if ( $user->apartment != null){
                if( $user->apartment->card_id === $id){
                    $user_filter[] = $user;
                }
            }
        }

        return response()->json(['data' => $user_filter]);
    }
    




    public function User_dashboard(Request $request , $id){
        $validate = Validator::make(['id' => $id], [
            'id' => 'required|exists:admins,id_card'
        ]);
        $validator2 = Validator::make($request->all(),[
            'ids' => 'required|array',
            'position' => 'required|string|max:255',
        ]);

        if ($validate->fails()) {
            return response()->json([ 422 => $validate->errors()->toJson() ]);
        }
        else if ($validator2->fails()) {
            return response()->json([ 422 => $validator2->errors()->toJson() ]);
        }

        foreach($request->ids as $id_user){
            $user = User::findOrFail($id_user);
            $position = $request->position;
            $value = $request->value;
          
           if($position === 'email'){
                $validate = Validator::make($request->all(), [
                    'value' => 'required|string|email|max:255|unique:users,email',
                ]);
                if ($validate->fails()) {
                    return response()->json([ 422 => $validate->errors()->toJson() ]);
                }
    
                $user->$position = $value;
                $user->email_verified_at = null;
                $user->save();
            }
            else if($position === 'password'){
                $validate = Validator::make($request->all(), [
                    'value' => 'required|string|min:8',
                ]);
                if ($validate->fails()) {
                    return response()->json([ 422 => $validate->errors()->toJson() ]);
                }
    
                $user->$position = Hash::make($request->value);
                $user->email_verified_at = null;
                $user->save();
            }
            else if($position == 'financial_statement' || $position == 'age'){
                $request->validate([
                    'value' => 'required|integer|max:999999 ',
                ]);
                $user->$position = $value;
                $user->save();
            }
            else if($position == 'phone' || $position == 'religion' || $position ==  'sex'){
                $request->validate([
                    'value' => 'required|string|max:10 ',
                ]);
                $user->$position = $value;
                $user->save();
            }
            else if($position == 'address' || $position == 'guarantor_address'){
                $request->validate([
                    'value' => 'required|string|max:255 ',
                ]);
                $user->$position = $value;
                $user->save();
            }
            else if($position == 'birthday'){
                $request->validate([
                    'value' => 'required|date_format:Y-m-d',
                ]);
                $user->$position = $value;
                $user->save();
            }
            else{
                $request->validate([
                    'value' => 'required|string|max:30',
                ]);
                $user->$position = $value;
                $user->save();
            }
    
        }


        return response()->json(['data' =>  "success"]);
    }

}
