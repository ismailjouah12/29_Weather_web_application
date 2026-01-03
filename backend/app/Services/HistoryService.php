<?php
 namespace App\Services;

use App\Models\CityHistory;
use Illuminate\Support\Facades\Log;

 class HistoryService{
    //stores the city name with the user_id inside the table cities_history with the model CityHistory 
    public function log(string $city, int $userId): bool
    {
        try {
            CityHistory::create([
                'user_id' => $userId,
                'city_name' => $city
            ]);
        } catch (\Throwable $e) {
            // log the error and return false so callers can act on it
            Log::error('Failed to log city history: ' . $e->getMessage());
            return false;
        }

        $count = CityHistory::where('user_id',$userId)->count();
        //if te history has more than 20 city names it deleltes the first search
        if ($count > 20) {
            $oldest = CityHistory::where('user_id', $userId)
                ->orderBy('created_at', 'asc') //finds the oldest one
                ->first(); //picks it
            if ($oldest) {
                $oldest->delete(); //deletes it
            }
        }

        return true;
    }   
 }