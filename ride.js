let map = L.map('map').setView([9.0820, 8.6753], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'© OpenStreetMap'
}).addTo(map);

let pickupMarker = null;
let destinationMarker = null;
let routeLine = null;
let selectingPickup = true;
let lastDistance = "";
let lastDuration = "";

/* Live Location */
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position=>{
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        map.setView([lat,lng],13);
        L.marker([lat,lng]).addTo(map)
            .bindPopup("Your Current Location")
            .openPopup();
    });
}

/* Click Map */
map.on('click', function(e){

    if(selectingPickup){
        if(pickupMarker) map.removeLayer(pickupMarker);
        pickupMarker = L.marker(e.latlng).addTo(map);
        document.getElementById("pickupInput").value =
            e.latlng.lat.toFixed(5)+", "+e.latlng.lng.toFixed(5);
        selectingPickup = false;
    }else{
        if(destinationMarker) map.removeLayer(destinationMarker);
        destinationMarker = L.marker(e.latlng).addTo(map);
        document.getElementById("destinationInput").value =
            e.latlng.lat.toFixed(5)+", "+e.latlng.lng.toFixed(5);
        selectingPickup = true;
        drawRoute();
    }

});

/* Draw Route */
function drawRoute(){

    if(!pickupMarker || !destinationMarker) return;

    let start = pickupMarker.getLatLng();
    let end = destinationMarker.getLatLng();

    fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`)
    .then(res=>res.json())
    .then(data=>{

        if(routeLine) map.removeLayer(routeLine);

        let route = data.routes[0];
        routeLine = L.geoJSON(route.geometry,{
            style:{color:'#2563eb', weight:5}
        }).addTo(map);

        lastDistance = (route.distance/1000).toFixed(2) + " km";
        lastDuration = (route.duration/60).toFixed(0) + " mins";

        document.getElementById("rideInfo").innerHTML =
            "Distance: "+lastDistance+"<br>Estimated Time: "+lastDuration;

    });
}

/* Submit Ride */
function submitRide(){

    let phone = document.getElementById("phoneInput").value;
    let pickup = document.getElementById("pickupInput").value;
    let destination = document.getElementById("destinationInput").value;

    if(phone === "" || pickup === "" || destination === ""){
        alert("Please fill all fields and select locations.");
        return;
    }

    let historyList = document.getElementById("rideHistory");

    let li = document.createElement("li");
    li.innerHTML = `
        <strong>${phone}</strong><br>
        From: ${pickup}<br>
        To: ${destination}<br>
        ${lastDistance} • ${lastDuration}
    `;

    historyList.prepend(li);

    document.getElementById("phoneInput").value = "";
}