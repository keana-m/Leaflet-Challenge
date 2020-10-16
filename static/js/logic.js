// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Color by magnitude
function getColor(d) {
  return d > 5 ? "#ea2c2c":
  d > 4 ? "#ea822c":
  d > 3 ? "#ee9c00":
  d > 2 ? "#eecc00":
  d > 1 ? "#dcef49":
          "#bdef48";
}

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place, time, and magnitude of the earthquake
// Create a GeoJSON layer containing the features array on the earthquakeData object
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {  
      pointToLayer: function(feature,latlng) {
        return L.circleMarker(latlng, {radius: (feature.properties.mag * 4),
          fillColor: getColor(feature.properties.mag),
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "<br>" +
          "Magnitude: " + feature.properties.mag);
      }  
  });
  // Sending earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var map = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    accessToken: apiKey});

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    accessToken: apiKey});
 
  // Define a baseMaps object to hold base layers
  var baseMaps = {
    "Outdoors": map,
    "Dark Map": darkmap
  };

  // Create overlay object to hold overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the map and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [map, earthquakes]
  });
  
  // Create a legend and add it to map
  var legend = L.control({position: "bottomright"});
  
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];
  
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp</i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    console.log(div)
  };
  legend.addTo(myMap);

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

};
