<?php

namespace App\Http\Controllers\Content\Comment;

use App\Models\Content\Comment\Comment;
use App\Models\Content\Comment\Remember_like_unlike;
use Illuminate\Routing\Controller; // Import the Controller class
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function Comment_all () {
        $comments = Comment::all();
        return response()->json(['data' => $comments]);
    }
    public function Comment_find (Request $request, $id) {

        $comments = Comment::where('apartment_id', $request['apartmentId'])->with('users')->get();
        if($id != 0){
            $Get = Remember_like_unlike::where('card_id',$id)->with('comment')->get();
            $remembers = [];
            foreach($Get as $remember){
                if($remember){
                    if($remember->comment->apartment_id == $request['apartmentId'] ) { 
                        $remembers[] = $remember ;
                    }
                }
            }
            return response()->json(['data' => $comments , 'remember' => $remembers]);
        }
        return response()->json(['data' => $comments , 'remember' => '']);
    }
    public function Comment_create (Request $request,$id){
        $comment = new Comment;
        $comment->description = $request->input('description');
        $comment->card_id = $request->input('card_id');
        $comment->apartment_id = $id;
        $comment->comment_like = 0;
        $comment->comment_unlike = 0;
        $comment->updated_at = null;
        $comment->save();



        return response()->json(['data' => 'Comment created successfully' ]);
    }

    public function Comment_update (Request $request , $id){
        $request->validate([
            '*.id_comment' => 'request|integer|exists:comments,id_comment',
            '*.update' => 'request|integer',
            '*.position' => 'request|string|max:255'
        ]);

        $check = Remember_like_unlike::where('card_id',$id)->get();

        foreach($check as $c){
            if($c){
                if($c->comment_id == $request['id_comment']){

                        // remmember
                        if($request['position'] == 'comment_like'){
                            $previous_like = $c->like;
                            $status = $c->unlike == 0 ? 'update' : 'delete';                           
                            $c->like = $previous_like == 1 ? 0 : 1 ;
                            $c->unlike = 0;
                            $c->save();

                             // update
                            $comment_find = Comment::find( $request['id_comment'] );
                            $current_like = $comment_find->comment_like;
                            $current_unlike = $comment_find->comment_unlike;
                            $comment_find->update( [
                                'comment_like' => $c->like == 0 && $c->unlike == 0 ? $current_like-1 : $current_like+1 ,
                                'comment_unlike' =>  $c->like == 0 && $c->unlike == 0 ? $current_unlike : ($status == 'update' ? $current_unlike : $current_unlike-1)                    
                            ]);
                            return response()->json([ 'data' => $comment_find, 'remember' => $c , 'status' => $status]);
                        }
                        elseif($request['position'] == 'comment_unlike'){
                            $previous_unlike = $c->unlike;
                            $status = $c->like == 0 ? 'update' : 'delete';
                            $c->like = 0;
                            $c->unlike =  $previous_unlike == 1 ? 0 : 1 ;
                            $c->save();

                            // update
                            $comment_find = Comment::find( $request['id_comment'] );
                            $current_like = $comment_find->comment_like;
                            $current_unlike = $comment_find->comment_unlike;
                            $comment_find->update( [
                                'comment_like' => $c->like == 0 && $c->unlike == 0 ? $current_like : ($status == 'update' ? $current_like : $current_like-1 ),
                                'comment_unlike' => $c->like == 0 && $c->unlike == 0  ? $current_unlike-1 : $current_unlike+1                 
                            ]);

                            return response()->json([ 'data' => $comment_find, 'remember' => $c , 'status' => $status]);
                        }
                    

                }
            }
        }
        // remmember
        $remember = new Remember_like_unlike;
        $remember->comment_id = $request['id_comment'];
        $remember->card_id = $id;
        if($request['position'] == 'comment_like'){
            $remember->like = 1;
            $remember->unlike = 0;
            $remember->created_at = now();
            $remember->updated_at = now();	
            $remember->save();
        }
        elseif($request['position'] == 'comment_unlike'){
            $remember->like = 0;
            $remember->unlike = 1;
            $remember->created_at = now();
            $remember->updated_at = now();	
            $remember->save();
        }
        // update like comment
        $comment_find = Comment::find( $request['id_comment'] );
        $comment_find->update( [
            $request['position'] => $request['update']
        ]);

        return response()->json([ 'data' => $check, 'remember' => $remember ]);
    }

    function Comment_delete ($id){
        $comment = Comment::find($id);
        Remember_like_unlike::where('comment_id' , $id)->delete();
        $comment->delete();
        return response()->json(['data' => 'Comment deleted successfully' ]);
    }

    function Comment_edite (Request $request , $id){
        $validator = Validator::make([ 'id_comment' => $id,'data' => $request->all()], [
            'id_comment' => 'required|integer|exists:comments,id_comment',
            'data.description' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([422 => $validator->messages()], );
        }


        $comment = Comment::find($id);
        $comment->update($request->all());
        return response()->json(['data' => $comment ]);
    }
}
