// =============================================
// STEP 1: Get all the HTML elements we need
//         querySelector finds an element by its id or class
// =============================================

const cityEl       = document.getElementById('city');        // city name
const dateEl       = document.getElementById('date');        // date and time
const tempEl       = document.getElementById('temp');        // temperature number
const conditionEl  = document.getElementById('condition');   // e.g. "Sunny"
const iconEl       = document.getElementById('weather-icon');// the weather icon
const humidityEl   = document.getElementById('humidity');    // humidity %
const windEl       = document.getElementById('wind');        // wind speed
const visibilityEl = document.getElementById('visibility');  // visibility km
const errorEl      = document.getElementById('error');       // error message
const searchInput  = document.getElementById('search-input');// text input
const searchForm   = document.getElementById('search-form'); // the form


// =============================================
// STEP 2: Map weather condition codes to icons
//         WeatherAPI gives a number (code) for each condition.
//         We match that number to an icon class from weather-icons library.
// =============================================

function getWeatherIcon(code) {
  if (code === 1000) return 'wi-day-sunny';
  if (code === 1003) return 'wi-day-cloudy';
  if (code === 1006 || code === 1009) return 'wi-cloudy';
  if (code === 1030 || code === 1135 || code === 1147) return 'wi-fog';
  if (code === 1087 || code === 1273 || code === 1276) return 'wi-thunderstorm';
  if (code >= 1180 && code <= 1201) return 'wi-rain';
  if (code >= 1210 && code <= 1225) return 'wi-snow';
  if (code >= 1240 && code <= 1246) return 'wi-showers';
  return 'wi-day-cloudy'; // default if no match
}


// =============================================
// STEP 3: Fetch weather data from the API
//         async/await lets us wait for the data to arrive
// =============================================

async function getWeather(city) {
  // Clear any old error message
  errorEl.textContent = '';

  // Build the API URL with our city and API key
  const apiKey = '529138f777c24aeba3990818260703';
  const url = 'https://api.weatherapi.com/v1/current.json?key=' + apiKey + '&q=' + city + '&aqi=no';

  // Fetch data from the API
  const response = await fetch(url);
  const data = await response.json();

  // If city was not found, show an error and stop
  if (data.error) {
    errorEl.textContent = '⚠ City not found. Please try another name.';
    return;
  }

  // =============================================
  // STEP 4: Pull out the values we need from the data
  // =============================================

  const cityName   = data.location.name;
  const localtime  = data.location.localtime;   // e.g. "2026-02-06 12:58"
  const temp       = Math.round(data.current.temp_c);   // round to whole number
  const condition  = data.current.condition.text;
  const iconCode   = data.current.condition.code;
  const humidity   = data.current.humidity;
  const wind       = Math.round(data.current.wind_kph);
  const visibility = data.current.vis_km;


  // =============================================
  // STEP 5: Format the date nicely
  // =============================================

  const dateObject = new Date(localtime);

  const days   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName   = days[dateObject.getDay()];
  const monthName = months[dateObject.getMonth()];
  const dayNum    = dateObject.getDate();
  const year      = dateObject.getFullYear();

  const niceDate = dayName + ', ' + monthName + ' ' + dayNum + ' ' + year;


  // =============================================
  // STEP 6: Put the values into the HTML elements
  // =============================================

  cityEl.textContent       = cityName;
  dateEl.textContent       = niceDate;
  tempEl.textContent       = temp;
  conditionEl.textContent  = condition;
  humidityEl.textContent   = humidity + '%';
  windEl.textContent       = wind + ' km/h';
  visibilityEl.textContent = visibility + ' km';

  // Set the weather icon
  const iconClass = getWeatherIcon(iconCode);
  iconEl.className = 'wi ' + iconClass + ' weather-icon';
}


// =============================================
// STEP 7: Listen for the search form submit
//         When user clicks Search, get the weather for what they typed
// =============================================

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();              // stop page from reloading

  const city = searchInput.value.trim(); // get what the user typed

  if (city !== '') {
    getWeather(city);
  }
});


// =============================================
// STEP 8: Load Dhaka weather when page first opens
// =============================================

getWeather('Dhaka');

