// Create a map object
var myMap = L.map("map", {
  center: [37.09, 0],
  zoom: 2
});

// "access_token=pk.eyJ1IjoiY2VzMjcxIiwiYSI6ImNqZWc0N2Z5OTFvc2IzOW83Mzd3MGQ0dnMifQ.JRh9OvYI46C4wssFMMeETg"
L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoicGFyeml2YWw2MTEiLCJhIjoiY2pteHBpbHptMTV2dDNwcnVmZXVwOTd1MCJ9.Zb8ZhLIxPuFEtEuuwglfhg"
).addTo(myMap);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Define a markerSize function that will give each earthquake a different radius based on magnitude
function markerSize(mag) {
  return mag * 2;
};

function markerColor(mag) { 
  if (mag <3) {return "#c7ff44"}
  else if (mag < 4 ) {return "#00c889"}
  else if (mag < 5 ) {return "#008395"}
  else {return "#003f5c"}
};


// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, 
          {
            color: "white",
            weight: 1,
            fillColor: markerColor(feature.properties.mag),
            fillOpacity: 0.5,
            radius: markerSize(feature.properties.mag)
            
          }
        )},
      
    

    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Giving each feature a pop-up with information about the earthquake
      layer.bindPopup("<h4>" + feature.properties.title + "</h4> <p>Alert: " + feature.properties.alert + "</p>");

    }
  }).addTo(myMap);
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
