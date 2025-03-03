<?php

namespace App\Http\Controllers\Base\Employee;

use App\Http\Controllers\Controller;
use App\Models\Base\Employee\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function Employee_all (){
        $employees = Employee::all();
        return response()->json(['data' => $employees]);
    }

    public function Employee_update(Request $request, $id){
        $request->validate([
            'position' => 'required|string|max:255',
        ]);

        $employee = Employee::findOrFail($id);
        $position = $request->position;
        $value = $request->value;
      
       if($position === 'email'){
            $validate = Validator::make($request->all(), [
                'value' => 'required|string|email|max:255|unique:users,email',
            ]);
            if ($validate->fails()) {
                return response()->json([ 422 => $validate->errors()->toJson() ]);
            }

            $employee->$position = $value;
            $employee->email_verified_at = null;
            $employee->save();
        }
        else if($position === 'password'){
            $validate = Validator::make($request->all(), [
                'value' => 'required|string|min:8',
            ]);
            if ($validate->fails()) {
                return response()->json([ 422 => $validate->errors()->toJson() ]);
            }

            $employee->$position = Hash::make($request->value);
            $employee->email_verified_at = null;
            $employee->save();
        }
        else if($position == 'phone' || $position == 'religion' || $position ==  'sex'){
            $request->validate([
                'value' => 'required|string|max:10 ',
            ]);
            $employee->$position = $value;
            $employee->save();
        }
        else if($position == 'address'){
            $request->validate([
                'value' => 'required|string|max:255 ',
            ]);
            $employee->$position = $value;
            $employee->save();
        }
        else if($position == 'birthday'){
            $request->validate([
                'value' => 'required|date_format:Y-m-d',
            ]);
            $employee->$position = $value;
            $employee->save();
        }
        else{
            $request->validate([
                'value' => 'required|string|max:30',
            ]);
            $employee->$position = $value;
            $employee->save();
        }

        $result = [ 'id' => $employee->id_card,
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
                    'status' => "employee",
                ];

        return response()->json(['data' =>  $result]);
    }





    public function Employee_dashboard(Request $request , $id){
        $validator = Validator::make($request->all(), [
            'position' => 'required|string|max:255',
            'ids' => 'required|array',
        ]);
        $validator2 = Validator::make(['id' => $id],[
            'id' => 'required|exists:admins,id_card',
        ]);

        if ($validator->fails()) {
            return response()->json([ 422 => $validator->errors()->toJson() ]);
        }
        else if ($validator2->fails()) {
            return response()->json([ 422 => $validator2->errors()->toJson() ]);
        }
        foreach($request->ids as $id_employee){
            $user = Employee::findOrFail($id_employee);
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
            else if($position == 'phone' || $position == 'religion' || $position ==  'sex'){
                $request->validate([
                    'value' => 'required|string|max:10 ',
                ]);
                $user->$position = $value;
                $user->save();
            }
            else if($position == 'address'){
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
    }
}
