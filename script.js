// WeatherAPI key
// https://api.weatherapi.com/v1/current.json?key=529138f777c24aeba3990818260703&q=Dhaka&aqi=no

const temperatureField  = document.querySelector('.temp-value');
const locationField     = document.querySelector('.location-name');
const dateandTimeField  = document.querySelector('.datetime');
const conditionField    = document.querySelector('.condition-text');
const searchField       = document.querySelector('.search_area');
const form              = document.getElementById('search-form');
const weatherIcon       = document.getElementById('weather-icon');
const feelsLikeVal      = document.getElementById('feels-like-val');
const humidityEl        = document.getElementById('humidity');
const windEl            = document.getElementById('wind');
const uvEl              = document.getElementById('uv');
const visibilityEl      = document.getElementById('visibility');
const errorMsg          = document.getElementById('error-msg');

// Map WeatherAPI condition codes → weather-icons classes
const conditionIconMap = {
  1000: 'wi-day-sunny',
  1003: 'wi-day-cloudy',
  1006: 'wi-cloudy',
  1009: 'wi-cloudy',
  1030: 'wi-day-fog',
  1063: 'wi-day-rain',
  1066: 'wi-day-snow',
  1069: 'wi-day-sleet',
  1072: 'wi-day-sleet',
  1087: 'wi-thunderstorm',
  1114: 'wi-snow-wind',
  1117: 'wi-snow-wind',
  1135: 'wi-fog',
  1147: 'wi-fog',
  1150: 'wi-day-sprinkle',
  1153: 'wi-sprinkle',
  1168: 'wi-sleet',
  1171: 'wi-sleet',
  1180: 'wi-day-rain',
  1183: 'wi-rain',
  1186: 'wi-day-rain',
  1189: 'wi-rain',
  1192: 'wi-rain',
  1195: 'wi-rain',
  1198: 'wi-sleet',
  1201: 'wi-sleet',
  1204: 'wi-sleet',
  1207: 'wi-sleet',
  1210: 'wi-day-snow',
  1213: 'wi-snow',
  1216: 'wi-snow',
  1219: 'wi-snow',
  1222: 'wi-snow',
  1225: 'wi-snow',
  1237: 'wi-hail',
  1240: 'wi-day-showers',
  1243: 'wi-showers',
  1246: 'wi-showers',
  1249: 'wi-sleet',
  1252: 'wi-sleet',
  1255: 'wi-day-snow',
  1258: 'wi-snow',
  1261: 'wi-hail',
  1264: 'wi-hail',
  1273: 'wi-day-thunderstorm',
  1276: 'wi-thunderstorm',
  1279: 'wi-day-snow-thunderstorm',
  1282: 'wi-snow-thunderstorm',
};

let target = 'Dhaka';

const fetchResults = async (targetLocation) => {
  errorMsg.textContent = '';
  const url = `https://api.weatherapi.com/v1/current.json?key=529138f777c24aeba3990818260703&q=${encodeURIComponent(targetLocation)}&aqi=no`;

  try {
    const res  = await fetch(url);
    const data = await res.json();

    if (data.error) {
      errorMsg.textContent = '⚠ Location not found. Please try again.';
      return;
    }

    const { name, localtime } = data.location;
    const { temp_c, feelslike_c, humidity, wind_kph, uv, vis_km, condition } = data.current;

    updateDetails(temp_c, feelslike_c, name, localtime, condition, humidity, wind_kph, uv, vis_km);
  } catch (err) {
    errorMsg.textContent = '⚠ Could not fetch weather data. Check your connection.';
  }
};

function updateDetails(temp, feelsLike, name, localtime, condition, humidity, wind_kph, uv, vis_km) {
  // Temperature
  temperatureField.textContent = Math.round(temp);
  feelsLikeVal.textContent     = Math.round(feelsLike);

  // Location
  locationField.textContent = name;

  // Date & time
  const dt = new Date(localtime);
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const hours   = dt.getHours().toString().padStart(2, '0');
  const minutes = dt.getMinutes().toString().padStart(2, '0');
  dateandTimeField.textContent = `${hours}:${minutes} — ${dayNames[dt.getDay()]}, ${monthNames[dt.getMonth()]} ${dt.getDate()} ${dt.getFullYear()}`;

  // Condition text
  conditionField.textContent = condition.text;

  // Weather icon
  const iconClass = conditionIconMap[condition.code] || 'wi-day-cloudy';
  weatherIcon.className = `wi ${iconClass} condition-icon`;

  // Stats
  humidityEl.textContent   = `${humidity}%`;
  windEl.textContent       = `${Math.round(wind_kph)} km/h`;
  uvEl.textContent         = uv;
  visibilityEl.textContent = `${vis_km} km`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = searchField.value.trim();
  if (val) {
    target = val;
    fetchResults(target);
  }
});

fetchResults(target);
