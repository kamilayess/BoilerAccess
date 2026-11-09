const map = L.map('map', {
    center: [40.4237, -86.9212],
    zoom: 16,
    scrollWheelZoom: false,
    dragging: true,
    zoomControl: true,
    doubleClickZoom: true
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const filters = [
  "wheelchair",
  "stairs",
  "slopes",
  "hazards"
];

filters.forEach(function(filterId) {
  const checkbox = document.getElementById(filterId);

  checkbox.addEventListener("change", function() {
    console.log(filterId + ": " + checkbox.checked);
  });
});

const startPoint = document.getElementById("startPoint");
const endPoint = document.getElementById("endPoint");
const planRouteButton = document.getElementById("planRouteButton");
const routeMessage = document.getElementById("routeMessage");

planRouteButton.addEventListener("click", function() {
  const start = startPoint.value;
  const end = endPoint.value;

  if (start === "" || end === "") {
    routeMessage.textContent = "Please select both locations.";
    return;
  }

  if (start === end) {
    routeMessage.textContent = "Please select different locations.";
    return;
  }


  routeMessage.textContent =
    "Demo route: " +
    startPoint.selectedOptions[0].text +
    " → " +
    endPoint.selectedOptions[0].text;

  drawRoute(start, end);
});


const locations = {
  walc: [40.4274, -86.9169],
  stewart: [40.4250, -86.9139],
  pmu: [40.4248, -86.9117],
  armstrong: [40.4313, -86.9146]
};

let routeLine = null;
let startMarker = null;
let endMarker = null;

function drawRoute(start, end) {
  // Remove the previous route
  if (routeLine) {
    map.removeLayer(routeLine);
  }

  if (startMarker) {
    map.removeLayer(startMarker);
  }

  if (endMarker) {
    map.removeLayer(endMarker);
  }

  const startCoords = locations[start];
  const endCoords = locations[end];

  routeLine = L.polyline(
    [startCoords, endCoords],
    {
      color: "#28a745",
      weight: 6,
      opacity: 0.85
    }
  ).addTo(map);

  startMarker = L.marker(startCoords)
    .addTo(map)
    .bindPopup("Starting Point");

  endMarker = L.marker(endCoords)
    .addTo(map)
    .bindPopup("Destination");

  map.fitBounds(routeLine.getBounds(), {
    padding: [50, 50]
  });
}

const reportButton = document.getElementById("reportButton");
const hazardForm = document.getElementById("hazardForm");
const submitHazard = document.getElementById("submitHazard");
const hazardLocation = document.getElementById("hazardLocation");

let selectedHazardLocation = null;
const hazardMarkers = L.layerGroup().addTo(map);

reportButton.addEventListener("click", function () {
  hazardForm.hidden = !hazardForm.hidden;
});

map.on("click", function (event) {
  if (hazardForm.hidden) return;

  selectedHazardLocation = event.latlng;
  hazardLocation.textContent = "Location selected on map.";
});

submitHazard.addEventListener("click", function () {
  const type = document.getElementById("hazardType").value;
  const description = document.getElementById("hazardDescription").value;

  if (!selectedHazardLocation) {
    alert("Please select a location on the map.");
    return;
  }

  const marker = L.circleMarker(selectedHazardLocation, {
    radius: 9,
    color: "#b91c1c",
    fillColor: "#ef4444",
    fillOpacity: 0.9
  }).addTo(hazardMarkers);

  const popup = document.createElement("div");
  const heading = document.createElement("strong");
  heading.textContent = type;
  const details = document.createElement("p");
  details.textContent = description || "Accessibility hazard reported.";

  popup.append(heading, details);
  marker.bindPopup(popup).openPopup();

  hazardForm.hidden = true;
  selectedHazardLocation = null;
  hazardLocation.textContent = "No location selected";
  document.getElementById("hazardDescription").value = "";

  alert("Hazard reported successfully!");
});
