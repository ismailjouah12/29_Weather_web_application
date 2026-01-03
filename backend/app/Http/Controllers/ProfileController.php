<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class Profilecontroller extends Controller
{
    public function show()
    {
        $user = Auth::user();

        // Return only these feilds
            return response()->json([
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }


        public function updatePassword(Request $request)
    {
        $request->validate([//validating the request
            'new_password' => ['required', 'string', 'min:8'],
            'new_password_confirmation' => ['required', 'string', 'same:new_password'],
        ]);

        $user = Auth::user();


        // Update password
        $user->password = Hash::make($request->new_password);//hashing the new password
        $request->user()->save();//saving the new password

        

        return response()->json([
            'user'=>$user,
            'message' => 'Password updated successfully'
        ]);
  
    }


            public function updateEmail(Request $request)
    {
        $request->validate([//validating the request
            'new_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
        ]);

        $user = Auth::user();


        // Update mail
        $user->email = $request->new_email; // saving the new email
        $request->user()->save();//saving the new email

        return response()->json([
            'user'=>$user,
            'message' => 'Email updated successfully'
        ]);
  
    }
    
            public function updateName(Request $request)
    {
        $request->validate([//validating the request
            'new_name' => ['required', 'string', 'max:255'],
        ]);

        $user = Auth::user();


        // Update name
        $user->name = $request->new_name; // saving the new name
        $request->user()->save();//saving the new name

        return response()->json([
            'user'=>$user,
            'message' => 'Name updated successfully'
        ]);
  
    }

}