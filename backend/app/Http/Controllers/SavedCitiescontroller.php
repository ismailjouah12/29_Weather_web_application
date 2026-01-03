<?php

namespace App\Http\Controllers;

use App\Models\SavedCity;
use Illuminate\Http\Request;
use App\Services\SaveCitySevice;
use App\Services\WeatherService;

class SavedCitiesController extends Controller
{
    protected $weather;
     public function __construct( WeatherService $weather){
       $this->weather = $weather;
     }
    /**
     * Display a listing of the resource.
     */
public function index()
{
    $saved = SavedCity::where('user_id', auth()->id())
                      ->orderBy('created_at', 'desc')
                      ->get();
    
    
    return response()->json($saved);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request ->validate([//validation
            'saved_city' => 'required|string|max:255'
        ]);
        $service = new SaveCitySevice();//instensiate the service
        return $service->save($request->saved_city,auth()->id());//calling the save method from the SaveCityservice
    }
 

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {//deleting a specific city by its name
      $city= SavedCity::where('user_id',auth()->id())->where('city_name',$id)->first();//search for the city only athenticated user
        if(!$city){
            return response()->json(['message' => 'City not found'],404);//if not found
        }
      $city->delete();//deleting the city
        return response()->json(['message' => 'City deleted successfully ✔']);
    }


    public function clear()
    {
        SavedCity::where('user_id', auth()->id())->delete();
        return response()->json(['message' => 'All saved cities deleted successfully ✔']);
    }


    /**
 * Display weather details for a specific saved city
 */
public function show($id)
{
    // Find the saved city for the authenticated user
    $city = SavedCity::where('user_id', auth()->id())
                     ->where('city_name', $id)
                     ->firstOrFail();
    
    // Fetch weather data for this city
    $weatherData = $this->weather->getCurrentWeather($city->city_name);
    
    if (isset($weatherData['error'])) {
        return response()->json([
            'message' => 'Unable to fetch weather data',
            'city' => $city,
            'weather' => null
        ], 400);
    }
    
    // Prepare response with weather details
    $response = [
        'city' => $city,
        'weather' => [
            'temperature' => $weatherData['current']['temp_c'],
            'feels_like' => $weatherData['current']['feelslike_c'],
            'condition' => $weatherData['current']['condition']['text'],
            'icon' => $weatherData['current']['condition']['icon'],
            'humidity' => $weatherData['current']['humidity'],
            'wind_kph' => $weatherData['current']['wind_kph'],
            'wind_dir' => $weatherData['current']['wind_dir'],
            'pressure_mb' => $weatherData['current']['pressure_mb'],
            'uv' => $weatherData['current']['uv']
        ],
        'location' => [
            'name' => $weatherData['location']['name'],
            'region' => $weatherData['location']['region'],
            'country' => $weatherData['location']['country'],
            'localtime' => $weatherData['location']['localtime']
        ],
        'health_tip' => $this->weather->getHealthTip(
            $weatherData['current']['temp_c'],
            $weatherData['current']['condition']['text']
        )
    ];
    
    return response()->json($response);
}
}
