<?php

namespace App\Http\Controllers;

use App\Models\CityHistory;
use Illuminate\Http\Request;
use App\Services\WeatherService;
use App\Services\HistoryService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class WeatherServicescontroller extends Controller
{
    //instensiation de th object weather
    protected $weather;
    protected $history;
    protected $weatherservice;
    //construct the waether and history objects
    public function __construct(WeatherService $weather, HistoryService $history,)
    {
       $this->weather = $weather ;
       $this->history = $history ;

    }
    // the current function to call the current service
    public function Current($city){

        return response()->json([

            $this->weather->getCurrentWeather($city)
        ]);
    }   
    // the forecast function to call the forecast service   
    public function Forecast($city){

        return response()->json([

            $this->weather->getForeCast($city , 5, 'yes')
        ]);
    }
    
    public function search(Request $request)
    {
        // Accept either ?q= or ?query= for compatibility with clients
        $query = $request->query('q') ?? $request->query('query');

        if (empty($query)) {
            return response()->json([
                'message' => 'Query parameter is missing.',
                'results' => []
            ], 400); // Bad Request
        }
        
        
        // Use Sanctum guard explicitly so Bearer tokens are recognized even when
        // the route is public and not protected by 'auth:sanctum' middleware.
        $user = $request->user('sanctum') ?? Auth::guard('sanctum')->user();
        if ($user) {
            $this->history->log($query, $user->id);
        } else {
            // If a bearer token was provided but the guard didn't resolve a user,
            // log this for debugging to help trace token issues.
            if ($request->bearerToken()) {
                Log::debug('Search request had bearer token, but no user resolved.', [
                    'bearer' => substr($request->bearerToken(), 0, 10) . '...'
                ]);
            }
        }

        // Callin the new service method
        $results = $this->weather->searchCity($query);


        
        // Handle service error response
        if (isset($results['error']) && $results['error'] === true) {
             // Use the status if available, otherwise 500
             $status = $results['status'] ?? 500; 
             return response()->json($results, $status);
        }

        // Return the successful response (array of cities/locations)
        return response()->json([
            'message' => 'Search results for ' . $query,
            'results' => $results
        ]);
    }

    /**
 * Get health tip for a specific city
 */
public function healthTip($city)
{
    $weatherData = $this->weather->getCurrentWeather($city);
    
    if (isset($weatherData['error'])) {
        return response()->json([
            'message' => 'Unable to fetch weather data',
            'error' => true
        ], 400);
    }
    
    $temp = $weatherData['current']['temp_c'];
    $condition = $weatherData['current']['condition']['text'];
    
    $healthTip = $this->weather->getHealthTip($temp, $condition);
    
    return response()->json([
        'city' => $city,
        'temperature' => $temp,
        'condition' => $condition,
        'health_tip' => $healthTip,
        'icon' => $weatherData['current']['condition']['icon']
    ]);
}
}
