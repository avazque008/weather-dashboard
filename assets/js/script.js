var fetchWeather = function(query) {
    var apiQuery = "https://api.openweathermap.org/geo/1.0/direct?q=" + query +"&limit=1&appid=d57280069cb6a67e1228bb42e1a9ba6d";    
    fetch(apiQuery).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayHistory(data[0].name, data[0].lat, data[0].lon);
                fetchForecast(data[0].name, data[0].lat, data[0].lon);
            });
        } else {
            alert("Location not found!");
        }
    }).catch(function (error) {
        alert("Unable to get weather");
    });
};


var fetchForecast = function(city, lat, lon) {
    var forecastApiUrl =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=d57280069cb6a67e1228bb42e1a9ba6d";
    
    fetch(forecastApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayForecast(city, data);
            });
        } else {
            alert("Location not found!");
        }
    }).catch(function (error) {
        alert("Unable to get weather");
    });     
};

var displayForecast = function(city, forecastWeather) {


    document.getElementById("weather-city").textContent = city;
    document.getElementById("weather-current-date").textContent = moment().format("M/DD/YYYY");
    document.getElementById("weather-icon").setAttribute("src", `https://openweathermap.org/img/wn/${forecastWeather.current.weather[0].icon}@2x.png`)
    document.getElementById("weather-current-temp").textContent = forecastWeather.current.temp + " °F";
    document.getElementById("weather-current-wind").textContent = forecastWeather.current.wind_speed + " MPH";
    document.getElementById("weather-current-humidity").textContent = forecastWeather.current.humidity + " %";
    document.getElementById("weather-current-uv").textContent = forecastWeather.current.uvi;
    
    if (forecastWeather.current.uvi <= 2) {
        $(".uv").removeClass("moderate high severe");
        $(".uv").addClass("low");
    } else if (forecastWeather.current.uvi <= 5) {
        $(".uv").removeClass("low high severe");
        $(".uv").addClass("moderate");
    } else if (forecastWeather.current.uvi <= 7) {
        $(".uv").removeClass("low moderate severe");
        $(".uv").addClass("high");
    } else {
        $(".uv").removeClass("low moderate high");
        $(".uv").addClass("severe");
    }

    for (var i = 1; i < 6; i++) {
        var day = forecastWeather.daily[i];
        document.getElementById(`day${i}Date`).textContent = moment(day.dt * 1000).format("M/DD/YYYY");
        document.getElementById(`day${i}Temp`).textContent = day.temp.max + " °F";
        document.getElementById(`day${i}Wind`).textContent = day.wind_speed + " MPH";
        document.getElementById(`day${i}Hum`).textContent = day.humidity + " %";
        var img = document.getElementById(`day${i}Img`);
        img.setAttribute("src", `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`)
        img.setAttribute("alt", day.weather[0].description);
    }
};

var displayHistory = function(name, lat, lon) {
    var history = [];
    var savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
        history = JSON.parse(savedHistory);
    }

    if (name && lat && lon) {
        history.push({
            name: name,
            lat: lat,
            lon: lon
        });
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }

    var searchHistory = document.getElementById("search-history");
    searchHistory.innerHTML = "";
    for (var i = history.length-1; i >= 0; i--) {
        var log = document.createElement("button");
        log.setAttribute("class", "search-history-btn")
        log.setAttribute("data-lat", history[i].lat);
        log.setAttribute("data-lon", history[i].lon);
        log.innerText = history[i].name;
        searchHistory.appendChild(log);
    }

};

var searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", function() {
    var query = document.getElementById("search-city").value;

    fetchWeather(query);
});

$("#search-history").on("click", "button", function(event) {
    $("#search-city").val(event.target.innerText);
    displayHistory(event.target.innerText, event.target.dataset.lat, event.target.dataset.lon);
    fetchForecast(event.target.innerText, event.target.dataset.lat, event.target.dataset.lon);
});

displayHistory();