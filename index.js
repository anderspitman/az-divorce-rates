var min = 9999;
var max = 0;
const year = 2015;
const divisionsCount = 7;

var mapboxAccessToken = "pk.eyJ1IjoiYW5kZXJzcGl0bWFuIiwiYSI6ImNpenJuNXpidzAxNjUzM281bnM3aWxveDEifQ.dG0CVtiRX3PEWdYbpoGI2w"
var map = L.map('map').setView([34.0489, -111.0937], 6);
var mapQuantile = L.map('map_quantile').setView([34.0489, -111.0937], 6);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light'
    //attribution: ...
}).addTo(map);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light'
    //attribution: ...
}).addTo(mapQuantile);

var parseOptions = {
  header: true,
  download: true,
  complete: dataReady
};
Papa.parse("dissolution_rate_data.csv", parseOptions);

function dataReady(results) {

  var data = convertData(results.data);

  populateGeoJson(data, countyData);

  L.geoJson(countyData, { style: styleEqualInterval }).addTo(map);
  L.geoJson(countyData, { style: styleQuantile }).addTo(mapQuantile);
}

function convertData(data) {
  data.forEach(function(row) {
    row.year = +row.year;
    row.dissolutionRate = +row.dissolutionRate;
  });
  return data;
}

function populateGeoJson(data, geojson) {
  geojson.features.forEach(function(county) {
    data.forEach(function(row) {
      if (row.year === year && row.county === county.properties.NAME) {
        county.properties.dissolutionRate = row.dissolutionRate;
        if (row.dissolutionRate < min) {
          min = row.dissolutionRate;
        }
        if (row.dissolutionRate > max) {
          max = row.dissolutionRate;
        }
      }
    });
  });
}

const colors = ['#feedde','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#8c2d04'];

function colorEqualInterval(d) {
  var divisionSize = (max - min) / (divisionsCount - 1);
  var index = Math.floor(d / divisionSize) - 1;
  return colors[index];
}

function colorQuantiles(d) {
  return d > 4.2 ? colors[6]:
         d > 3.9 ? colors[5]:
         d > 3.4 ? colors[4]:
         d > 2.9 ? colors[3]:
         d > 2.2 ? colors[2]:
         d > 1.6 ? colors[1]:
                   colors[0];
}

function style(color) {
  return {
    fillColor: color,
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function styleEqualInterval(feature) {
  return style(colorEqualInterval(feature.properties.dissolutionRate));
}

function styleQuantile(feature) {
  return style(colorQuantiles(feature.properties.dissolutionRate));
}
