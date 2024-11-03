let map;
let marker;

function initMap(address = null) {
    console.log('Initializing map...');
    
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined') {
        console.log('Google Maps not yet loaded, retrying...');
        setTimeout(() => initMap(address), 1000);
        return;
    }

    try {
        const mapElement = document.getElementById("map");
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        const defaultLocation = { lat: 38.9451, lng: -92.3289 };
        // London

        if (!map) {
            console.log('Creating new map instance');
            map = new google.maps.Map(mapElement, {
                zoom: 2,
                center: defaultLocation,
                mapTypeId: 'roadmap'
            });
        }

        if (address) {
            const geocoder = new google.maps.Geocoder();
            console.log('Geocoding address:', address);
            
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK') {
                    const location = results[0].geometry.location;
                    console.log('Location found:', location.toString());
                    
                    map.setCenter(location);
                    map.setZoom(12);

                    if (marker) {
                        marker.setMap(null);
                    }

                    marker = new google.maps.Marker({
                        map: map,
                        position: location,
                        animation: google.maps.Animation.DROP
                    });
                } else {
                    console.error('Geocoding failed:', status);
                    alert('Could not find this location. Please try another search.');
                }
            });
        }
    } catch (error) {
        console.error('Map initialization error:', error);
        alert('Error loading map. Please check console for details.');
    }
}

// Make initMap available globally
window.initMap = initMap;

// Expose a function to update the map location
window.updateMapLocation = function(address) {
    initMap(address);
};