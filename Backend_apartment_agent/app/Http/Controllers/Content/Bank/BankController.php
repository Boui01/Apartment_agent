<?php

namespace App\Http\Controllers\Content\Bank;

use App\Http\Controllers\Controller;
use App\Models\Base\Bank\Bank;
use App\Models\Base\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BankController extends Controller
{
    public function Bank_all(){

    }
    public function Bank_update(Request $request , $id){
        $request->validate([
            'position' => 'required|string|max:255'
        ]);

        $position = $request->position;
        $user = User::findOrFail($id);
        $bank = Bank::where('id_bank',$user->bank_id)->first();

        switch($position){
            case 'id_bank':
                $request->validate([
                    'value' => 'required|string|min:11|max:11|unique:banks,id_bank'
                ]);
                // set bank id User to null for change primary key
                $user->bank_id = null;
                $user->save();

                // set bank id Bank
                $bank->id_bank = $request->value;
                $bank->save();
                // set bank id User
                $user->bank_id = $request->value;
                $user->save();


                break;

            case 'type':
                $request->validate([
                    'value' => 'required|string|max:30'
                ]);
                $bank->type = $request->value;
                $bank->save();

                break;
                
            default:
                break;
        }

        return response()->json([ 'bank' => $bank ]);
    }
    public function Bank_dashboard(Request $request , $id){
        $validate = Validator::make(['id' => $id], [
            'id' => 'required|exists:admins,id_card'
        ]);
        $validate2 = Validator::make($request->all(),[
            'position' => 'required|string|max:255',
            'ids' => 'required|array',
        ]);

        if ($validate->fails()) {
            return response()->json([ 422 => $validate->errors()->toJson() ]);
        }
        else if ($validate2->fails()) {
            return response()->json([ 422 => $validate2->errors()->toJson() ]);
        }

        $position = $request->position;
        $ids = $request->ids;
        foreach($ids as $id_user){
            $user = User::findOrFail($id_user);
            $bank = Bank::where('id_bank',$user->bank_id)->first();

            switch($position){
                case 'id_bank':
                    $request->validate([
                        'value' => 'required|string|min:11|max:11|unique:banks,id_bank'
                    ]);
                    // set bank id User to null for change primary key
                    $user->bank_id = null;
                    $user->save();

                    // set bank id Bank
                    $bank->id_bank = $request->value;
                    $bank->save();
                    // set bank id User
                    $user->bank_id = $request->value;
                    $user->save();


                    break;

                case 'type':
                    $request->validate([
                        'value' => 'required|string|max:30'
                    ]);
                    $bank->type = $request->value;
                    $bank->save();

                    break;
                
                default:
                    break;  
            }
            
        }

        return response()->json([ 'bank' => $bank ]);

    }
}
