<?php

use App\Http\Controllers\Base\Employee\EmployeeController;
use App\Http\Controllers\Base\Verify\VerifyController;
use App\Http\Controllers\Base\Login\LoginController;
use App\Http\Controllers\Base\Register\RegisterController;
use App\Http\Controllers\Base\User\UserController;
use App\Http\Controllers\Base\Verify\CheckStatusUser;
use App\Http\Controllers\Content\Apartment\ApartmentController;
use App\Http\Controllers\Content\Api\ApiController;
use App\Http\Controllers\Content\Bank\BankController;
use App\Http\Controllers\Content\Comment\CommentController;
use App\Http\Controllers\Content\Favorite\FavoriteController;
use App\Http\Controllers\Content\Image\ImageController;
use App\Http\Controllers\Content\Payment\PaymentController;
use App\Http\Controllers\Content\Reservation\ReservationController;
use App\Http\Controllers\Content\Service\ServiceController;
use App\Http\Controllers\Dashboard\HomeController;
use App\Http\Controllers\Dashboard\ReportController;
use App\Http\Controllers\Dashboard\TrashController;
use App\Models\Base\Employee\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


/// Login-Register ///
Route::post('/login', [LoginController::class, 'Login']);
Route::post('/register',[RegisterController::class, 'Register']);
Route::post('/register/employee/{id}',[RegisterController::class, 'Register_employee']);
Route::post('/register/admin/{id}',[RegisterController::class, 'Register_admin']);

/// Varify ///
Route::post('/token',[VerifyController::class,'Token_create']);
Route::get('/token/{token}',[VerifyController::class,'Token_find']);
Route::get('/tokens/delete',[VerifyController::class,'Token_delete']);
Route::put('/emailVerify/{email}',[VerifyController::class,'Email_verify']);
Route::put('/forgotPassword/{email}',[VerifyController::class,'New_password']);

/// Image ///
Route::post('/image/show', [ImageController::class, 'Image_show']);

/// Apartment ///
Route::get('/data', [ApartmentController::class, 'All']);
Route::get('/data/search/{value}', [ApartmentController::class, 'Search']);
Route::get('/data/{value}', [ApiController::class,'Find']);
Route::get('/data/room/{id}', [ApartmentController::class,'Apartment_room']);
Route::get('/data/owner/{id}', [ApartmentController::class,'Apartment_owner']);
Route::get('/data/other/{id}', [ApartmentController::class,'Apartment_other']);

/// Service ///
Route::get('/services', [ServiceController::class, 'Service_all']);
Route::get('/service/{id}', [ServiceController::class, 'Service_find']);
Route::get('/service/search/{id}', [ServiceController::class, 'Service_apartment_service_search']);
Route::get('/service/apartment/{id}', [ServiceController::class, 'Service_apartment_search']);

/// Comment ///
Route::get('/comment', [CommentController::class, 'Comment_all']);
Route::post('/comment/find/{id}',[CommentController::class,'Comment_find']);



