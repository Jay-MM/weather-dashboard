const cityInput = document.getElementById('city-input')
const searchBtn = document.getElementById('searchBtn')
const cityList = document.getElementById('city-list')
const city = document.getElementById('city')
const temp = document.getElementById('temp')
const wind = document.getElementById('wind')
const humidity = document.getElementById('humidity')
const forecastList = document.getElementById('forecast-list')
const weatherIcon = document.getElementById('weather-icon')

const APIKey = "28eae053c6ca73df3953c048986a5de4"
const currentDate = moment().format('MM-DD-YYYY')

function onload() {
    cityList.innerHTML = ""
    let citySearches = JSON.parse(localStorage.getItem('citySearches')) || []
    for (let i = 0; i < citySearches.length; i++) {
        let cityIndex = citySearches[i]
        let li = document.createElement('li')
        li.classList.add('recentSearches')
        li.textContent = cityIndex
        li.addEventListener('click', displaySavedWeather)
        cityList.appendChild(li)
    }
}

function submitCity() {
    cityList.innerHTML = ""
    cityName = cityInput.value.trim()
    let citySearches = JSON.parse(localStorage.getItem('citySearches')) || []
    citySearches.push(cityName)
    localStorage.setItem('citySearches', JSON.stringify(citySearches))
    for (let i = 0; i < citySearches.length; i++) {
        let cityIndex = citySearches[i]
        let li = document.createElement('li')
        li.classList.add('recentSearches')
        li.textContent = cityIndex
        li.addEventListener('click', displaySavedWeather)
        cityList.appendChild(li)
    }
    getCoordinates(cityName)
    cityInput.value = ""
}

function displaySavedWeather(event) {
    const cityName2 = event.target.textContent
    const requestCoordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName2 + '&limit=5&appid=' + APIKey

    fetch(requestCoordinates)
        .then(function (response2) {
            return response2.json()
        })
        .then(function (data) {
            let lat = data[0].lat
            let lon = data[0].lon
            getWeather(lat, lon)
        })
 }

function getCoordinates(cityName) {
    const requestCoordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + APIKey

    fetch(requestCoordinates)
        .then(function (response2) {
            return response2.json()
        })
        .then(function (data) {
            let lat = data[0].lat
            let lon = data[0].lon
            getWeather(lat, lon)
        })
}

function getWeather(lat, lon) {
    const requestWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey

    fetch(requestWeather)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            let weatherData = data
            displayWeather(weatherData)
        })
}       

function displayWeather(weatherData) {
    city.textContent = weatherData.city.name + ' ' + currentDate
    weatherIcon.setAttribute('src', "https://openweathermap.org/img/wn/" + weatherData.list[0].weather[0].icon + ".png")
    temp.textContent = 'Temp: ' + (((weatherData.list[0].main.temp - 273) * 1.8) + 32).toFixed(2) + ' °F'
    wind.textContent = 'Wind: ' + weatherData.list[0].wind.speed + ' MPH'
    humidity.textContent = 'Humidity: ' + weatherData.list[0].main.humidity + '%'
    displayForecast(weatherData)
}

function displayForecast(weatherData) {
    const weatherList = weatherData.list
    console.log(weatherList)
    forecastList.innerHTML = ""
    for (let i = 1; i < 6; i++) {
        forecastIndex = weatherList[i]
        console.log(forecastIndex)
        const fiveDayLi = document.createElement('li')
        fiveDayLi.classList.add('fiveDayInfo')
        forecastList.appendChild(fiveDayLi)
        const forecastCityHeader = document.createElement('h4')
        const forecastCityImage = document.createElement('img')
        const forecastCityTemp = document.createElement('p')
        const forecastCityWind = document.createElement('p')
        const forecastCityHumidity = document.createElement('p')

        // add image

        forecastCityHeader.textContent = moment().add(i, 'days').format('MM-DD-YYYY')
        forecastCityImage.setAttribute('class', 'forecast-icon')
        forecastCityImage.setAttribute('src', "https://openweathermap.org/img/wn/" + forecastIndex.weather[0].icon + ".png")
        forecastCityTemp.textContent = 'Temp: ' + (((forecastIndex.main.temp - 273) * 1.8) + 32).toFixed(2) + ' °F'
        forecastCityWind.textContent = 'Wind: ' + forecastIndex.wind.speed + ' MPH'
        forecastCityHumidity.textContent = 'Humidity: ' + forecastIndex.main.humidity + '%'

        fiveDayLi.appendChild(forecastCityHeader)
        fiveDayLi.appendChild(forecastCityImage)
        fiveDayLi.appendChild(forecastCityTemp)
        fiveDayLi.appendChild(forecastCityWind)
        fiveDayLi.appendChild(forecastCityHumidity)


    }

}
onload()
searchBtn.addEventListener('click', submitCity)