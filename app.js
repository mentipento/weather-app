/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/modules/api.js
// modules/api.js

const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const API_KEY = 'T74DFCSK6R9XDJA8TRFRLL2QH';
async function fetchWeatherData(location) {
  console.log(`${BASE_URL}${location}?key=${API_KEY}`);
  try {
    const response = await fetch(`${BASE_URL}${location}?key=${API_KEY}`, {
      mode: 'cors'
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
;// ./src/modules/helpers.js
// modules/helpers.js

function fahrenheitToCelsius(degree) {
  return (degree - 32) * 5 / 9;
}
function celsiusToFahrenheit(degree) {
  return degree * 9 / 5 + 32;
}
;// ./src/modules/weather.js
// modules/weather.js


let useCelsius = true;
function setTemperatureUnit(isCelsius) {
  useCelsius = isCelsius;
}
function processWeatherData(data) {
  return {
    address: data.resolvedAddress,
    temperature: useCelsius ? Math.round(fahrenheitToCelsius(data.currentConditions.temp)) : Math.round(data.currentConditions.temp),
    conditions: data.currentConditions.conditions,
    icon: data.currentConditions.icon
  };
}
;// ./src/modules/dom.js
// modules/dom.js

function updateWeatherUI(weatherData) {
  const locationElement = document.querySelector('.display-location');
  const temperatureElement = document.querySelector('.display-temperature');
  const iconElement = document.getElementById('placeholder');
  const conditionsElement = document.querySelector('.display-conditions');
  if (!weatherData) {
    locationElement.textContent = '⚠️ Location not found';
    temperatureElement.textContent = '';
    conditionsElement.textContent = '';
    iconElement.src = '';
    return;
  }
  locationElement.textContent = weatherData.address;
  temperatureElement.textContent = `${weatherData.temperature}`;
  iconElement.style.visibility = 'visible';
  iconElement.src = `./assets/images/WeatherIcons-main/SVG/2nd_Set_-_Color/${weatherData.icon}.svg`;
  conditionsElement.textContent = weatherData.conditions;
}
;// ./src/modules/geolocation.js
// modules/geolocation.js

function fetchGeoLocation() {
  return new Promise((resolve, reject) => {
    const options = {
      maximumAge: 0,
      enableHighAccuracy: false
    };
    const success = pos => {
      const {
        coords
      } = pos; // same as const coords = pos.coords
      console.log(coords);
      resolve(coords);
    };
    const error = err => {
      console.error("❌ Geolocation Error:", err);
      reject(err);
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  });
}
;// ./src/index.js
// index.js






async function updateWeatherForCurrentLocation() {
  const location = document.getElementById('input-location').value;
  if (!location) {
    console.error('No location entered.');
    return;
  }
  const rawData = await fetchWeatherData(location);
  if (!rawData) {
    console.error('Could not fetch weather data');
    updateWeatherUI(null);
    return;
  }
  const weatherData = processWeatherData(rawData);
  updateWeatherUI(weatherData);
}
document.getElementById('form-location').addEventListener('submit', async event => {
  event.preventDefault();
  updateWeatherForCurrentLocation();
});
document.getElementById('checkbox-celsius').addEventListener('change', event => {
  if (event.target.checked) {
    document.querySelector('.celsius-placeholder').textContent = 'F°';
    setTemperatureUnit(false);
  } else {
    document.querySelector('.celsius-placeholder').textContent = 'C°';
    setTemperatureUnit(true);
  }
  updateWeatherForCurrentLocation();
});
document.getElementById('locate-icon').addEventListener('click', async () => {
  try {
    const coords = await fetchGeoLocation();
    console.log(`🌍 Location: ${coords.latitude},${coords.longitude}`);
    const location = `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`;
    document.getElementById('input-location').value = location;
    const rawData = await fetchWeatherData(location);
    if (!rawData) {
      console.error("❌ Couldn't fetch weather data");
      updateWeatherUI(null);
      return;
    }
    const weatherData = processWeatherData(rawData);
    updateWeatherUI(weatherData);
  } catch (error) {
    console.error('⚠️ Geolocation could not be obtained');
  }
});
/******/ })()
;
//# sourceMappingURL=app.js.map