// Minddleware User
Route::middleware(['auth:sanctum'])->group(function () {

    /// User ///
    Route::get('/user/{id}', [UserController::class, 'User']);
    Route::put('/user/{id}', [UserController::class, 'User_update']);
    Route::delete('/user/{id}', [UserController::class, 'User_delete']);

    Route::post('/user/dashboard/payments/{id}',[UserController::class,'User_payments']);
    Route::post('/user/dashboard/reservations/{id}',[UserController::class,'User_reservations']);
    Route::post('/user/dashboard/apartments/{id}',[UserController::class,'User_apartments']); 
    
    /// Image ///
    Route::post('/image/upload/{id}', [ImageController::class, 'Image_upload']);
    Route::delete('/image/delete/{id}', [ImageController::class, 'Image_delete']);

    
    /// Favorite ///
    Route::get('/favorites',[FavoriteController::class, 'favorite_all']);
    Route::post('/favorite/{id}',[FavoriteController::class, 'Favorite_create']);
    Route::post('/favorite/find/{id}',[FavoriteController::class, 'Favorite_find']);
    Route::put('/favorite/{id}', [FavoriteController::class, 'Favorite_update']);
    Route::delete('/favorite/{id}', [FavoriteController::class, 'Favorite_delete']);
    Route::delete('/favorite/apartment/{id}', [FavoriteController::class, 'Favorite_checkbox_delete']);

    /// Apartment ///
    Route::post('/data/like/{id}',[ApartmentController::class,'Like']);
    Route::post('/data/like/find/{id}',[ApartmentController::class,'Check_like']);

    Route::post('/data',[ApiController::class, 'Create']);
    Route::delete('/data/{id}', [ApiController::class, 'Delete']);
    Route::put('/data/{id}',[ApiController::class,'Edite']);

    /// bank ///
    Route::get('/bank', [BankController::class, 'Bank_all']);
    Route::get('/bank/{id}', [BankController::class, 'Bank_find']);
    Route::post('/bank/{id}', [BankController::class, 'Bank_create']);
    Route::delete('/bank/{id}', [BankController::class, 'Bank_delete']);
    Route::put('/bank/{id}', [BankController::class, 'Bank_update']);

    /// Comment ///
    Route::post('/comment/{id}',[CommentController::class, 'Comment_create']);
    Route::put('/comment/{id}', [CommentController::class , 'Comment_update']);
    Route::put('/comment/edite/{id}', [CommentController::class, 'Comment_Edite']);
    Route::delete('/comment/{id}', [CommentController::class, 'Comment_delete']);

    /// Problems ///
    Route::get('/problems',[HomeController::class, 'Problem_all']);
    Route::post('/problem/{id}', [HomeController::class, 'Problem_create']);
    Route::post('/problem/find/{value}', [HomeController::class, 'Problem_find']);

    /// Reservation ///
    Route::post('reservation/{id}',[ReservationController::class, 'Reservation_create']);

    /// Payment ///
    Route::put('/payment/user/{id}', [PaymentController::class, 'Payment_update']);
    Route::get('/payment/{id}', [PaymentController::class, 'Payment_find']);
  

    // Minddleware Admin
    Route::middleware(['auth:sanctum', 'check.status'])->group(function () {
        /// Service ///
        Route::post('/service', [ServiceController::class, 'Service_create']);

        /// Dashboard ///
        Route::get('/apartment/trash',[TrashController::class, 'Trash']);
        Route::get('/apartment/dashboard',[HomeController::class, 'Apartment_all']);
        Route::get('/reservation/dashboard',[HomeController::class, 'Reservation_all']);
        Route::get('/payments',[HomeController::class, 'Payment_all']);
        Route::get('/problems/dashboard',[HomeController::class, 'Problem_dashboard_all']);
        Route::get('/users/dashboard',[UserController::class, 'User_all']);
        Route::get('/employees/dashboard',[EmployeeController::class, 'Employee_all']);

        Route::post('/report/{id}',[ReportController::class, 'Report_get']);
        Route::post('/payment/{id}',[HomeController::class, 'Payment_create']);



        Route::delete('/apartment/{id}', [HomeController::class, 'Apartment_Delete']);
        Route::delete('/destroy/apartment', [TrashController::class, 'Apartment_Destroy']);
        Route::delete('/reservation', [HomeController::class, 'Reservation_destroy']);
        Route::delete('/payment/{id}', [HomeController::class, 'Payment_destroy']);
        Route::delete('/problem/{id}', [HomeController::class, 'Problem_destroy']);
        Route::put('/apartment/restore', [TrashController::class, 'Apartment_Restore']);
        Route::put('/apartment/edite/{id}', [HomeController::class, 'Apartment_Edite']);
        Route::put('/reservation/{id}', [HomeController::class, 'Reservation_update']);
        Route::put('/payment/{id}', [HomeController::class, 'Payment_update']);
        Route::put('/problem/{id}', [HomeController::class, 'Problem_update']);

        Route::put('/users/dashboard/{id}',[UserController::class, 'User_dashboard']);
        Route::put('/employees/dashboard/{id}',[EmployeeController::class, 'Employee_update']);
        Route::put('/employees/dashboard/{id}',[EmployeeController::class, 'Employee_dashboard']);
        Route::put('/banks/dashboard/{id}',[BankController::class, 'Bank_dashboard']);

    });



});











