document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const vehicleNumber = document.getElementById("vehicleNumber").value;

    fetch("/vehicles/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            vehicleNumber: vehicleNumber
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to register vehicle");
            }
            return response.json();
        })
        .then(data => {
            console.log("Vehicle registered successfully:", data);
            // Optionally, you can perform additional actions here
        })
        .catch(error => {
            console.error("Error registering vehicle:", error);
        });
});

const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

// Function to process the fetched data and display on the map
function processAndDisplayData(data) {
    // Clear existing markers on the map
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Iterate over the array of vehicle data
    data.forEach(vehicle => {
        // Extract latitude and longitude from the vehicle data
        const latitude = vehicle.latitude;
        const longitude = vehicle.longitude;

        // Create a marker for each vehicle and add it to the map
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`<b>Vehicle Number:</b> ${vehicle.vehicleNumber}<br><b>Location:</b> ${latitude}, ${longitude}`)
            .openPopup();
    });
}
// "/vehicles/{id}"
function fetchAndDisplayVehicleData() {
    fetch("/vehicles")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch vehicle data");
            }
            return response.json();
        })
        .then(data => {
            processAndDisplayData(data);
        })
        .catch(error => {
            console.error("Error fetching vehicle data:", error);
        });
}
window.addEventListener("load", fetchAndDisplayVehicleData);