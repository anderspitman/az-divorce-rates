import './small_map';

console.log("4");
const mins = {};
const maxes = {};

const year = 2015;
const divisionsCount = 7;
const startYear = 2010;
const endYear = 2015;
const yearRange = endYear - startYear;

// from colorbrewer
const colors = Immutable.List([
  '#feedde',
  '#fdd0a2',
  '#fdae6b',
  '#fd8d3c',
  '#f16913',
  '#d94801',
  '#8c2d04'
]);

const mapboxAccessToken = "pk.eyJ1IjoiYW5kZXJzcGl0bWFuIiwiYSI6ImNpenJuNXpidzAxNjUzM281bnM3aWxveDEifQ.dG0CVtiRX3PEWdYbpoGI2w"
const mapUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
const map = L.map('map').setView([34.0489, -111.0937], 6);
//const mapQuantile = L.map('map_quantile').setView([34.0489, -111.0937], 6);

L.tileLayer(mapUrl, {
    id: 'mapbox.light',
    accessToken: mapboxAccessToken
}).addTo(map);

//L.tileLayer(mapUrl, {
//    id: 'mapbox.light',
//    accessToken: mapboxAccessToken
//}).addTo(mapQuantile);

let smallMaps = [];
for (let i = 0; i <= yearRange; i++) {
  const currYear = 2010 + i;
  const mapId = "map_small_multiple_" + currYear;

  const mapOptions = {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    boxZoom: false,
    doubleClickZoom: false,
    touchZoom: false
  };

  const smallMap = L.map(mapId, mapOptions).setView([34.0489, -111.0937], 5);

  L.tileLayer(mapUrl, {
      id: 'mapbox.light',
      accessToken: mapboxAccessToken
  }).addTo(smallMap);

  smallMaps.push(smallMap);
}

const parseOptions = {
  header: true,
  download: true,
  complete: dataReady
};
Papa.parse("dissolution_rate_data.csv", parseOptions);

function dataReady(results) {

  const data = convertData(results.data);

  populateGeoJson(data, countyData);

  const mapOptions = {
    style: styleEqualInterval,
    onEachFeature: onEachFeature
  };
  L.geoJson(countyData, mapOptions).addTo(map);
  //L.geoJson(countyData, { style: styleQuantile }).addTo(mapQuantile);

  smallMaps.forEach(function(smallMap, index) {
    const styleFunc = function(feature) {
      return styleSmallMultiple(feature, 2010 + index);
    };
    L.geoJson(countyData, { style: styleFunc }).addTo(smallMap);
  });
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

    county.properties.dissolutionData = {};

    data.forEach(function(row) {

      if (row.county === county.properties.NAME) {
        county.properties.dissolutionData[row.year] = row.dissolutionRate;
      }

      if (!mins[row.year]) mins[row.year] = 9999;
      if (!maxes[row.year]) maxes[row.year] = 0;

      if(row.dissolutionRate < mins[row.year]) {
        mins[row.year] = row.dissolutionRate;
      }
      if(row.dissolutionRate > maxes[row.year]) {
        maxes[row.year] = row.dissolutionRate;
      }

    });
  });

  console.log(geojson);
}

function colorEqualInterval(d, year) {
  const divisionSize = (maxes[year] - mins[year]) / (divisionsCount - 1);
  const index = Math.floor(d / divisionSize) - 1;
  return colors.get(index);
}

//function colorQuantiles(d) {
//  return d > 4.2 ? colors.get(6):
//         d > 3.9 ? colors.get(5):
//         d > 3.4 ? colors.get(4):
//         d > 2.9 ? colors.get(3):
//         d > 2.2 ? colors.get(2):
//         d > 1.6 ? colors.get(1):
//                   colors.get(0);
//}

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

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature
    //mouseout: resetHighlight,
    //click: zoomToFeature
  });
}

function highlightFeature(e) {
  const layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function styleEqualInterval(feature) {
  return style(colorEqualInterval(feature.properties.dissolutionData[year], year));
}

//function styleQuantile(feature) {
//  return style(colorQuantiles(feature.properties.dissolutionData[year]));
//}

function styleSmallMultiple(feature, year) {
  return style(colorEqualInterval(feature.properties.dissolutionData[year], year));
}
