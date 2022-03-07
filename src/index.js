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

// Search City
function showSearchTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let updatedTemperature = document.querySelector("#current-temp");
  updatedTemperature.innerHTML = `${temperature}°F`;
  console.log(response);
}

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

  axios.get(apiUrl).then(showSearchTemperature);
}

let userCitySearch = document.querySelector("#search-form");
userCitySearch.addEventListener("submit", citySearch);

// Current City
function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let updatedTemperature = document.querySelector("#current-temp");
  updatedTemperature.innerHTML = `${temperature}°F`;
  // console.log(response);
  let currentCity = response.data.name;
  let currentCityName = document.querySelector("#active-city-title");
  currentCityName.innerHTML = `${currentCity}`;
}

function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "imperial";
  let apiUrl = `${endPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function currentCityButton(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

let currentCityInfo = document.querySelector("#current-location-button");
currentCityInfo.addEventListener("click", currentCityButton);
