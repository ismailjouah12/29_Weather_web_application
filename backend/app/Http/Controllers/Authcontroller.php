<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequests;
use App\Models\User;
use App\Traits\HttpRespones;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Services\ResetPasswordService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

// Using service via container: app(ResetPasswordService::class)

class Authcontroller extends Controller
{
    use HttpRespones;

    //LOGIN FUNCTION

    public function login(LoginUserRequest $request)
    {
        //VERIFYING CREDENTIALS SHAPE
       $credentials = $request->validated();
       //VERIFYING MATCHED CREDENTIALS INSIDE THE DB
      if(!Auth::attempt($credentials)){
        return response()->json([
            'message'=>'wrong email or password'
        ], 401);
        }
        //LOOK IN User FOR AN email THAT MATCHES THE EMAIL IN CREDENTIALS AND AFFECT IT TO $user OBJECT
        $user = User::where('email', $credentials['email'])->firstOrFail();

        $redirectUrl = $user->is_admin ? '/admin' : '/home';


        //RETURN THE $user OBJECT WITH A TOKEN
        return $this->success([
            'messege'=>'Login successful',
            'user'=> $user,
            'redirect'=> $redirectUrl,
            'token'=> $user->createToken('Api token of '. $user->name)->plainTextToken
        ]);
    }

        //for registration 

    public function register(StoreUserRequests $request)
    {
         //VERIFYING CREDENTIALS SHAPE
        $data=$request-> validated();
        //CREATES A user INSIDE THE TABLE User
        $user = User::create([
            'name'=> $data['name'] ,
            'email'=>$data['email'],
            'password'=> Hash::make($data['password'])
        ]);

        //RETURN THE User WITH A TOKEN
        return $this->success([
            'user' => $user,
            'token' => $user->createToken('API Token of' . $user->name )->plainTextToken
        ]);
    }





    public function logout(Request $request)
    {
    // Ensure the request is authenticated via Sanctum
    $request->user()->currentAccessToken()->delete();

    return $this->success([
        'message' => 'You have been logged out successfully'
    ]);
}

}
