const socket = io();
let map;
const markers = {};
let myId = null;

socket.on("connect", () => {
    myId = socket.id;
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send location", { latitude, longitude });

            if (!map) {
                map = L.map("map").setView([latitude, longitude], 13);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 19,
                }).addTo(map);
            }

            if (!markers['self']) {
                markers['self'] = L.marker([latitude, longitude], {
                    icon: L.icon({
                        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })
                }).addTo(map).bindPopup("You are here").openPopup();
            } else {
                animateMarker(markers['self'], [latitude, longitude]);
            }
        },
        (err) => {
            console.log(err);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;

    if (id === myId) return; // Skip updating self's location since it's already handled.

    if (!markers[id]) {
        markers[id] = L.marker([latitude, longitude], {
            icon: L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map).bindPopup(`User ${id}`);
    } else {
        animateMarker(markers[id], [latitude, longitude]);
    }
});

socket.on('user-disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

function animateMarker(marker, newLatLng) {
    const startLatLng = marker.getLatLng();
    const duration = 1000;
    const steps = 20;
    let step = 0;

    function move() {
        step++;
        const lat = startLatLng.lat + (newLatLng[0] - startLatLng.lat) * (step / steps);
        const lng = startLatLng.lng + (newLatLng[1] - startLatLng.lng) * (step / steps);
        marker.setLatLng([lat, lng]);

        if (step < steps) {
            requestAnimationFrame(move);
        }
    }

    requestAnimationFrame(move);
}
