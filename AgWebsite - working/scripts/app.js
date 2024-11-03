document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and content
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Weather functionality
    const getWeatherButton = document.getElementById('get-weather');
    const locationInput = document.getElementById('location-input');

    getWeatherButton.addEventListener('click', async () => {
        const location = locationInput.value;
        if (location) {
            try {
                const weatherModule = await import('./weather.js');
                weatherModule.fetchWeather(location);
            } catch (error) {
                console.error('Error loading weather module:', error);
            }
        } else {
            alert('Please enter a location.');
        }
    });

    // Map functionality
    const loadMapButton = document.getElementById('load-map');
    const mapLocationInput = document.getElementById('map-location-input');

    loadMapButton.addEventListener('click', () => {
        const location = mapLocationInput.value;
        if (location) {
            window.updateMapLocation(location);
        } else {
            alert('Please enter a location for the map.');
        }
    });

    // Livestock functionality
    const livestockForm = document.getElementById('livestock-form');

    livestockForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const livestockModule = await import('./livestock.js');
            const name = document.getElementById('livestock-name').value;
            const type = document.getElementById('livestock-type').value;
            const age = document.getElementById('livestock-age').value;
            
            livestockModule.addLivestock({ name, type, age });
            livestockForm.reset();
        } catch (error) {
            console.error('Error loading livestock module:', error);
        }
    });
});
