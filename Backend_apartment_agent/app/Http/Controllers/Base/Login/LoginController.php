<?php

namespace App\Http\Controllers\Base\Login;

use App\Models\Base\Admin\Admin;
use App\Models\Base\Admin\ImageAdmin;
use App\Models\Base\Bank\Bank;
use App\Models\Base\Employee\Employee;
use App\Models\Base\Employee\ImageEmployee;
use App\Models\Base\User\ImageUser;
use App\Models\Base\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Routing\Controller; // Import the Controller class


class LoginController extends Controller
{
    public function Login( Request $request){
        $email = $request->input('email');
        $password = $request->input('password');

        $user = User::where('email', $request->email)->first();
        $admin = Admin::where('email', $request->email)->first();
        $employee = Employee::where('email', $request->email)->first();


        if ($user) {
            if( Hash::check($request->password, $user->password)){

                if($user->email_verified_at != null){
                    $image_user = ImageUser::where('user_card_id', $user->id_card)->first();
                    $bank_user = Bank::where('id_bank', $user->bank_id)->first();
                    $token = $user->createToken('API Token')->plainTextToken;
                    // save when click remember
                    if ($request->remember == true){
                        $user->remember_token = now();
                        $user->save();
                    }
                    // Log the user in        
                    return response()->json([
                        'message' => 'Login successful!',
                        'user' => [ // Include relevant user information
                            'id' => $user->id_card,
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
                            'guarantor_english_fname' => $user->guarantor_english_fname, 
                            'guarantor_english_lname' => $user->guarantor_english_lname, 
                            'guarantor_address' => $user->guarantor_address,      
                            'guarantor_phone' => $user->guarantor_phone,     
                            'email' => $user->email,
                            'status' => "user"
                        ],
                        'image' =>  base64_encode($image_user->image),
                        'bank' => $bank_user,
                        'user_token' => $token
                    ]);
                }
                else{
                    return response()->json(['warning' => 'Email Not Verified! you must verify your email first']);
                }
                
            }
            else{
                return response()->json([
                    'warning' => 'This ID Password { '.$password.' } is Not collected'
                ]);
            }
        }
        else if($employee){
            if(Hash::check($request->password, $employee->password)){
                $image_employee = ImageEmployee::where('employee_card_id', $employee->id_card)->first();
                $token = $employee->createToken('API Token')->plainTextToken;
                // Log the user in       
                return response()->json([
                    'message' => 'Login successful!',
                    'user' => [ // Include relevant user information
                        'id' => $employee->id_card,
                        'th_fname' => $employee->thai_fname,
                        'th_lname' => $employee->thai_lname,
                        'fname' => $employee->english_fname,
                        'lname' => $employee->english_lname,
                        'address' => $employee->address,
                        'birthday' => $employee->birthday,
                        'age' => $employee->age,
                        'religion'=> $employee->religion,
                        'sex'=> $employee->sex,
                        'phone' => $employee->phone,
                        'line_id' => $employee->line_id,
                        'email' => $employee->email,
                        'status' => "employee"
                    ],
                    'image' =>  base64_encode($image_employee->image),
                    'bank' => [''],
                    'user_token' => $token
                ]);
            }
            else{
                return response()->json([
                    'warning' => 'This ID Password { '.$password.' } is Not collected'
                ]);    
            }
    }
        else if($admin){
            if(Hash::check($request->password, $admin->password)){
                $image_admin = ImageAdmin::where('admin_card_id', $admin->id_card)->first();
                $token = $admin->createToken('API Token')->plainTextToken;
                // Log the user in       
                return response()->json([
                    'message' => 'Login successful!',
                    'user' => [ // Include relevant user information
                        'id' => $admin->id_card,
                        'th_fname' => $admin->thai_fname,
                        'th_lname' => $admin->thai_lname,
                        'fname' => $admin->english_fname,
                        'lname' => $admin->english_lname,
                        'address' => $admin->address,
                        'birthday' => $admin->birthday,
                        'age' => $admin->age,
                        'religion'=> $admin->religion,
                        'sex'=> $admin->sex,
                        'phone' => $admin->phone,
                        'line_id' => $admin->line_id,
                        'email' => $admin->email,
                        'status' => "admin"
                    ],
                    'image' =>  base64_encode($image_admin->image),
                    'bank' => [''],
                    'user_token' => $token
                ]);
            }
            else{
                return response()->json([
                    'warning' => 'This ID Password { '.$password.' } is Not collected'
                ]);    
            }
        }
        else{
            return response()->json([
                'warning' => 'This ID Email { '.$email.' } is Not collected'
            ]);
        }
       
    }
}
