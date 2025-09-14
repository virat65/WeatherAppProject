import React, { useEffect, useRef, useState } from "react";
import seach_icon from "./assets/search.png";
import wind from "./assets/wind.png";
import weather from "./assets/weather.png";
import "./Weather.css";

const Weather = () => {
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState("");
  const [weatherdata, setWeatherdata] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const allIcons = {
    "01d": "https://openweathermap.org/img/wn/01d@2x.png",
    "01n": "https://openweathermap.org/img/wn/01n@2x.png",
    "02d": "https://openweathermap.org/img/wn/02d@2x.png",
    "02n": "https://openweathermap.org/img/wn/02n@2x.png",
    "03d": "https://openweathermap.org/img/wn/03d@2x.png",
    "03n": "https://openweathermap.org/img/wn/03n@2x.png",
    "04d": "https://openweathermap.org/img/wn/04d@2x.png",
    "04n": "https://openweathermap.org/img/wn/04n@2x.png",
    "09d": "https://openweathermap.org/img/wn/09d@2x.png",
    "09n": "https://openweathermap.org/img/wn/09n@2x.png",
    "10d": "https://openweathermap.org/img/wn/10d@2x.png",
    "10n": "https://openweathermap.org/img/wn/10n@2x.png",
    "11d": "https://openweathermap.org/img/wn/11d@2x.png",
    "11n": "https://openweathermap.org/img/wn/11n@2x.png",
    "13d": "https://openweathermap.org/img/wn/13d@2x.png",
    "13n": "https://openweathermap.org/img/wn/13n@2x.png",
    "50d": "https://openweathermap.org/img/wn/50d@2x.png",
    "50n": "https://openweathermap.org/img/wn/50n@2x.png",
  };

  // Function to search weather by city
  const search = async (city) => {
    if (!city || !city.trim()) return;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        alert(data.message || "City not found");
        return;
      }

      const w_icon = allIcons[data.weather[0].icon];
      setWeatherdata({
        humidity: data.main.humidity,
        windSpeed: (data.wind.speed * 3.6).toFixed(1),
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: w_icon,
      });
      setSuggestions([]);
    } catch (error) {
      console.log(error, "Error in search");
    }
  };

  // Function to fetch city suggestions
  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${import.meta.env.VITE_APP_ID}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    fetchSuggestions(value);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(inputValue);
    }
  };

  // Load default city on mount
  useEffect(() => {
    search("London");
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city"
          value={inputValue}
          ref={inputRef}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <img
          src={seach_icon}
          alt="search"
          onClick={() => search(inputValue)}
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((city, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  search(city.name);
                  setInputValue(city.name);
                  setSuggestions([]);
                }}
              >
                {city.name}, {city.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {weatherdata && (
        <>
          <img
            src={weatherdata.icon}
            alt=""
            className="img-fit weather-icon"
          />
          <p className="temperature">{weatherdata.temperature}°c</p>
          <p className="location">{weatherdata.location}</p>
          <div className="data">
            <div className="weather-data">
              <div className="col">
                <img src={weather} alt="" className="img-fit" />
                <div>
                  <p>{weatherdata.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>
            </div>
            <div className="weather-data">
              <div className="col">
                <img src={wind} alt="" className="img-fit" />
                <div>
                  <p>{weatherdata.windSpeed} Km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
