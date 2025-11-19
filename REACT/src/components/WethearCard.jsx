import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import React from "react";
export default function WeatherCard({city, temperature, condition}) {
    return (
        <div className="container">
  <div className="row">
    <div className="col-12 col-md-6 col-lg-4">
      <Card>Weather Card 1</Card>
    </div>
    <div className="col-12 col-md-6 col-lg-4">
      <Card>Weather Card 2</Card>
    </div>
    <div className="col-12 col-md-6 col-lg-4">
      <Card>Weather Card 3</Card>
    </div>
  </div>
</div>

    )
}