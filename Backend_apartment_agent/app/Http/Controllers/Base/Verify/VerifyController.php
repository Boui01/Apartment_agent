<?php

namespace App\Http\Controllers\Base\Verify;

use App\Http\Controllers\Controller;
use App\Models\Base\Bank\Bank;
use App\Models\Base\VerificationTokens\VerificationTokens;
use App\Models\Base\User\ImageUser;
use App\Models\Base\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class VerifyController extends Controller
{

    public function Token_create(Request $request){

        $validator = Validator::make($request->input('history'), [
            'email'=> 'required|email|exists:users,email|unique:verification_tokens,email',
            'token' => 'required|string|unique:verification_tokens,token',
        ]);  
        if($validator->fails()){
            return response()->json([422 => $validator->errors()->toJson() ]);
        }
        
        // function create token and delete
        $History = $request->input('history');
        if($History){
            // create token  
            $token = VerificationTokens::insert([
                'email' => $History['email'],
                'token' => $History['token'],
                'created_at' => now()
            ]);

            return response()->json(['data' => 'Create Token successfully!',$token]);
            
        }

        return response()->json([422 => 'Can not Create Token successfully!']);
    }


    
    public function Token_find( $token){     

        $validator = Validator::make(['token' => $token], [
            'token' => 'required|string|exists:verification_tokens,token',
        ]);
        if($validator->fails()){
            return response()->json([422 => $validator->errors()->toJson() ]);
        }


        $token_find = VerificationTokens::where('token', $token)->first();
        if($token_find){
            return response()->json([ 'data' => $token_find->email]);
        }
        else{
            return response()->json([ 422 => 'Token not found',$token]);
        }
    }

    public function Token_delete(){
        $check = VerificationTokens::all();

        foreach ($check as $value) {
            // delete old token 
            if($value->created_at->diffInHours(now()) > 1){
                $user = User::where("email", $value->email)->first();
                $bank = Bank::where("id_bank", $user->bank_id)->first();
                $image = ImageUser::where("user_card_id", $user->id_card)->first();
                // check your email
                if($user && $user->email_verified_at == null && $bank && $image){
                    $user->delete();
                    $bank->delete();
                    $image->delete();
                    $value->delete();
                }
                else{
                    $value->delete();
                }
            }
        }

        return response()->json([ 'data' => 'Delete Token successfully!']);
  
    }


    public function Email_verify($email){

        $validate = Validator::make(['email' => $email], [
            'email' => 'required|string|email|exists:users,email',
        ]);
        if($validate->fails()){
            return response()->json([422 => $validate->errors()->toJson() ]);
        }


        $user =  User::where("email", $email)->first();
        if($user){
            $user->email_verified_at = now();
            $user->save();

            VerificationTokens::where('email', $email)->delete();

            $bank = Bank::where("id_bank", $user->bank_id)->first();
            $image = ImageUser::where("user_card_id", $user->id_card)->first();
            $token = $user->createToken('API Token')->plainTextToken;
            if($bank && $image){
                return response()->json([ 
                    'data' => 'Email verified successfully!'.$email.now(),
                    'user' => [
                        'id' => $user->id_card,
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
                    ],
                    'bank' => $bank,
                    'image' => base64_encode($image->image),
                    'user_token' => $token
                ]);
            }
            else{
                return response()->json([ 422 => 'Bank  and image not found!',$user]);
            }
        } 
        return response()->json([ 422 => 'Can not find Email veridation!',$email]);
    }

    public function New_password (Request $request ,$email) {
        $validate_1 = Validator::make(['email'=> $email], [
            'email'=> 'required|email|exists:users,email',
        ]);

        $validate_2 = Validator::make($request->all(), [
            'password' => 'required|string|min:8|confirmed',
        ]);

        if($validate_1->fails()) {
            return response()->json([422 => $validate_1->errors()->toJson()]);
        }
        elseif($validate_2->fails()) {
            return response()->json([422 => $validate_2->errors()->toJson()]);
        }

        $user = User::where('email', $email)->first();
        if($user){
            $user->password = Hash::make($request->input('password') );
            $user->save();

            VerificationTokens::where('email', $email)->delete();
            return response()->json([ 'data' => 'Password changed successfully!']);
        }
        else{
            return response()->json([ 404 => 'User not found!']);
        }


    }
}
