// initial draw of map
var map = L.map('map').setView([39.8283, -98.5795], 3);

// draw actual map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// store API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// get data with d3
d3.json(queryUrl).then(function(data) {

  // ? is if 
function getValue(x) {
	return x > 90 ? "#F06A6A" :
	       x > 70 ? "#F0A76A" :
	       x > 50 ? "#F3B94C" :
	       x > 30 ? "#F3DB4C" :
	       x > 10 ? "#E1F34C" :
	         "#B6F34C";
}

function style(feature) {
	return {
		fillColor: getValue(feature.geometry.coordinates[2]),
		stroke: true, 
    color: "#000",
    weight: 0.5,
    fillOpacity: 0.8,
    radius: feature.properties.mag * 3
	};
}


var dat = L.geoJson(data, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, style(feature));
	},

    // binding popups
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />magnitude: " +
        feature.properties.mag + "<br /><br />depth:" + feature.geometry.coordinates[2]);
    }
  }).addTo(map);
  
  // legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let colors = ['#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A'];
    let labels = [-10, 10, 30, 50, 70, 90];

    for (let i = 0; i < labels.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + labels[i] + (labels[i + 1] ? "&ndash;" + labels[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // add legend to map
  legend.addTo(map);

});


