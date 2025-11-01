import React, { useEffect, useState } from "react";
import axios from "axios";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
       const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        setWeather(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch weather data");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => setError("Location access denied")
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  if (error) return <p>{error}</p>;
  if (!weather) return <p>Loading weather...</p>;

  return (
    <div>
      <h3 className="text-lg font-bold">{weather.name}</h3>
      <p>{weather.weather[0].description}</p>
      <p>{weather.main.temp}°C</p>
      <p>Humidity: {weather.main.humidity}%</p>
    </div>
  );
}

export default Weather;
