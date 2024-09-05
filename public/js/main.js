const socket = io();
let map;
let routeControl = null;
let carMarker = null;

document.getElementById("startRoute").addEventListener("click", async () => {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;

    if (from && to) {
        const fromCoords = await getCoordinates(from);
        const toCoords = await getCoordinates(to);

        if (fromCoords && toCoords) {
            socket.emit("send-route", { fromCoords, toCoords });
            calculateRoute(fromCoords, toCoords);
        } else {
            alert("Could not find one or both locations.");
        }
    }
});

socket.on("receive-route", (data) => {
    const { fromCoords, toCoords } = data;
    calculateRoute(fromCoords, toCoords);
});

async function getCoordinates(location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return [parseFloat(lat), parseFloat(lon)];
    }

    return null;
}

function calculateRoute(fromCoords, toCoords) {
    if (routeControl) {
        map.removeControl(routeControl);
    }

    routeControl = L.Routing.control({
        waypoints: [
            L.latLng(...fromCoords),
            L.latLng(...toCoords)
        ],
        routeWhileDragging: true
    }).addTo(map);

    routeControl.on('routesfound', function (e) {
        const route = e.routes[0];
        setTimeout(() => {
            moveCar(route.coordinates);
        }, 3000);
    });
}

function moveCar(routeCoordinates) {
    if (carMarker) {
        map.removeLayer(carMarker);
    }

    carMarker = L.marker(routeCoordinates[0], {
        icon: L.icon({
            iconUrl: '/images/car.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        })
    }).addTo(map);

    let i = 0;
    const interval = setInterval(() => {
        if (i < routeCoordinates.length) {
            carMarker.setLatLng(routeCoordinates[i]);
            socket.emit("update-car-position", { latLng: routeCoordinates[i] }); // Emit to server
            i++;
        } else {
            clearInterval(interval);
        }
    }, 100);
}

socket.on("update-car-on-map", (data) => {
    if (!carMarker) {
        carMarker = L.marker(data.latLng, {
            icon: L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            })
        }).addTo(map);
    } else {
        carMarker.setLatLng(data.latLng);
    }
});

if (!map) {
    map = L.map("map").setView([20.5937, 78.9629], 5); // Default view over India
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
    }).addTo(map);
}
