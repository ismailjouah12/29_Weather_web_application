<?php

namespace App\Http\Controllers;

use App\Models\CityHistory;
use Illuminate\Http\Request;
use Nette\Utils\Json;

class CitiesHistorycontroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $history = CityHistory::where('user_id',auth()->id())->orderBy('created_at','desc')->get();// displays the search history only for logged users

        return response()->json($history);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        CityHistory::where('user_id',auth()->id())->where('city_name',$id)->delete();//deletes one city using the name only authenticanted logged users

        return response()->json(['message' => 'deleted']);

    }

    public function clear()
    {
     
        CityHistory::where('user_id', auth()->id())->delete();// cleares the whole history only logged users
    
        return response()->json(['message' => 'History cleared']);
    }

}
