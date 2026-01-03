<?php

use App\Http\Controllers\SocialAuthcontroller;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

//routes for the google/facebook authentication
Route::get('/auth/{provider}', [SocialAuthcontroller::class ,'redirect']);
Route::get('/auth/{provider}/callback', [SocialAuthcontroller::class ,'callback']);
