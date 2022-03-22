let currenTime = new Date();
let date = currenTime.getDate();
let hours = currenTime.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = currenTime.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let year = currenTime.getFullYear();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[currenTime.getDay()];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = months[currenTime.getMonth()];

let newUserDate = document.querySelector("#user-date");
newUserDate.innerHTML = `${month} ${date}, ${year}`;

let newUserTime = document.querySelector("#user-time");
newUserTime.innerHTML = `${day} ${hours}:${minutes}`;

// Global API variables
let units = "imperial";
let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
let endPoint = "https://api.openweathermap.org/data/2.5/";

// Function to format the day for the forecast row
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  return days[day];
}

// Function to display forecast
function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2 weatherForecastDay">${formatDay(forecastDay.dt)}
        <br>
        <img src="https://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }.png" alt="" />
        <br>
        <span class="forecastMinTemp">${Math.round(
          forecastDay.temp.min
        )}°F</span>| 
        <span class="forecastMaxTemp">${Math.round(
          forecastDay.temp.max
        )}°F</span>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Function to get coordinates
function getCoordinatesForecast(coordinates) {
  console.log(coordinates);
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;
  let apiUrl = `${endPoint}onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  console.log("getCoordinatesForecast", apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

// Function to grab API weather info
function showTemperature(response) {
  fahrenheitTemperature = Math.round(response.data.main.temp);
  let updatedTemperature = document.querySelector("#current-temp");
  updatedTemperature.innerHTML = `${fahrenheitTemperature}`;
  // console.log(response);
  let currentCity = response.data.name;
  let currentCityName = document.querySelector("#active-city-title");
  currentCityName.innerHTML = `${currentCity}`;

  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = `${description}`;

  let mainMinTempApi = Math.round(response.data.main.temp_min);
  let mainMinTempElement = document.querySelector("#mainMinTemp");
  mainMinTempElement.innerHTML = `${mainMinTempApi}`;

  let mainMaxTempApi = Math.round(response.data.main.temp_max);
  let mainMaxTempElement = document.querySelector("#mainMaxTemp");
  mainMaxTempElement.innerHTML = `${mainMaxTempApi}`;

  let activeWind = Math.round(response.data.wind.speed);
  let activeWindElement = document.querySelector("#active-city-wind");
  activeWindElement.innerHTML = `${activeWind} mph`;

  let activeHumidity = Math.round(response.data.main.humidity);
  let activeHumidityElement = document.querySelector("#active-city-humidity");
  activeHumidityElement.innerHTML = `${activeHumidity} %`;

  let activeIcon = response.data.weather[0].icon;
  let activeIconElement = document.querySelector("#active-icon");
  activeIconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${activeIcon}.png`
  );

  getCoordinatesForecast(response.data.coord);
}

// Functions for city search engine
function citySearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  cityInput = cityInput.value.trim().split(" ").join("").toLowerCase();
  let apiUrl = `${endPoint}weather?q=${cityInput}&appid=${apiKey}&units=${units}`;

  let searchCityName = document.querySelector("#active-city-title");

  if (cityInput) {
    searchCityName.innerHTML = `${cityInput.toUpperCase()}`;
  } else {
    searchCityName.innerHTML = null;
    alert(`Sorry, please enter a city.`);
  }

  axios.get(apiUrl).then(showTemperature);
  // For Debugging purposes
  // console.log("city search", apiUrl);
}

let userCitySearch = document.querySelector("#search-form");
userCitySearch.addEventListener("submit", citySearch);

// Functions for current city
function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `${endPoint}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
  // console.log(apiUrl);
}

function currentCityButton(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

let currentCityInfo = document.querySelector("#current-location-button");
currentCityInfo.onclick = function () {
  console.log("Current city button clicked.");
};
currentCityInfo.addEventListener("click", currentCityButton);

window.onload = currentCityButton;
