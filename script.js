// Get all the elements needed

function getElement(elementId) {
    let element = document.getElementById(elementId)
    return element
}

const timeE1 = getElement("time")
const dateE1 = getElement("date")
const currentWeatherItemsE1 = getElement("current-weather-items")
const timezone = getElement("time-zone")
const countryE1 = getElement("country")
const wheatherForecastE1 = getElement("weather-forecast")
const currentTempE1 = getElement("current-temp")

const API_KEY = "cc139d2d39e66b5849c0e6f240f85504"

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const searchButton = getElement("button-search")
let inputValue = getElement("input-value")
let cityName = getElement("country")
let temphighlight = getElement("temp-highlight")




function updateClock() {
    const time = new Date()
    const month = time.getMonth()
    const date = time.getDate()
    const day = time.getDay()
    const hour = time.getHours()
    const hoursIn12Format = hour >= 13 ? hour % 12 : hour
    const minutes = ("0" + time.getMinutes()).slice(-2)
    const amPm = hour >= 12 ? "PM" : "AM"



    timeE1.innerHTML = hoursIn12Format + ":" + minutes + "" + `<span id="am-pm">${amPm}</span>`
    dateE1.innerHTML = days[day] + " , " + date + " " + months[month]

}

setInterval(updateClock, 1000)


getWeatherData()

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success => {
        // console.log(success)

        let { latitude, longitude } = success.coords

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {

                console.log(data)
                showWeatherData(data)
            })


    })
    )

}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timezone.innerHTML = data.timezone.replace(/_/g, ' ');
    countryE1.innerHTML = data.lat + " N " + data.lon + " E "

    currentWeatherItemsE1.innerHTML =
        `<div class="wheater-item">
        <div>Humidity</div>
        <div>${humidity} %</div>
    </div>
    <div class="wheater-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="wheater-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="wheater-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="wheater-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>`


    let otherDayForecast = ``
    data.daily.forEach((day, idx) => {
        if (idx == 0) {

            currentTempE1.innerHTML = `
            <div class="todaynew" id="current-temp">
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="others">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <div class="temp">Day ${day.temp.day}&#176 C</div>
                <div class="temp">Night ${day.temp.night}&#176; C</div> 
            </div>`

            temphighlight.innerHTML = `
            <h3 id="temp-highlight">${day.temp.day}&#176; C</h3>`


        } else {
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Day ${day.temp.day}&#176; C</div>
                <div class="temp">Night ${day.temp.night}&#176; C</div>
            </div>`
        }
    })

    wheatherForecastE1.innerHTML = otherDayForecast

}



function getWeatherDataFromSearch() {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=` + inputValue.value + `&limit=1&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            const searchData = data
            console.log(searchData)

            let searchLatitude = searchData[0].lat
            let searchLongitude = searchData[0].lon

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${searchLatitude}&lon=${searchLongitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
                .then(res => res.json())
                .then(data => {

                    console.log(data)
                    showWeatherData(data)
                })

        })

    cityName.classList.add("show-city-name")

}

searchButton.addEventListener("click", getWeatherDataFromSearch)
