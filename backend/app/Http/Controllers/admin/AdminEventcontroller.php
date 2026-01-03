<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class AdminEventcontroller extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');//apply admin middleware
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $event = Event::findOrFail($id);//delete an event
        $evnt = $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }
}
