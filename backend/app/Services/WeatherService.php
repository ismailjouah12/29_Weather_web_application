<?php 

namespace App\Services ;

use Illuminate\Support\Facades\Http;

class WeatherService{
   
    // two variabls to get the api key and url 
    protected $key;
    protected $url;


    public function __construct()
    {
        $this -> key = env("WEATHER_API_KEY"); //load api base key 
        $this -> url =env("WEATHER_API_URL"); // load api base url   
    }
    
    // returns the current waether satatus of the city provided
        public function getCurrentWeather($city){
        
        $response = Http::get($this -> url . '/current.json', [

            'key'=> $this->key,
            'q'=>$city
        
        ]);

        //error case (wrong city ...)
        if($response -> failed()){
            return [
                'message'=> 'Request failed ❌',
                'error'=>true
            ];
        }

        return $response->json(); //returns response 
    }

    //returns forecast 3 days max , hours ... 
    public function getForeCast($city , $days=5 , $aqi = null){

        
        //return the response whuch is the url with key,queryas a city or...,days
         $response = Http::get($this -> url .'/forecast.json',[
            'key'=> $this->key,
            'q'=> $city,
            'days'=> $days,
            'aqi' => $aqi ?? 'no',

        ]);

        if($response -> failed()){
            return [
                'message'=> 'Request failed ❌',
                'error'=>true
            ];
        }
        
       return $response->json();

    }

    /**
     * Search cities/locations using the weather API search endpoint.
     * Returns the raw JSON array from the provider on success or an error array on failure.
     *
     * @param  string  $query
     * @return array
     */
    public function searchCity(string $query ): array
    {
        $response = Http::get($this->url . '/search.json', [
            'key' => $this->key,
            'q' => $query,

        ]);

        if ($response->failed()) {
            return [
                'message' => 'City search failed ❌',
                'error' => true,
                'status' => $response->status()
            ];
        }

        return $response->json();
    }






 //Generate health tip based on temperature and weather condition
 
public function getHealthTip($temperature, $condition)
{
    $condition = strtolower($condition);
    
    // Condition-specific tips (priority)
    if (str_contains($condition, 'rain') || str_contains($condition, 'drizzle')) {
        return " Rainy weather: Carry an umbrella and wear waterproof clothing.";
    }
    
    if (str_contains($condition, 'snow') || str_contains($condition, 'blizzard')) {
        return " Snowy conditions: Watch for slippery surfaces, dress in warm layers.";
    }
    
    if (str_contains($condition, 'thunder') || str_contains($condition, 'storm')) {
        return " Thunderstorm alert: Stay indoors and avoid open areas.";
    }
    
    if (str_contains($condition, 'fog') || str_contains($condition, 'mist')) {
        return " Foggy conditions: Drive slowly with headlights on.";
    }
    
    // Temperature-based tips
    if ($temperature < 0) {
        return " Extreme cold! Wear multiple layers, cover exposed skin, limit outdoor time.";
    } elseif ($temperature < 10) {
        return " Cold weather: Dress warmly with coat, hat, and gloves.";
    } elseif ($temperature < 15) {
        return " Chilly weather: Light jacket recommended.";
    } elseif ($temperature < 25) {
        return " Pleasant weather: Perfect for outdoor activities!";
    } elseif ($temperature < 30) {
        return "Warm weather: Stay hydrated and wear light clothing.";
    } elseif ($temperature < 35) {
        return " Hot! Drink plenty of water, avoid direct sun, use sunscreen.";
    } else {
        return " Extreme heat! Stay indoors if possible, stay hydrated.";
    }
}


}