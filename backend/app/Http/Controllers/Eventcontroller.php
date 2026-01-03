<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\EventService;
use App\Services\WeatherService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class Eventcontroller extends Controller
{
    protected $weather;//weather service instance
    public function __construct(WeatherService $weather)
    {
        $this->weather = $weather ;//initialize weather service
        
    }

    public function index()//list all events with weather forecast
    {
      $events = Event::where('user_id', auth()->id())
                            ->orderBy('created_at', 'desc')
                            ->get();  
                   
       $eventsWithWeather = $events->map(function($event) {
        $eventDate = Carbon::parse($event->date);
        $today = Carbon::today();

        $daysAhead = $today->diffInDays($eventDate, false);
        $temperature = null;
        
        if ($daysAhead >= 0) {
            $forecast = $this->weather->getForecast($event->location, $daysAhead);
            // Extract max temperature from forecast response
            // WeatherAPI structure: forecast.forecastday[0].day.maxtemp_c
            if (isset($forecast['forecast']['forecastday'][0]['day']['maxtemp_c'])) {
                $temperature = $forecast['forecast']['forecastday'][0]['day']['maxtemp_c'];
                $icon = $forecast['forecast']['forecastday'][0]['day']['condition']['icon'];
            }
        }

         return [
                'id'          => $event->id,
                'title'       => $event->title,
                'description' => $event->description,
                'date'        => $event->date,
                'location'    => $event->location,
                'forecast_temperature' => $temperature,
                'forecast_icon' => $icon ?? null,
            ];

        });  
        
                return response()->json($eventsWithWeather);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)//create event
    {
         $request->validate([//validating the request
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
        ]);
        //using event service to create event
        $eventService = new EventService();
        
        $event = $eventService->Events(//create event
            $request->title,
            $request->description,
            $request->date,
            $request->location,
            auth()->id()
        );
        //check if event creation was successful
        if(!$event){
            return response()->json(['message' => 'Event limit reached (5) ‼'], 400);
        }
        else
         {return response()->json([
            'message' => 'Event created successfully ✔',
            'event' => $event
           ]);
         }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)//view specific event
    {
        $event = Event::where('user_id', auth()->id())->where('id', $id)->first();//find event

        if (!$event) {//check if event exists
            return response()->json(['message' => 'Event not found'], 404);
        }

        return response()->json($event);
    }

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
    public function update(Request $request, string $id)//update event
    {
        $request->validate([//validating the request
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'location' => 'sometimes|required|string|max:255',
        ]);

        $event = Event::where('user_id', auth()->id())->where('id', $id)->first();//find event

        if (!$event) {//check if event exists
            return response()->json(['message' => 'Event not found'], 404);
        }
        //update event details
        if ($request->has('title')) {
            $event->title = $request->title;
        }
        if ($request->has('description')) {
            $event->description = $request->description;
        }
        if ($request->has('date')) {
            $event->date = $request->date;
        }
        if ($request->has('location')) {
            $event->location = $request->location;
        }

        $event->save();//save updated event

        return response()->json([
            'message' => 'Event updated successfully ✔',
            'event' => $event
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)//delete event
    {
        $event = Event::where('user_id', auth()->id())->where('id', $id)->first();

        if (!$event) {//check if event exists
            return response()->json(['message' => 'Event not found'], 404);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully ✔']);//success message
    }


}
