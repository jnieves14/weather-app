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
let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
let endPoint = "https://api.openweathermap.org/data/2.5/weather";

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

  let activeTempL = Math.round(response.data.main.temp_min);
  let activeTempLelement = document.querySelector("#active-city-tempL");
  activeTempLelement.innerHTML = `${activeTempL}`;

  let activeTempH = Math.round(response.data.main.temp_max);
  let activeTempHelement = document.querySelector("#active-city-tempH");
  activeTempHelement.innerHTML = `${activeTempH}`;

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
    `https://openweathermap.org/img/wn/01n@2x.png`
  );
}

// Functions for city search engine
function citySearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  cityInput = cityInput.value.trim().split(" ").join("").toLowerCase();
  let units = "imperial";
  let apiUrl = `${endPoint}?q=${cityInput}&appid=${apiKey}&units=${units}`;

  let searchCityName = document.querySelector("#active-city-title");

  if (cityInput) {
    searchCityName.innerHTML = `${cityInput.toUpperCase()}`;
  } else {
    searchCityName.innerHTML = null;
    alert(`Sorry, please enter a city.`);
  }

  axios.get(apiUrl).then(showTemperature);
  console.log(apiUrl);
}

let userCitySearch = document.querySelector("#search-form");
userCitySearch.addEventListener("submit", citySearch);

// Functions for current city
function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "imperial";
  let apiUrl = `${endPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
  console.log(apiUrl);
}

function currentCityButton(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

let currentCityInfo = document.querySelector("#current-location-button");
currentCityInfo.addEventListener("click", currentCityButton);

window.onload = currentCityButton;

// Temperature conversion functions
let fahrenheitTemperature = null;

function showCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("tempLinks");
  fahrenheitLink.classList.add("tempLinks");
  let celsiusTemperature = (fahrenheitTemperature - 32) * (5 / 9);
  // TODO: make updatedTemperature a global variable as it is used multiple times
  let updatedTemperature = document.querySelector("#current-temp");
  updatedTemperature.innerHTML = Math.round(celsiusTemperature);
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemperature);

function showFahrenheitTemperature(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("tempLinks");
  celsiusLink.classList.add("tempLinks");
  let updatedTemperature = document.querySelector("#current-temp");
  updatedTemperature.innerHTML = Math.round(fahrenheitTemperature);
}
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);
