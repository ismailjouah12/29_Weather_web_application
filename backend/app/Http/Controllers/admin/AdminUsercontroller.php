<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUsercontroller extends Controller
{

    public function __construct()//constructor to apply admin middleware
    {
        $this->middleware('admin');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()//list all non-admin users
    {
        $user=User::all()->whereNotIn('is_admin',1);
        return response()->json(['message'=>'List of all users','users'=> $user]);
    }

    /**
     * Show the form for creating a new resource.
     */
  

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    public function eventUsers(string $id)//list events of a specific user  
    {
        $user = User::with('events')->findOrFail($id);
        $events = $user->events;
        return response()->json([
            'events' => $events
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)//delete a user
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
