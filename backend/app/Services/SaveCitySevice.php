<?php

namespace App\Services ;

use App\Models\SavedCity;

class SaveCitySevice{

    public function save($city_name,$userId){ 
        
        //counts the cities saved by the user
         $count = SavedCity::where('user_id',$userId) -> count();

         

         if($count >= 5){//limit to 4 cities only
            return response()->json(['message'=>'Exceeded the limit (5) ‼']);
         }
         
        $city = SavedCity::create([//create a new saved city
            'city_name' => $city_name,
            'user_id' => $userId
        ]);
        //return success message
        return response()->json(['message' => 'City saved successfully ✔', 'city' => $city]);

    }

}