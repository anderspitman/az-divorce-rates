var fs = require('fs');

var fileData = fs.readFileSync('us_counties.geojson');

var data = JSON.parse(fileData);

// Arizona
var state = "04";

var outData = {
  type: data.type,
  features: []
};

data.features.forEach(function(feature) {
  if (feature.properties.STATE === state) {
    //console.log(feature.properties.NAME);
    outData.features.push(feature);
  }
});

console.log(outData);

fs.writeFileSync('az_counties.geojson', JSON.stringify(outData));
