<?php

use App\Http\Controllers\admin\AdminEventcontroller;
use App\Http\Controllers\admin\AdminUsercontroller;
use App\Http\Controllers\Authcontroller;
use App\Http\Controllers\CitiesHistorycontroller;
use App\Http\Controllers\Eventcontroller;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SavedCitiescontroller;
use App\Http\Controllers\SocialAuthcontroller;
use App\Http\Controllers\WeatherServicescontroller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


//public routes
//register & login 

Route::post('/login',[Authcontroller::class , 'login']);
Route::post('/register',[Authcontroller::class , 'register']);

//protected routes (authenticated only)
//logout and usertasks

Route::group(['middleware'=>['auth:sanctum']], function()

{

Route::post('logout',[Authcontroller::class , 'logout']);  
Route::get('/profile', [ProfileController::class, 'show']);
Route::put('/profile/password', [ProfileController::class, 'updatePassword']);  // added update password route
Route::put('/profile/email', [ProfileController::class, 'updateEmail']);// added update email route
Route::put('/profile/name', [ProfileController::class, 'updateName']);// added update name route
// show the history
Route::get('/search/history',[CitiesHistorycontroller::class , 'index']);
// delete only one city 
Route::delete('/search/history/{id}',[CitiesHistorycontroller::class , 'destroy']);
// clear all the history
Route::delete('/search/history/',[CitiesHistorycontroller::class , 'clear']);
// saved cities routes
Route::resource('/saved-cities',SavedCitiescontroller::class)->only([

    'index','store','destroy','show'

]);
Route::delete('/saved-cities',[SavedCitiescontroller::class , 'clear']);// clear all saved cities

Route::get('/weather/health-tip/{city}', [WeatherServicescontroller::class, 'healthTip']);// health tip route

Route::post('/user/events', [Eventcontroller::class, 'store']); // create event
Route::get('/user/events', [Eventcontroller::class, 'index']); // list events
Route::get('/user/events/{id}', [Eventcontroller::class, 'show']); // show event
Route::put('/user/events/{id}', [Eventcontroller::class, 'update']); // update event
Route::delete('/user/events/{id}', [Eventcontroller::class, 'destroy']);


});

//weather api routes 
Route::get('/weather/current/{city}',[WeatherServicescontroller::class ,'Current']); // for current weather status
Route::get('/weather/forecast/{city}/{days?}/{aqi?}',[WeatherServicescontroller::class ,'Forecast']); // for forecast weather status
Route::get('/cities/search', [WeatherServicesController::class, 'search']);// city search route



Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // User management
    Route::get('admin/users', [AdminUsercontroller::class, 'index']);          // list all users
    Route::get('admin/users/{id}/events', [AdminUsercontroller::class, 'eventUsers']); // list events of a user
    Route::delete('admin/users/{id}', [AdminUsercontroller::class, 'destroy']);    // delete a user
    
    // Event management
    Route::delete('admin/events/{id}', [AdminEventcontroller::class, 'destroy']);  // delete a specific event
});