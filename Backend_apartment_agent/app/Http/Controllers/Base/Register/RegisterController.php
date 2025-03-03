<?php

namespace App\Http\Controllers\Base\Register;

use App\Models\Base\Admin\Admin;
use App\Models\Base\Admin\ImageAdmin;
use App\Models\Base\Bank\Bank;
use App\Models\Base\Employee\Employee;
use App\Models\Base\Employee\ImageEmployee;
use App\Models\Base\User\ImageUser;
use App\Models\Base\User\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Routing\Controller; // Import the Controller class
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_card' => ['required','string','max:13','unique:users'],
            'english_fname' => ['required', 'string', 'max:30'],
            'english_lname' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:255'],
            'birthday' => ['required', 'date'],
            'religion'=> ['required', 'string', 'max:10'],
            'sex'=> ['required', 'string', 'max:10'],
            'age' => ['required', 'integer', 'max:100'],
            'phone' => ['required', 'string', 'max:10'],
            'line_id' => ['required', 'string', 'max:30'],
            'financial_statement'  => ['required', 'integer', 'max:999999'],     
            'guarantor_english_fname' => ['required', 'string', 'max:30'], 
            'guarantor_english_lname' => ['required', 'string', 'max:30'], 
            'guarantor_address' => ['required', 'string', 'max:255'],      
            'guarantor_phone' => ['required', 'string', 'max:10'],    
            'bank_id'=> ['required', 'string', 'max:11','unique:banks,id_bank'],
            'bank_type'=> ['required', 'string', 'max:30'],
            'email' => ['required', 'string', 'email', 'max:30', 'unique:users,email', 'unique:employees,email', 'unique:admins,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);

        }

        // create bank 
        Bank::insert([
            'id_bank' => $request->bank_id,
            'type' =>$request->bank_type,                
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // create user   
        User::insert([
            'id_card' => $request->id_card,
            'english_fname' => $request->english_fname,
            'english_lname' => $request->english_lname,
            'address' => $request->address,
            'birthday' => $request->birthday,
            'age' => $request->age,
            'religion'=> $request->religion,
            'sex'=> $request->sex,
            'phone' => $request->phone,
            'line_id' => $request->line_id,
            'bank_id' => $request->bank_id,
            'financial_statement'  => $request->financial_statement,       
            'guarantor_english_fname' => $request->guarantor_english_fname, 
            'guarantor_english_lname' => $request->guarantor_english_lname, 
            'guarantor_address' => $request->guarantor_address,      
            'guarantor_phone' => $request->guarantor_phone,     
            'email' => $request->email,
            'user_create' => now(),
            'last_login' => now(),
            'password' => Hash::make($request->password),
        ]);

        // create image default
        $imageDirectory = public_path('Image/Unknown_person.jpg');
        $images = File::get($imageDirectory);
        ImageUser::create([
            'user_card_id' => $request->id_card,
            'image' => $images
        ]);


        // Get user for put session login
        $image = ImageUser::where('user_card_id', $request->id_card)->first();
        $bank = Bank::where('id_bank', $request->bank_id)->first();
        $user = User::where('email', $request->email)->first();
        if ($user && Hash::check($request->password, $user->password)) {
                return response()->json([
                    'user' => [
                        'id' => $user->id_card,
                        'th_fname' => $user->thai_fname,
                        'th_lname' => $user->thai_lname,
                        'fname' => $user->english_fname,
                        'lname' => $user->english_lname,
                        'address' => $user->address,
                        'birthday' => $user->birthday,
                        'age' => $user->age,
                        'religion'=> $request->religion,
                        'sex'=> $request->sex,
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
                    'image' => base64_encode($image->image),
                    'bank' => $bank
                ]);
        }

    
    }












/*                                                                      Employee                                                               */ 


    public function Register_employee(Request $request , $id){
        $validator = Validator::make($request->all(), [
            'id_card' => ['required','string','max:13','unique:employees'],
            'thai_fname' => ['required', 'string', 'max:30'],
            'thai_lname' => ['required', 'string', 'max:30'],
            'english_fname' => ['required', 'string', 'max:30'],
            'english_lname' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:255'],
            'birthday' => ['required', 'date'],
            'religion'=> ['required', 'string', 'max:10'],
            'sex'=> ['required', 'string', 'max:10'],
            'age' => ['required', 'integer', 'max:100'],
            'phone' => ['required', 'string', 'max:10'],
            'line_id' => ['required', 'string', 'max:30'],
            'email' => ['required', 'string', 'email', 'max:30', 'unique:employees'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'status' => ['required', 'string' , 'in:employee' ]
        ]);

        $validator2 = Validator::make(['id'=>$id],[
            'id.*' => 'required|string|exists:employees,id_employee'
        ]);

        if ($validator->fails() && $validator2->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);

        }


        // create employee   
        Employee::insert([
            'id_card' => $request->id_card,
            'thai_fname' => $request->thai_fname,
            'thai_lname' => $request->thai_lname,
            'english_fname' => $request->english_fname,
            'english_lname' => $request->english_lname,
            'address' => $request->address,
            'birthday' => $request->birthday,
            'age' => $request->age,
            'religion'=> $request->religion,
            'sex'=> $request->sex,
            'phone' => $request->phone,
            'line_id' => $request->line_id, 
            'email' => $request->email,
            'employee_create' => now(),
            'last_login' => now(),
            'password' => Hash::make($request->password),
        ]);


        // create image default
        $imageDirectory = public_path('Image/Unknown_person.jpg');
        $images = File::get($imageDirectory);
        ImageEmployee::create([
            'employee_card_id' => $request->id_card,
            'image' => $images
        ]);


        // Get user for put session login
        $image = ImageEmployee::where('employee_card_id', $request->id_card)->first();
        $employee = Employee::where('email', $request->email)->first();
        if ($employee && Hash::check($request->password, $employee->password)) {
                return response()->json([
                    'user' => [
                        'id' => $employee->id_card,
                        'th_fname' => $employee->thai_fname,
                        'th_lname' => $employee->thai_lname,
                        'fname' => $employee->english_fname,
                        'lname' => $employee->english_lname,
                        'address' => $employee->address,
                        'birthday' => $employee->birthday,
                        'age' => $employee->age,
                        'religion'=> $request->religion,
                        'sex'=> $request->sex,
                        'phone' => $employee->phone,
                        'line_id' => $employee->line_id,
                        'email' => $employee->email,
                        'status' => "employee"
                    ],
                    'image' => base64_encode($image->image),
                    'bank' => ''
                    ]);
        }
        else{
            return response()->json([401 => 'Error get data to login.'] );
        }
 }


















    



/*                                                                      Admin                                                               */ 



    public function Register_admin(Request $request , $id){
        $validator = Validator::make($request->all(), [
            'id_card' => ['required','string','max:13','unique:admins'],
            'thai_fname' => ['required', 'string', 'max:30'],
            'thai_lname' => ['required', 'string', 'max:30'],
            'english_fname' => ['required', 'string', 'max:30'],
            'english_lname' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:255'],
            'birthday' => ['required', 'date'],
            'religion'=> ['required', 'string', 'max:10'],
            'sex'=> ['required', 'string', 'max:10'],
            'age' => ['required', 'integer', 'max:100'],
            'phone' => ['required', 'string', 'max:10'],
            'line_id' => ['required', 'string', 'max:30'],
            'email' => ['required', 'string', 'email', 'max:30', 'unique:admins'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'status' => ['required', 'string' , 'in:admin']
        ]);

        $validator2 = Validator::make(['id'=>$id],[
            'id.*' => 'required|string|exists:admins,id_admin'
        ]);

        if ($validator->fails() && $validator2->fails()) {
            return response()->json([422 => $validator->errors()->toJson() ]);

        }


        // create admin          
        Admin::insert([
            'id_card' => $request->id_card,
            'thai_fname' => $request->thai_fname,
            'thai_lname' => $request->thai_lname,
            'english_fname' => $request->english_fname,
            'english_lname' => $request->english_lname,
            'address' => $request->address,
            'birthday' => $request->birthday,
            'age' => $request->age,
            'religion'=> $request->religion,
            'sex'=> $request->sex,
            'phone' => $request->phone,
            'line_id' => $request->line_id, 
            'email' => $request->email,
            'admin_create' => now(),
            'last_login' => now(),
            'password' => Hash::make($request->password),
        ]);


        // create image default
        $imageDirectory = public_path('Image/Unknown_person.jpg');
        $images = File::get($imageDirectory);
        ImageAdmin::create([
            'admin_card_id' => $request->id_card,
            'image' => $images
        ]);


        // Get user for put session login
        $image = ImageAdmin::where('admin_card_id', $request->id_card)->first();
        $admin = Admin::where('email', $request->email)->first();
        if ($admin && Hash::check($request->password, $admin->password)) {
                return response()->json([
                    'user' => [
                        'id' => $admin->id_card,
                        'th_fname' => $admin->thai_fname,
                        'th_lname' => $admin->thai_lname,
                        'fname' => $admin->english_fname,
                        'lname' => $admin->english_lname,
                        'address' => $admin->address,
                        'birthday' => $admin->birthday,
                        'age' => $admin->age,
                        'religion'=> $request->religion,
                        'sex'=> $request->sex,
                        'phone' => $admin->phone,
                        'line_id' => $admin->line_id,
                        'email' => $admin->email,
                        'status' => "admin"
                    ],
                    'image' => base64_encode($image->image),
                    'bank' => ''
                    ]);
                }
            
        else{
            return response()->json([401 => 'Email not verified. Please check your email to verify.'] );
        }
        

    }

}
