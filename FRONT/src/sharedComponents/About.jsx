export default function About() {
  return (
    <div className="container bg-white p-4 rounded shadow">
      <h2>About WeatherApp</h2>
      <p>
        WeatherApp is a simple and intuitive application that provides users with accurate and up-to-date weather information for locations around the world. Whether you're planning your day or preparing for a trip, WeatherApp has you covered.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Current weather conditions including temperature, humidity, and wind speed.</li>
        <li>7-day weather forecasts to help you plan ahead.</li>
        <li>Search functionality to find weather information for any city.</li>
        <li>User profiles to save favorite locations and view search history.</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>
        WeatherApp is built using modern web technologies including React for the frontend, Bootstrap for styling, and Axios for API requests. The application fetches data from reliable weather APIs to ensure accuracy.
      </p>
      <h3>Contact</h3>
      <p>
        For any questions or feedback, please contact us at <a>exmple@gmail.com</a> <p> We hope you enjoy using WeatherApp!</p> </p>
    </div>
  );
}