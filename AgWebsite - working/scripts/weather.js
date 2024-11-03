// weather.js
// Function to get the daily forecast
const getDailyForecast = (forecastData) => {
    const dailyForecast = {};

    // Iterate over the forecast data
    forecastData.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();

        // Initialize the day in the daily forecast if not already done
        if (!dailyForecast[date]) {
            dailyForecast[date] = {
                maxTemp: Math.round(forecast.main.temp_max),
                minTemp: Math.round(forecast.main.temp_min),
                weather: forecast.weather[0].description,
            };
        } else {
            // Update the max and min temperatures for the day
            dailyForecast[date].maxTemp = Math.max(dailyForecast[date].maxTemp, Math.round(forecast.main.temp_max));
            dailyForecast[date].minTemp = Math.min(dailyForecast[date].minTemp, Math.round(forecast.main.temp_min));
        }
    });

    // Convert the object into an array and limit it to the next 5 days
    return Object.entries(dailyForecast)
        .slice(0, 5)
        .map(([date, { maxTemp, minTemp, weather }]) => ({
            date,
            maxTemp,
            minTemp,
            weather,
        }));
};

export async function fetchWeather(location) {
    const API_KEY = 'dfdb73ee1677aec361ddc74c076b6a3f';
    const weatherOutput = document.getElementById('weather-output');

    try {
        weatherOutput.innerHTML = 'Loading weather data...';
        console.log(`Fetching weather for location: ${location}`);

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Weather data received:', data);

        // Fetch forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);

        if (!forecastResponse.ok) {
            throw new Error(`Forecast API Error: ${forecastResponse.status}`);
        }

        const forecastData = await forecastResponse.json();

        // Get daily forecast
        const dailyForecast = getDailyForecast(forecastData);

        // Check if the country uses Fahrenheit (e.g., US)
        const usesImperial = data.sys.country === 'US';

        const weatherHTML = `
            <div class="weather-info">
                <h3>${data.name}, ${data.sys.country}</h3>
                <p><strong>Current Temperature:</strong> ${usesImperial ? 
                    Math.round((data.main.temp * 9/5) + 32) + '°F' : 
                    Math.round(data.main.temp) + '°C'}</p>
                <p><strong>Feels Like:</strong> ${usesImperial ? 
                    Math.round((data.main.feels_like * 9/5) + 32) + '°F' : 
                    Math.round(data.main.feels_like) + '°C'}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${usesImperial ? 
                    (data.wind.speed * 2.23694).toFixed(2) + ' mph' : 
                    data.wind.speed + ' m/s'}</p>
                <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                <p><strong>Next 5 Days' Forecast:</strong></p>
                <ul>
                    ${dailyForecast.map(forecast => `
                        <li>
                            <strong>Date:</strong> ${forecast.date} - 
                            <strong>Max Temp:</strong> ${usesImperial ? 
                                Math.round((forecast.maxTemp * 9/5) + 32) + '°F' : 
                                forecast.maxTemp + '°C'}, 
                            <strong>Min Temp:</strong> ${usesImperial ? 
                                Math.round((forecast.minTemp * 9/5) + 32) + '°F' : 
                                forecast.minTemp + '°C'},
                            <strong>Weather:</strong> ${forecast.weather}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        weatherOutput.innerHTML = weatherHTML;
    } catch (error) {
        console.error('Weather fetch error:', error);
        weatherOutput.innerHTML = `Error: ${error.message}. Please try again.`;
    }
}
