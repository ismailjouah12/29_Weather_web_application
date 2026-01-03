<?php
namespace App\Services;
use App\Models\Event;

class EventService {

    public function Events($title, $description, $date, $location, $userId){
       
        $count = Event::where('user_id', $userId)->count();//count user's events
       
        if($count >= 5){//limit to 5 events only
            return response()->json(['message' => 'Event limit reached (5) ‼']);
        }

       return Event::create([//create a new event
            'title' => $title,
            'description' => $description,
            'date' => $date,
            'location' => $location,
            'user_id' => $userId
        ]);
    }
     
}