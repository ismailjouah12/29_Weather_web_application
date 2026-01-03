<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthcontroller extends Controller
{
    //this function redirects the user towards google signing page
  public function redirect($provider)
  {
    return Socialite::driver($provider)->redirect();
  }

    //this function redirects the user towards the home page
  public function callback($provider)
  {

    $socialUser = Socialite::driver($provider)->stateless()->user(); //prepares the google authentiaction process stateless
    //search for user if not found it will create it, firstOrCreate only takes 2 arrays one to use in search the second what to create if not found
    $user = User::firstOrCreate(
        ['email' => $socialUser->getEmail()],
        [
        'google_id'=>$socialUser ->getId(),
        'name' => $socialUser->getName() 
        ]

    );
    //creates tokent and sends it with response()->json([])
    $token = $user->createtoken('social auth token')->plainTextToken;
// Encode user data for URL
        $userData = urlencode(json_encode($user->toArray()));
        
        // Redirect back to frontend with token and user data
        $frontendURL = 'http://localhost:5173'; // Change to your frontend URL in production
        return redirect("{$frontendURL}/login?token={$token}&user={$userData}");
  }
 //routing made inside web.php
}
